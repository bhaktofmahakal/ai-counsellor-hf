
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // For security, don't reveal if user exists or not
            // But for this app's UX, we can be more helpful or follow standard practice
            return NextResponse.json({ message: 'If an account exists, an OTP has been sent.' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        await (prisma.user as any).update({
            where: { email },
            data: {
                resetToken: otp, // In a real app, hash this!
                resetTokenExpiry: expiry
            }
        });

        // MOCK EMAIL SEND: In a professional app, use Resend/SendGrid/Nodemailer
        console.log(`[AUTH] Password Reset OTP for ${email}: ${otp}`);

        return NextResponse.json({
            message: 'OTP sent successfully',
            dev_otp: process.env.NODE_ENV === 'development' ? otp : undefined // Reveal only in dev
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
