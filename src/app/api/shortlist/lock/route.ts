import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { syncStageTasks } from "@/lib/stageTasks";

// Auto-generated tasks when university is locked
const GUIDANCE_TASKS = [
    { title: "Complete {university} Application Form", category: "Admin", hasAIReview: false },
    { title: "Prepare 2-3 Letters of Recommendation", category: "Documents", hasAIReview: false },
    { title: "Prepare Financial Documents", category: "Documents", hasAIReview: false },
    { title: "Request Official Transcripts", category: "Documents", hasAIReview: false },
    { title: "Update Resume/CV", category: "Documents", hasAIReview: false },
    { title: "Upload English Test Scores (IELTS/TOEFL)", category: "Documents", hasAIReview: false },
    { title: "Write Statement of Purpose for {university}", category: "Essay", hasAIReview: true },
];

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { universityId } = await req.json();
        if (!universityId) {
            return NextResponse.json({ error: "University ID is required" }, { status: 400 });
        }

        // Verify university is in shortlist
        const shortlist = await prisma.shortlist.findUnique({
            where: { userId_universityId: { userId: user.id, universityId } },
            include: { university: true },
        });

        if (!shortlist) {
            return NextResponse.json(
                { error: "University not in shortlist" },
                { status: 400 }
            );
        }

        const university = shortlist.university;
        const tasksToCreate = GUIDANCE_TASKS.map((task) => ({
            userId: user.id,
            title: task.title.replace("{university}", university.name),
            priority: "high",
            stage: 4,
            completed: false,
            due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }));

        // ATOMIC TRANSACTION: Lock university, create tasks, and generate SOP draft
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: user.id },
                data: {
                    lockedUniversityId: universityId,
                    currentStage: 4, // Move to Guidance stage
                },
            });

            await tx.task.createMany({ data: tasksToCreate });

            // Generate SOP Draft if it doesn't exist
            const existingSOP = await tx.document.findFirst({
                where: { userId: user.id, type: 'SOP', title: { contains: university.name } }
            });

            if (!existingSOP) {
                await tx.document.create({
                    data: {
                        userId: user.id,
                        title: `SOP for ${university.name}`,
                        type: 'SOP',
                        content: `Dear Admissions Committee at ${university.name},\n\nI am writing to express my strong interest in the program at ${university.name}. With my academic background and passion for this field, I believe I am a strong candidate...\n\n[This is an AI-generated draft based on your choice. Please edit this in the Documents section to add your personal achievements.]`,
                        status: 'draft'
                    }
                });
            }
        });

        // Sync stage tasks to handle auto-completion of previous stages
        await syncStageTasks(user.id, 4);

        return NextResponse.json({
            success: true,
            lockedUniversityId: universityId,
            tasksCreated: tasksToCreate.length,
        });
    } catch (error) {
        console.error("Error locking university:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ATOMIC TRANSACTION: Unlock university and delete guidance tasks
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: {
                    lockedUniversityId: null,
                    currentStage: 3, // Move back to Shortlist stage
                },
            }),
            prisma.task.deleteMany({
                where: {
                    userId: user.id,
                    stage: 4,
                },
            })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error unlocking university:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
