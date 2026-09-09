import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { completed } = await req.json();
        const taskId = params.id;

        const task = await prisma.task.update({
            where: { id: taskId, userId: user.id },
            data: { completed },
        });

        return NextResponse.json({ success: true, task });
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
