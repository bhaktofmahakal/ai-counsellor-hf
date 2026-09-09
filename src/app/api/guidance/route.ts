import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if university is locked
        if (!user.lockedUniversityId) {
            return NextResponse.json({ lockedUniversity: null, tasks: [] });
        }

        // Get locked university
        const university = await prisma.university.findUnique({
            where: { id: user.lockedUniversityId },
        });

        if (!university) {
            return NextResponse.json({ lockedUniversity: null, tasks: [] });
        }

        // Get guidance tasks
        const tasks = await prisma.task.findMany({
            where: {
                userId: user.id,
                stage: 4, // Guidance stage
            },
            orderBy: { createdAt: "asc" },
        });

        const formattedTasks = tasks.map((task) => {
            // Infer category from title
            let category = "Admin";
            if (task.title.toLowerCase().includes("letter") || task.title.toLowerCase().includes("document") || task.title.toLowerCase().includes("transcript") || task.title.toLowerCase().includes("resume") || task.title.toLowerCase().includes("test score")) {
                category = "Documents";
            } else if (task.title.toLowerCase().includes("statement") || task.title.toLowerCase().includes("essay") || task.title.toLowerCase().includes("sop")) {
                category = "Essay";
            }

            const hasAIReview = category === "Essay";

            return {
                id: task.id,
                title: task.title,
                category,
                completed: task.completed,
                hasAIReview,
            };
        });

        return NextResponse.json({
            lockedUniversity: {
                id: university.id,
                name: university.name,
                location: university.location || "Unknown",
                country: university.country,
            },
            tasks: formattedTasks,
        });
    } catch (error) {
        console.error("Error fetching guidance:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
