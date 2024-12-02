import nodemailer from 'nodemailer';
import crypto from 'crypto';

export default class EmailAuth {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'iamabhi7853@gmail.com', // Replace with your email
                pass: 'txxx krpn azyj dmvz' // Replace with your app password
            }
        });

        this.otpStore = new Map(); // Temporary store for OTPs
        this.resetPasswordStore = new Map(); 
    }

    generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    }

    generateResetCode() {
        return crypto.randomInt(100000, 999999).toString();
    }

    async sendOTP(userEmail) {
        try {
            const otp = this.generateOTP();

            this.otpStore.set(userEmail, {
                code: otp,
                expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
            });

            const mailOptions = {
                from: 'your-email@gmail.com',
                to: userEmail,
                subject: 'Your Authentication Code',
                html: `
                    <h1>Two Factor Authentication</h1>
                    <p>Your authentication code is: <strong>${otp}</strong></p>
                    <p>This code will expire in 5 minutes.</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw error;
        }
    }

    // Awaiting the result here
    async verifyOTP(userEmail, providedOTP) {
        const storedData = this.otpStore.get(userEmail);

        if (!storedData) {
            return { valid: false, message: 'No OTP found for this email' };
        }

        if (Date.now() > storedData.expiry) {
            this.otpStore.delete(userEmail);
            return { valid: false, message: 'OTP has expired' };
        }

        if (storedData.code !== providedOTP) {
            return { valid: false, message: 'Invalid OTP' };
        }

        this.otpStore.delete(userEmail);
        return { valid: true, message: 'OTP verified successfully' };
    }

    async sendResetPasswordCode(userEmail) {
        try {
            const resetCode = this.generateResetCode();

            this.resetPasswordStore.set(userEmail, {
                code: resetCode,
                expiry: Date.now() + 10 * 60 * 1000 // 10 minutes
            });

            const mailOptions = {
                from: 'iamabhi7853@gmail.com',
                to: userEmail,
                subject: 'Password Reset Code',
                html: `
                    <h1>Password Reset Request</h1>
                    <p>Hi,</p>
                    <p>You requested to reset your password. Use the code below to reset it:</p>
                    <p><strong>${resetCode}</strong></p>
                    <p>This code will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Reset password code sent successfully.');
            return true;
        } catch (error) {
            console.error('Error sending reset password code:', error);
            throw error;
        }
    }

    async verifyResetPasswordCode(userEmail, providedCode) {
        console.log(userEmail,providedCode)
        const storedData = this.resetPasswordStore.get(userEmail);
        console.log(storedData)

        if (!storedData) {
            return { valid: false, message: 'No reset code found for this email' };
        }

        if (Date.now() > storedData.expiry) {
            this.resetPasswordStore.delete(userEmail);
            return { valid: false, message: 'Reset code has expired' };
        }

        if (storedData.code !== providedCode) {
            return { valid: false, message: 'Invalid reset code' };
        }

        this.resetPasswordStore.delete(userEmail);
        return { valid: true, message: 'Reset code verified successfully' };
    }

    async sendPurchaseConfirmation(userEmail, planDetails) {
        try {
            const startDate = new Date(); // Purchase initiation date
            const expiryDate = new Date(startDate);

            // Calculate expiry date based on the plan's duration
            if (planDetails.duration === 'yearly') {
                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            } else if (planDetails.duration === 'monthly') {
                expiryDate.setMonth(expiryDate.getMonth() + 1);
            }

            const mailOptions = {
                from: 'iamabhi7853@gmail.com',
                to: userEmail,
                subject: 'Purchase Confirmation',
                html: `
                    <h1>Thank You for Your Purchase!</h1>
                    <p>Hi,</p>
                    <p>You have successfully purchased the <strong>${planDetails.name}</strong> plan.</p>
                    <p>Details:</p>
                    <ul>
                        <li>Plan Name: ${planDetails.name}</li>
                        <li>Price: $${planDetails.price}</li>
                        <li>Duration: ${planDetails.duration}</li>
                        <li>Initiation Date: ${startDate.toDateString()}</li>
                        <li>Expiry Date: ${expiryDate.toDateString()}</li>
                    </ul>
                    <p>We appreciate your business and look forward to serving you!</p>
                    <p>Best regards,</p>
                    <p>Your Company Name</p>
                `,
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Purchase confirmation email sent successfully.');
            return true;
        } catch (error) {
            console.error('Error sending purchase confirmation email:', error);
            throw error;
        }
    }
}
