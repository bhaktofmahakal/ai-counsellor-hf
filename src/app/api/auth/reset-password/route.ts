
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const user = await (prisma.user as any).findUnique({
            where: { email }
        });

        if (!user || user.resetToken !== otp) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
            return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
        }

        // OTP is valid, hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await (prisma.user as any).update({
            where: { email },
            data: {
                password: hashedPassword,
                resetToken: null, // Clear token after use
                resetTokenExpiry: null
            }
        });

        return NextResponse.json({ message: 'Password reset successful' });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
