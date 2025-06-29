const nodemailer = require('nodemailer');
require('dotenv').config({ path: 'config.env' });

async function testEmail() {
    console.log('Testing email functionality...');
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***SET***' : '***NOT SET***');

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('❌ SMTP credentials not found in config.env');
        console.log('Please add your Gmail credentials to config.env:');
        console.log('SMTP_USER=your_gmail@gmail.com');
        console.log('SMTP_PASS=your_app_password');
        return;
    }

    // Configure transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: 'priyankjakharia2005@gmail.com',
        subject: 'SLT Project - Email Test',
        text: 'This is a test email from your SLT project to verify email functionality is working!'
    };

    try {
        console.log('Sending test email...');
        await transporter.sendMail(mailOptions);
        console.log('✅ Test email sent successfully!');
        console.log('Check your email at: priyankjakharia2005@gmail.com');
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        if (error.code === 'EAUTH') {
            console.log('🔐 Authentication failed. Please check your Gmail app password.');
        }
    }
}

testEmail(); 