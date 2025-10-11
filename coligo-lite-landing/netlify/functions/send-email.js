// Netlify Serverless Function for SendGrid Email
const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse form data
        const data = JSON.parse(event.body);
        const { name, email, company, usecase, datetime } = data;

        // Validation
        if (!name || !email || !company || !datetime) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid email address' })
            };
        }

        // Set SendGrid API key from environment variable
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        // Get email configuration from environment variables
        const FROM_EMAIL = process.env.FROM_EMAIL || 'M.alsharif@be-services.com';
        const TO_EMAIL = process.env.TO_EMAIL || 'r.maidel@be-services.com';

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
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true, 
                message: 'Email sent successfully' 
            })
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to send email',
                details: error.message 
            })
        };
    }
};

