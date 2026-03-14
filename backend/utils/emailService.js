import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
    // Force IPv4 to avoid IPv6 connection issues
    family: 4,
    pool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5
  });
};

// Send contact form notification to admin
export const sendContactNotificationEmail = async (contactData) => {
  try {
    // Skip email if credentials not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return { success: false, error: 'Email not configured' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"INIYAN & Co Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message from ${contactData.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #1a1a1a;
              color: #fbbf24;
              padding: 20px;
              text-align: center;
            }
            .content {
              background-color: white;
              padding: 30px;
              margin-top: 20px;
              border-radius: 5px;
            }
            .field {
              margin-bottom: 15px;
            }
            .field-label {
              font-weight: bold;
              color: #555;
              margin-bottom: 5px;
            }
            .field-value {
              color: #333;
              padding: 10px;
              background-color: #f5f5f5;
              border-left: 3px solid #fbbf24;
            }
            .message-box {
              background-color: #f5f5f5;
              padding: 15px;
              border-left: 3px solid #fbbf24;
              margin-top: 10px;
              white-space: pre-wrap;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
            .btn {
              display: inline-block;
              padding: 12px 24px;
              background-color: #fbbf24;
              color: #1a1a1a;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 New Contact Message</h1>
              <p>You have received a new message from your website</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="field-label">From:</div>
                <div class="field-value">${contactData.name}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value">
                  <a href="mailto:${contactData.email}">${contactData.email}</a>
                </div>
              </div>
              
              <div class="field">
                <div class="field-label">Phone:</div>
                <div class="field-value">
                  <a href="tel:${contactData.phone}">${contactData.phone}</a>
                </div>
              </div>
              
              <div class="field">
                <div class="field-label">Message:</div>
                <div class="message-box">${contactData.message}</div>
              </div>
              
              <div style="text-align: center;">
                <a href="http://localhost:8081/admin/messages" class="btn">
                  View in Admin Panel
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated message from INIYAN & Co website contact form.</p>
              <p>Please log in to your admin panel to respond to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    return { success: false, error: error.message };
  }// Skip email if credentials not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('Email not configured - skipping customer confirmation');
      return { success: false, error: 'Email not configured' };
    }

    
};

// Send confirmation email to customer
export const sendContactConfirmationEmail = async (contactData) => {
  try {
    // Skip email if credentials not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return { success: false, error: 'Email not configured' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"INIYAN & Co" <${process.env.EMAIL_USER}>`,
      to: contactData.email,
      subject: 'Thank you for contacting INIYAN & Co',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #1a1a1a;
              color: #fbbf24;
              padding: 20px;
              text-align: center;
            }
            .content {
              background-color: white;
              padding: 30px;
              margin-top: 20px;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You!</h1>
              <p>We've received your message</p>
            </div>
            
            <div class="content">
              <p>Dear ${contactData.name},</p>
              
              <p>Thank you for contacting INIYAN & Co. We have received your message and our team will get back to you within 24 hours.</p>
              
              <p><strong>Your message:</strong></p>
              <p style="background-color: #f5f5f5; padding: 15px; border-left: 3px solid #fbbf24;">${contactData.message}</p>
              
              <p>If you need immediate assistance, please feel free to call us at:</p>
              <p style="text-align: center; font-size: 18px; color: #fbbf24; font-weight: bold;">
                +91 90036 33552
              </p>
              
              <p>Best regards,<br>
              <strong>INIYAN & Co Team</strong></p>
            </div>
            
            <div class="footer">
              <p><strong>INIYAN & Co</strong></p>
              <p>1/18, Kudi Street, Near Panchayat Headquarter<br>
              Mettupalayam, Kokkalai, Namakkal, Tamil Nadu 637410</p>
              <p>Email: iniyanandco@gmail.com | Phone: +91 90036 33552</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact confirmation email sent successfully');
    return { success: true };
  } catch (error) {

    return { success: false, error: error.message };
  }
};

// Send quote status update notification to customer
export const sendQuoteStatusUpdateEmail = async (quoteData) => {
  try {
    // Skip email if credentials not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('⚠️ Email credentials not configured');
      return { success: false, error: 'Email not configured' };
    }

    console.log(`📧 Attempting to send email to ${quoteData.email} - Status: ${quoteData.status}`);
    const transporter = createTransporter();

    // Status color mapping
    const statusColors = {
      pending: '#f59e0b',
      quoted: '#3b82f6',
      approved: '#10b981',
      rejected: '#ef4444',
      'in-progress': '#8b5cf6',
      completed: '#6b7280'
    };

    const statusColor = statusColors[quoteData.status] || '#f59e0b';

    const mailOptions = {
      from: `"INIYAN & Co" <${process.env.EMAIL_USER}>`,
      to: quoteData.email,
      subject: `Quote Status Update: ${quoteData.status.charAt(0).toUpperCase() + quoteData.status.slice(1)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #1a1a1a;
              color: #fbbf24;
              padding: 20px;
              text-align: center;
            }
            .content {
              background-color: white;
              padding: 30px;
              margin-top: 20px;
              border-radius: 5px;
            }
            .status-badge {
              display: inline-block;
              padding: 8px 16px;
              background-color: ${statusColor};
              color: white;
              border-radius: 20px;
              font-weight: bold;
              margin: 10px 0;
            }
            .quote-details {
              background-color: #f5f5f5;
              padding: 15px;
              border-left: 3px solid #fbbf24;
              margin: 15px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
            .btn {
              display: inline-block;
              padding: 12px 24px;
              background-color: #fbbf24;
              color: #1a1a1a;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Quote Status Update</h1>
              <p>Your quote request has been updated</p>
            </div>
            
            <div class="content">
              <p>Dear ${quoteData.name},</p>
              
              <p>We wanted to inform you that your quote request status has been updated.</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <span class="status-badge">${quoteData.status.toUpperCase()}</span>
              </div>
              
              <div class="quote-details">
                <h3 style="margin-top: 0; color: #1a1a1a;">Quote Details:</h3>
                <p><strong>Project Type:</strong> ${quoteData.projectType}</p>
                <p><strong>Location:</strong> ${quoteData.location}</p>
                <p><strong>Budget Range:</strong> ${quoteData.budgetRange}</p>
                <p><strong>Timeline:</strong> ${quoteData.timeline}</p>
                ${quoteData.quotedAmount ? `<p><strong>Quoted Amount:</strong> ₹${quoteData.quotedAmount.toLocaleString('en-IN')}</p>` : ''}
                ${quoteData.quotedDetails ? `<p><strong>Quote Details:</strong><br>${quoteData.quotedDetails}</p>` : ''}
              </div>
              
              ${quoteData.status === 'quoted' ? `
                <p style="background-color: #eff6ff; padding: 15px; border-left: 3px solid #3b82f6;">
                  <strong>Great news!</strong> We have prepared a quote for your project. Please review the details above and let us know if you would like to proceed.
                </p>
              ` : ''}
              
              ${quoteData.status === 'approved' ? `
                <p style="background-color: #f0fdf4; padding: 15px; border-left: 3px solid #10b981;">
                  <strong>Congratulations!</strong> Your quote has been approved. Our team will contact you shortly to discuss the next steps and project timeline.
                </p>
              ` : ''}
              
              ${quoteData.status === 'in-progress' ? `
                <p style="background-color: #faf5ff; padding: 15px; border-left: 3px solid #8b5cf6;">
                  <strong>Project Started!</strong> Your project is now in progress. We'll keep you updated with regular progress reports.
                </p>
              ` : ''}
              
              ${quoteData.status === 'completed' ? `
                <p style="background-color: #f9fafb; padding: 15px; border-left: 3px solid #6b7280;">
                  <strong>Project Completed!</strong> Thank you for choosing INIYAN & Co. We hope you're satisfied with our work. We'd love to hear your feedback!
                </p>
              ` : ''}
              
              ${quoteData.status === 'rejected' ? `
                <p style="background-color: #fef2f2; padding: 15px; border-left: 3px solid #ef4444;">
                  Unfortunately, we are unable to proceed with this quote request at this time. If you have any questions, please don't hesitate to contact us.
                </p>
              ` : ''}
              
              <p>If you have any questions or concerns, please feel free to contact us:</p>
              <p style="text-align: center; font-size: 18px; color: #fbbf24; font-weight: bold;">
                +91 90036 33552
              </p>
              
              <div style="text-align: center;">
                <a href="http://localhost:8080/user/quotes" class="btn">
                  View My Quotes
                </a>
              </div>
              
              <p style="margin-top: 20px;">Best regards,<br>
              <strong>INIYAN & Co Team</strong></p>
            </div>
            
            <div class="footer">
              <p><strong>INIYAN & Co</strong></p>
              <p>1/18, Kudi Street, Near Panchayat Headquarter<br>
              Mettupalayam, Kokkalai, Namakkal, Tamil Nadu 637410</p>
              <p>Email: iniyanandco@gmail.com | Phone: +91 90036 33552</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Quote status update email sent successfully to', quoteData.email);
    return { success: true };
  } catch (error) {
    console.log('❌ Email sending failed:', error.message);
    // Silently fail - network/firewall may block SMTP
    return { success: false, error: error.message };
  }
};

// Send appointment confirmation email to customer
export const sendAppointmentConfirmationEmail = async (appointment, user) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return { success: false, error: 'Email not configured' };
    }

    const transporter = createTransporter();
    
    const appointmentDate = new Date(appointment.scheduledDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mailOptions = {
      from: `"INIYAN & Co" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Appointment Confirmed - ${appointment.appointmentType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .header { background-color: #1a1a1a; color: #fbbf24; padding: 20px; text-align: center; }
            .content { background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px; }
            .status-badge { display: inline-block; padding: 8px 16px; background-color: #10b981; color: white; border-radius: 4px; font-weight: bold; margin: 15px 0; }
            .appointment-details { background-color: #f0fdf4; padding: 20px; border-radius: 5px; border-left: 4px solid #10b981; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #555; }
            .meeting-link { display: inline-block; background-color: #fbbf24; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>INIYAN & Co</h1>
              <p>Construction Services</p>
            </div>
            
            <div class="content">
              <h2>Appointment Confirmed</h2>
              <div class="status-badge">CONFIRMED</div>
              
              <p>Dear ${user.name},</p>
              
              <p>Your appointment has been confirmed! We look forward to meeting with you.</p>
              
              <div class="appointment-details">
                <h3>Appointment Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Type:</span> ${appointment.appointmentType}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span> ${appointmentDate}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span> ${appointment.scheduledTime}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration:</span> ${appointment.duration} minutes
                </div>
                <div class="detail-row">
                  <span class="detail-label">Location Type:</span> ${appointment.locationType === 'online' ? 'Online Meeting' : appointment.locationType === 'site' ? 'Site Visit' : 'Office'}
                </div>
                ${appointment.location ? `<div class="detail-row"><span class="detail-label">Location:</span> ${appointment.location}</div>` : ''}
              </div>
              
              ${appointment.meetingLink ? `
              <p><strong>Join the meeting using the link below:</strong></p>
              <div style="text-align: center;">
                <a href="${appointment.meetingLink}" class="meeting-link" target="_blank">
                  Join Google Meet
                </a>
              </div>
              <p style="font-size: 14px; color: #666;">Meeting Link: <a href="${appointment.meetingLink}" target="_blank">${appointment.meetingLink}</a></p>
              ` : ''}
              
              ${appointment.adminNotes ? `<p><strong>Notes:</strong> ${appointment.adminNotes}</p>` : ''}
              
              <p style="margin-top: 20px;">You will receive a reminder email 24 hours before the appointment.</p>
              
              <p style="margin-top: 20px;">If you need to reschedule or cancel, please contact us as soon as possible.</p>
              
              <p style="margin-top: 20px;">Best regards,<br>
              <strong>INIYAN & Co Team</strong></p>
            </div>
            
            <div class="footer">
              <p><strong>INIYAN & Co</strong></p>
              <p>1/18, Kudi Street, Near Panchayat Headquarter<br>
              Mettupalayam, Kokkalai, Namakkal, Tamil Nadu 637410</p>
              <p>Email: iniyanandco@gmail.com | Phone: +91 90036 33552</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send appointment reminder email
export const sendAppointmentReminderEmail = async (appointment, user) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return { success: false, error: 'Email not configured' };
    }

    const transporter = createTransporter();
    
    const appointmentDate = new Date(appointment.scheduledDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mailOptions = {
      from: `"INIYAN & Co" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Reminder: Appointment Tomorrow - ${appointment.appointmentType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .header { background-color: #1a1a1a; color: #fbbf24; padding: 20px; text-align: center; }
            .content { background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px; }
            .reminder-badge { display: inline-block; padding: 8px 16px; background-color: #f59e0b; color: white; border-radius: 4px; font-weight: bold; margin: 15px 0; }
            .appointment-details { background-color: #fffbeb; padding: 20px; border-radius: 5px; border-left: 4px solid #f59e0b; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #555; }
            .meeting-link { display: inline-block; background-color: #fbbf24; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>INIYAN & Co</h1>
              <p>Construction Services</p>
            </div>
            
            <div class="content">
              <h2>Appointment Reminder</h2>
              <div class="reminder-badge">REMINDER</div>
              
              <p>Dear ${user.name},</p>
              
              <p><strong>This is a friendly reminder about your upcoming appointment tomorrow.</strong></p>
              
              <div class="appointment-details">
                <h3>Appointment Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Type:</span> ${appointment.appointmentType}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span> ${appointmentDate}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span> ${appointment.scheduledTime}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration:</span> ${appointment.duration} minutes
                </div>
                ${appointment.location ? `<div class="detail-row"><span class="detail-label">Location:</span> ${appointment.location}</div>` : ''}
              </div>
              
              ${appointment.meetingLink ? `
              <p><strong>Join the meeting using the link below:</strong></p>
              <div style="text-align: center;">
                <a href="${appointment.meetingLink}" class="meeting-link" target="_blank">
                  Join Google Meet
                </a>
              </div>
              ` : ''}
              
              <p style="margin-top: 20px;">Please ensure you're available at the scheduled time. If you need to reschedule, please contact us immediately.</p>
              
              <p style="margin-top: 20px;">Best regards,<br>
              <strong>INIYAN & Co Team</strong></p>
            </div>
            
            <div class="footer">
              <p><strong>INIYAN & Co</strong></p>
              <p>1/18, Kudi Street, Near Panchayat Headquarter<br>
              Mettupalayam, Kokkalai, Namakkal, Tamil Nadu 637410</p>
              <p>Email: iniyanandco@gmail.com | Phone: +91 90036 33552</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send appointment cancellation email
export const sendAppointmentCancellationEmail = async (appointment, user) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return { success: false, error: 'Email not configured' };
    }

    const transporter = createTransporter();
    
    const appointmentDate = new Date(appointment.scheduledDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mailOptions = {
      from: `"INIYAN & Co" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Appointment Cancelled - ${appointment.appointmentType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .header { background-color: #1a1a1a; color: #fbbf24; padding: 20px; text-align: center; }
            .content { background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px; }
            .status-badge { display: inline-block; padding: 8px 16px; background-color: #ef4444; color: white; border-radius: 4px; font-weight: bold; margin: 15px 0; }
            .appointment-details { background-color: #fef2f2; padding: 20px; border-radius: 5px; border-left: 4px solid #ef4444; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #555; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>INIYAN & Co</h1>
              <p>Construction Services</p>
            </div>
            
            <div class="content">
              <h2>Appointment Cancelled</h2>
              <div class="status-badge">CANCELLED</div>
              
              <p>Dear ${user.name},</p>
              
              <p>Your appointment has been cancelled.</p>
              
              <div class="appointment-details">
                <h3>Cancelled Appointment Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Type:</span> ${appointment.appointmentType}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span> ${appointmentDate}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span> ${appointment.scheduledTime}
                </div>
              </div>
              
              ${appointment.adminNotes ? `<p><strong>Reason:</strong> ${appointment.adminNotes}</p>` : ''}
              
              <p style="margin-top: 20px;">If you would like to schedule a new appointment, please contact us or submit a new request through our website.</p>
              
              <p style="margin-top: 20px;">We apologize for any inconvenience.</p>
              
              <p style="margin-top: 20px;">Best regards,<br>
              <strong>INIYAN & Co Team</strong></p>
            </div>
            
            <div class="footer">
              <p><strong>INIYAN & Co</strong></p>
              <p>1/18, Kudi Street, Near Panchayat Headquarter<br>
              Mettupalayam, Kokkalai, Namakkal, Tamil Nadu 637410</p>
              <p>Email: iniyanandco@gmail.com | Phone: +91 90036 33552</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send appointment rescheduled email
export const sendAppointmentRescheduledEmail = async (appointment, user, oldDate, oldTime) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return { success: false, error: 'Email not configured' };
    }

    const transporter = createTransporter();
    
    const newAppointmentDate = new Date(appointment.scheduledDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const oldAppointmentDate = new Date(oldDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mailOptions = {
      from: `"INIYAN & Co" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Appointment Rescheduled - ${appointment.appointmentType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .header { background-color: #1a1a1a; color: #fbbf24; padding: 20px; text-align: center; }
            .content { background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px; }
            .status-badge { display: inline-block; padding: 8px 16px; background-color: #3b82f6; color: white; border-radius: 4px; font-weight: bold; margin: 15px 0; }
            .appointment-details { background-color: #eff6ff; padding: 20px; border-radius: 5px; border-left: 4px solid #3b82f6; margin: 20px 0; }
            .old-details { background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; text-decoration: line-through; opacity: 0.7; }
            .detail-row { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #555; }
            .meeting-link { display: inline-block; background-color: #fbbf24; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>INIYAN & Co</h1>
              <p>Construction Services</p>
            </div>
            
            <div class="content">
              <h2>Appointment Rescheduled</h2>
              <div class="status-badge">RESCHEDULED</div>
              
              <p>Dear ${user.name},</p>
              
              <p>Your appointment has been rescheduled to a new date and time.</p>
              
              <div class="old-details">
                <h4>Previous Schedule:</h4>
                <div class="detail-row">Date: ${oldAppointmentDate}</div>
                <div class="detail-row">Time: ${oldTime}</div>
              </div>
              
              <div class="appointment-details">
                <h3>New Appointment Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Type:</span> ${appointment.appointmentType}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span> ${newAppointmentDate}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span> ${appointment.scheduledTime}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration:</span> ${appointment.duration} minutes
                </div>
                ${appointment.location ? `<div class="detail-row"><span class="detail-label">Location:</span> ${appointment.location}</div>` : ''}
              </div>
              
              ${appointment.meetingLink ? `
              <p><strong>Join the meeting using the updated link below:</strong></p>
              <div style="text-align: center;">
                <a href="${appointment.meetingLink}" class="meeting-link" target="_blank">
                  Join Google Meet
                </a>
              </div>
              ` : ''}
              
              ${appointment.adminNotes ? `<p><strong>Reason for Reschedule:</strong> ${appointment.adminNotes}</p>` : ''}
              
              <p style="margin-top: 20px;">Please confirm your availability for the new date and time. If this doesn't work for you, please contact us immediately.</p>
              
              <p style="margin-top: 20px;">Best regards,<br>
              <strong>INIYAN & Co Team</strong></p>
            </div>
            
            <div class="footer">
              <p><strong>INIYAN & Co</strong></p>
              <p>1/18, Kudi Street, Near Panchayat Headquarter<br>
              Mettupalayam, Kokkalai, Namakkal, Tamil Nadu 637410</p>
              <p>Email: iniyanandco@gmail.com | Phone: +91 90036 33552</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send admin notification when new appointment request is created
export const sendAppointmentRequestNotificationToAdmin = async (appointment, user) => {
  try {
    console.log('📧 Attempting to send admin notification email...');
    console.log('📧 Admin Email:', process.env.ADMIN_EMAIL);
    console.log('📧 From Email:', process.env.EMAIL_USER);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.ADMIN_EMAIL) {
      console.error('❌ Email configuration missing!');
      return { success: false, error: 'Email not configured' };
    }

    const transporter = createTransporter();
    
    const appointmentDate = new Date(appointment.scheduledDate).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mailOptions = {
      from: `"INIYAN & Co Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Appointment Request - ${appointment.appointmentType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
            .header { background-color: #1a1a1a; color: #fbbf24; padding: 20px; text-align: center; }
            .content { background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px; }
            .status-badge { display: inline-block; padding: 8px 16px; background-color: #f59e0b; color: white; border-radius: 4px; font-weight: bold; margin: 15px 0; }
            .appointment-details { background-color: #fffbeb; padding: 20px; border-radius: 5px; border-left: 4px solid #f59e0b; margin: 20px 0; }
            .detail-row { margin: 10px 0; }
            .detail-label { font-weight: bold; color: #555; }
            .btn { display: inline-block; background-color: #fbbf24; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 5px; }
            .btn-approve { background-color: #10b981; color: white; }
            .btn-cancel { background-color: #ef4444; color: white; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Appointment Request</h1>
              <p>A client has requested an appointment</p>
            </div>
            
            <div class="content">
              <div class="status-badge">PENDING APPROVAL</div>
              
              <h3>Client Information</h3>
              <div class="appointment-details">
                <div class="detail-row">
                  <span class="detail-label">Name:</span> ${user.name}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span> <a href="mailto:${user.email}">${user.email}</a>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span> ${user.phone || 'Not provided'}
                </div>
              </div>
              
              <h3>Appointment Details</h3>
              <div class="appointment-details">
                <div class="detail-row">
                  <span class="detail-label">Type:</span> ${appointment.appointmentType}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span> ${appointmentDate}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span> ${appointment.scheduledTime}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration:</span> ${appointment.duration} minutes
                </div>
                <div class="detail-row">
                  <span class="detail-label">Location Type:</span> ${appointment.locationType === 'online' ? 'Online Meeting' : appointment.locationType === 'site' ? 'Site Visit' : 'Office'}
                </div>
                ${appointment.location ? `<div class="detail-row"><span class="detail-label">Location:</span> ${appointment.location}</div>` : ''}
                ${appointment.customerNotes ? `<div class="detail-row"><span class="detail-label">Customer Notes:</span> ${appointment.customerNotes}</div>` : ''}
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="margin-bottom: 15px;"><strong>Quick Actions:</strong></p>
                <a href="http://localhost:5000/api/appointments/${appointment._id}/approve?token=${Buffer.from(appointment._id.toString()).toString('base64')}" class="btn btn-approve">
                  ✅ Approve Appointment
                </a>
                <a href="http://localhost:5000/api/appointments/${appointment._id}/cancel?token=${Buffer.from(appointment._id.toString()).toString('base64')}" class="btn btn-cancel">
                  ❌ Cancel Appointment
                </a>
              </div>
              
              <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
                Or <a href="http://localhost:8081/admin/appointments" style="color: #fbbf24;">log in to admin panel</a> for more options
              </p>
            </div>
            
            <div class="footer">
              <p><strong>INIYAN & Co</strong></p>
              <p>1/18, Kudi Street, Near Panchayat Headquarter<br>
              Mettupalayam, Kokkalai, Namakkal, Tamil Nadu 637410</p>
              <p>Email: iniyanandco@gmail.com | Phone: +91 90036 33552</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('📧 Sending email to:', mailOptions.to);
    await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification email sent successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Email send error:', error.message || error);
    return { success: false, error: error.message };
  }
};
