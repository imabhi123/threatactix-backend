import { User } from '../models/userModel.js';
import EmailAuth from '../services/EmailAuth.js';

const emailAuth = new EmailAuth();

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email)
        await emailAuth.sendOTP(email);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Verify the OTP (await in case it is asynchronous)
        const result = emailAuth.verifyOTP(email, otp);

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

