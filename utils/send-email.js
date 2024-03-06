const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });
        await transporter.sendMail({
            from: "StreamFlow",
            to: email,
            subject,
            text,
        });
    } catch(error) {
        console.log(error);
    }
}

module.exports = sendEmail;