const bcrypt = require('bcryptjs');
const users = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const nodemailer = require('nodemailer');

const sendResetEmail = (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'your_email@gmail.com',
            pass: 'your_password',
        },
    });

    const mailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `You requested a password reset. Click the link to reset your password: http://localhost:3000/reset/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};

const requestPasswordReset = (req, res) => {
    const { email } = req.body;
    const user = users.find((user) => user.email === email);

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const token = generateToken(email);
    user.resetToken = token;

    sendResetEmail(email, token);
    res.status(200).json({ message: 'Password reset email sent' });
};

const resetPassword = (req, res) => {
    const { token, newPassword } = req.body;
    const user = users.find((user) => user.resetToken === token);

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = bcrypt.hashSync(newPassword, 8);
    user.resetToken = null;

    res.status(200).json({ message: 'Password reset successful' });
};

module.exports = { requestPasswordReset, resetPassword };
