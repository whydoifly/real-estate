import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendResetEmail } from '@/lib/email';

export async function POST(request) {
  try {
    await dbConnect();
    const { email } = await request.json();
    console.log('Received reset request for:', email); // Debug log

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('User not found:', email); // Debug log
      return NextResponse.json({
        message:
          'If an account exists, you will receive a password reset email',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save hashed token to user
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    console.log('Reset URL generated:', resetUrl); // Debug log

    try {
      await sendResetEmail(user.email, resetUrl);
      console.log('Reset email sent successfully to:', user.email); // Debug log
    } catch (emailError) {
      console.error('Detailed email error:', emailError); // Detailed error log
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      throw new Error('Failed to send reset email');
    }

    return NextResponse.json({
      message: 'If an account exists, you will receive a password reset email',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
