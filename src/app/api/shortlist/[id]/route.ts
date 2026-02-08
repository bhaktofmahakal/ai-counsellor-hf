import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const universityId = params.id;

        // Find the shortlist entry
        const existing = await prisma.shortlist.findUnique({
            where: { userId_universityId: { userId: user.id, universityId } },
            include: { university: true }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Shortlist entry not found' }, { status: 404 });
        }

        // Delete the shortlist entry
        await prisma.shortlist.delete({
            where: { id: existing.id }
        });

        // Optionally delete associated tasks
        const uniName = existing.university?.name;
        if (uniName) {
            await prisma.task.deleteMany({
                where: { userId: user.id, title: { contains: uniName } },
            });
        }

        return NextResponse.json({ success: true, action: 'removed' });
    } catch (error) {
        console.error('Error removing from shortlist:', error);
        return NextResponse.json({ error: 'Failed to remove from shortlist' }, { status: 500 });
    }
}
