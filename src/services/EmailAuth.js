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

        this.otpStore = new Map(); // Temporary store
    }

    generateOTP() {
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

    verifyOTP(userEmail, providedOTP) {
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
}
