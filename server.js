const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// P7M ULTRA - PRE-INSTALLED MAILTRAP ENGINE
const TRANSPORT_CONFIG = {
    host: "live.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
        user: "api", 
        pass: "529fcc3a514bd63c575053b40d50d4a0" // Your provided Token
    },
    tls: { rejectUnauthorized: false }
};

app.post('/api/send', upload.array('attachments'), async (req, res) => {
    const { fromName, to, subject, html } = req.body;
    const files = req.files;

    let transporter = nodemailer.createTransport(TRANSPORT_CONFIG);

    const attachments = files ? files.map(file => ({
        filename: file.originalname,
        content: file.buffer
    })) : [];

    try {
        await transporter.sendMail({
            from: `"${fromName}" <billing@p7m.online>`, // Using your verified domain
            to,
            subject,
            html,
            attachments
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Mailtrap Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Port 8080 is required for Railway Deployment
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`P7M Ultra Engine Live on p7m.online`));
