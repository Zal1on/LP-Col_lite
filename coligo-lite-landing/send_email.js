// Node.js version using SendGrid
// Run with: node send_email.js

const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY_HERE');

// Email configuration
const FROM_EMAIL = 'M.alsharif@be-services.com'; // Replace with your verified sender email
const TO_EMAIL = 'r.maidel@be-services.com'; // Replace with your email

// Route to handle form submissions
app.post('/send-email', async (req, res) => {
    try {
        const { name, email, company, usecase, datetime } = req.body;

        // Validation
        if (!name || !email || !company || !datetime) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Prepare email
        const msg = {
            to: TO_EMAIL,
            from: {
                email: FROM_EMAIL,
                name: 'COLIGO Demo Requests'
            },
            subject: `New COLIGO Demo Request from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #001836;">New Demo Request Received</h2>
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Company:</strong> ${company}</p>
                        <p><strong>Use Case:</strong> ${usecase || 'Not specified'}</p>
                        <p><strong>Preferred Demo Time:</strong> ${datetime}</p>
                        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 14px;">
                        <em>This is an automated message from your COLIGO demo request form.</em>
                    </p>
                </div>
            `
        };

        // Send email
        await sgMail.send(msg);
        
        res.json({ 
            success: true, 
            message: 'Email sent successfully' 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            error: 'Failed to send email',
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Email endpoint: http://localhost:${PORT}/send-email`);
});

module.exports = app;
