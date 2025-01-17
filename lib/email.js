import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

export async function sendResetEmail(to, resetUrl) {
  console.log('Attempting to send email to:', to); // Debug log

  try {
    const response = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_FROM,
            Name: 'Rental Property Management',
          },
          To: [{ Email: to }],
          Subject: 'Reset Your Password',
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #e53e3e;">Password Reset Request</h1>
              <p>You requested a password reset. Click the button below to reset your password:</p>
              <a href="${resetUrl}" style="display: inline-block; background: #e53e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
              <p>If you didn't request this, please ignore this email.</p>
              <p>This link will expire in 1 hour.</p>
            </div>
          `,
        },
      ],
    });

    console.log('Mailjet API response:', response.body); // Debug log
    return response;
  } catch (error) {
    console.error('Mailjet error details:', {
      statusCode: error.statusCode,
      message: error.message,
      errorType: error.ErrorType,
      errorInfo: error.ErrorInfo,
    });
    throw error;
  }
}
