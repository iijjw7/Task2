const student = require('../models/model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { error } = require('console');
 

// Helper function to send emails
const sendEmail = async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL, // Your email
            pass: process.env.EMAIL_PASSWORD, // Your email password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text,
    };

    await transporter.sendMail(mailOptions);
};

// Register a new user
const register=async(req,res)=>{
    try{
        const{username,password}= req.body;
        const user = new User({username,password});
        await user.save();
        res.status(201).json({message: 'user registered successfully'})
    } catch (e) {
        res.status(500).j({error : e.message})
    }
};

// User login
const login = async (req, res,next ) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        next(error);
    }
};

// Forgot password
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `http://localhost:3000/api/auth/reset-password/${resetToken}`;

        await sendEmail(user.email, 'Password Reset', `Reset your password using the following link: ${resetUrl}`);

        res.json({ message: 'Password reset link sent' });
    } catch (error) {
        next(error);
    }
};

// Reset password
const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
};

module.exports={
    register,
    login,
    forgotPassword,
    resetPassword,
}
