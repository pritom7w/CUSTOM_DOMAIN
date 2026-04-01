const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// P7M ULTRA - RECONFIGURED FOR RAILWAY & MAILTRAP
const TRANSPORT_CONFIG = {
    host: "live.smtp.mailtrap.io",
    port: 2525, // Port 2525 is safer for cloud hosting than 587
    secure: false,
    auth: {
        user: "api", 
        pass: "529fcc3a514bd63c575053b40d50d4a0" // Your verified API Token
    },
    tls: { 
        rejectUnauthorized: false,
        minVersion: "TLSv1.2"
    }
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
            from: `"${fromName}" <support@p7m.online>`, // Verified domain sender
            to,
            subject,
            html,
            attachments
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Mailtrap Error Details:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// CRITICAL: Railway uses the PORT environment variable
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`P7M Ultra Engine Active on Port ${PORT}`);
});
