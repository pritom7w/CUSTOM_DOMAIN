const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

app.post('/api/send', upload.array('attachments'), async (req, res) => {
    const { user, pass, fromName, to, subject, html } = req.body;
    const files = req.files;

    let transporter = nodemailer.createTransport({
        host: "live.smtp.mailtrap.io",
        port: 587,
        secure: false,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
    });

    // Format attachments for Nodemailer
    const attachments = files ? files.map(file => ({
        filename: file.originalname,
        content: file.buffer
    })) : [];

    try {
        await transporter.sendMail({
            from: `"${fromName}" <billing@p7m.online>`,
            to,
            subject,
            html,
            attachments
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`P7M Ultra Engine Active on port ${PORT}`));