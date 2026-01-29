
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const documents = await (prisma as any).document.findMany({
            where: {
                user: { email: session.user.email }
            },
            orderBy: { updatedAt: 'desc' }
        });
        return NextResponse.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { title, type, content, status } = await req.json();

        if (!title || !type || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const document = await (prisma as any).document.create({
            data: {
                title,
                type,
                content,
                status: status || 'draft',
                user: { connect: { email: session.user.email } }
            }
        });

        return NextResponse.json(document);
    } catch (error) {
        console.error('Error creating document:', error);
        return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, title, content, status } = await req.json();

        const doc = await (prisma as any).document.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!doc || doc.user.email !== session.user.email) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updated = await (prisma as any).document.update({
            where: { id },
            data: {
                title: title !== undefined ? title : undefined,
                content: content !== undefined ? content : undefined,
                status: status !== undefined ? status : undefined
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating document:', error);
        return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const doc = await (prisma as any).document.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!doc || doc.user.email !== session.user.email) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await (prisma as any).document.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting document:', error);
        return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
    }
}
