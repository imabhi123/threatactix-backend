import { Admin } from '../models/adminModel.js';
import { User } from '../models/userModel.js';
import EmailAuth from '../services/EmailAuth.js';

const emailAuth = new EmailAuth();

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        await emailAuth.sendOTP(email);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Awaiting the verification result
        const result = await emailAuth.verifyOTP(email, otp); // Added `await`

        if (result.valid) {
            // Find the user in the database
            const user = await User.findOne({ email: email });

            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            // Update the verified status
            user.verified = true;
            await user.save();

            // Send success response
            return res.json({ message: "OTP verified successfully." });
        } else {
            // Send error response if OTP verification fails
            return res.status(400).json({ error: result.message });
        }
    } catch (error) {
        // Handle server errors
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const sendPurchaseConfirmation = async (req, res) => {
    try {
        const { email, planDetails } = req.body; // Assume `planDetails` contains details of the purchased plan
        console.log(req.body);

        if (!email || !planDetails) {
            return res.status(400).json({ error: 'Email and plan details are required' });
        }

        await emailAuth.sendPurchaseConfirmation(email, planDetails);

        res.json({ message: 'Purchase confirmation email sent successfully.' });
    } catch (error) {
        console.error('Error sending purchase confirmation email:', error);
        res.status(500).json({ error: 'Failed to send purchase confirmation email' });
    }
};

export const sendResetPasswordCode = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email exists in the database
        const admin = await Admin.findOne({ username: email }); // Changed `username` to `email` as per request

        if (!admin) {
            return res.status(404).json({ error: "Admin not found." });
        }

        // Generate and send the reset password code
        await emailAuth.sendResetPasswordCode(email);

        res.json({ message: 'Reset password code sent successfully.' });
    } catch (error) {
        console.error('Error sending reset password code:', error);
        res.status(500).json({ error: 'Failed to send reset password code.' });
    }
};

export const verifyResetPasswordCode = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        console.log(req.body)
        const result = await emailAuth.verifyResetPasswordCode(email, code);

        if (result.valid) {
            const admin = await Admin.findOne({ username: email });

            if (!admin) {
                return res.status(404).json({ error: "Admin not found." });
            }

            admin.password = newPassword; // Ensure the password is hashed if necessary
            await admin.save();

            res.json({ message: 'Password reset successfully.' });
        } else {
            res.status(400).json({ error: result.message });
        }
    } catch (error) {
        console.error('Error verifying reset password code:', error);
        res.status(500).json({ error: 'Failed to verify reset password code.' });
    }
};
