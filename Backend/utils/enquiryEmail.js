const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

/**
 * Sends an email notification to the admin when a new customer enquiry is received.
 * @param {Object} enquiry - The enquiry document from MongoDB
 */
const sendAdminEnquiryNotification = async (enquiry) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || emailUser;

    if (!emailUser || !emailPass) {
      console.warn('⚠️ SMTP credentials not found in environment (EMAIL_USER / EMAIL_PASS). Skipping email dispatch.');
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const sourceLabel = enquiry.source === 'homepage' 
      ? 'Homepage Consultation Form' 
      : enquiry.source === 'contact_page' 
        ? 'Contact Us Page Form' 
        : 'Direct Website Form';

    const formattedDate = new Date(enquiry.createdAt || Date.now()).toLocaleString('en-US', {
      timeZone: 'Asia/Singapore',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Client Enquiry Received</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0d0914; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #ffffff;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0d0914; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; background-color: #16121e; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6); border: 1px solid #36254a;">
                
                <!-- Header Banner -->
                <tr>
                  <td style="background: linear-gradient(135deg, #2b123d 0%, #16121e 100%); padding: 36px 40px 24px 40px; text-align: center; border-bottom: 1px solid #36254a;">
                    <div style="font-size: 11px; letter-spacing: 4px; color: #ff8ad8; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">
                      ✦ DAZZLING SKY ATELIER ✦
                    </div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 400; letter-spacing: 1px; color: #ffffff; font-family: Georgia, serif;">
                      New Client Enquiry Received
                    </h1>
                    <div style="display: inline-block; margin-top: 14px; padding: 4px 14px; background: rgba(255, 138, 216, 0.15); border: 1px solid rgba(255, 138, 216, 0.4); border-radius: 20px; font-size: 12px; color: #ff8ad8; font-weight: 500;">
                      Lead Source: ${sourceLabel}
                    </div>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 32px 40px;">
                    <p style="margin: 0 0 20px 0; color: #d1c4e9; font-size: 15px; line-height: 1.6;">
                      A new enquiry has just been submitted on your store front. Here are the submission details:
                    </p>

                    <!-- Client Details Card -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1c1626; border-radius: 12px; border: 1px solid #2d203e; margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding: 6px 0; color: #9c8eb3; font-size: 13px; width: 130px;">Client Name:</td>
                              <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 600;">
                                ${enquiry.firstName} ${enquiry.lastName || ''}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #9c8eb3; font-size: 13px;">Email Address:</td>
                              <td style="padding: 6px 0; color: #ff8ad8; font-size: 14px; font-weight: 500;">
                                <a href="mailto:${enquiry.email}" style="color: #ff8ad8; text-decoration: none;">${enquiry.email}</a>
                              </td>
                            </tr>
                            ${enquiry.phone ? `
                            <tr>
                              <td style="padding: 6px 0; color: #9c8eb3; font-size: 13px;">Phone:</td>
                              <td style="padding: 6px 0; color: #ffffff; font-size: 14px;">${enquiry.phone}</td>
                            </tr>` : ''}
                            <tr>
                              <td style="padding: 6px 0; color: #9c8eb3; font-size: 13px;">Received At:</td>
                              <td style="padding: 6px 0; color: #c4b5fd; font-size: 13px;">${formattedDate}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Message Card -->
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #ff8ad8; font-weight: 600; margin-bottom: 8px;">
                      Client Message:
                    </div>
                    <div style="background-color: #120e1a; border-left: 3px solid #ff8ad8; border-radius: 0 10px 10px 0; padding: 18px 22px; color: #f1edfa; font-size: 14px; line-height: 1.7; font-style: italic; white-space: pre-wrap; margin-bottom: 28px;">
                      "${enquiry.message}"
                    </div>

                    ${enquiry.attachment && enquiry.attachment.filename ? `
                    <!-- Attachment Notice -->
                    <div style="background-color: #1a1525; border: 1px dashed rgba(255, 138, 216, 0.4); border-radius: 8px; padding: 14px 18px; margin-bottom: 28px; display: flex; align-items: center;">
                      <div style="color: #ff8ad8; font-size: 14px; font-weight: 500;">
                        📎 Attached Reference: <strong>${enquiry.attachment.originalName || enquiry.attachment.filename}</strong> 
                        ${enquiry.attachment.size ? `(${(enquiry.attachment.size / 1024).toFixed(1)} KB)` : ''}
                      </div>
                    </div>
                    ` : ''}

                    <!-- Call To Action -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center">
                          <a href="mailto:${enquiry.email}?subject=Re:%20Dazzling%20Sky%20Consultation" style="display: inline-block; background: linear-gradient(90deg, #883c8a, #ff8ad8); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px; letter-spacing: 1px; box-shadow: 0 8px 20px rgba(255, 138, 216, 0.3);">
                            Reply to Client Directly
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 40px; background-color: #100b17; border-top: 1px solid #2d203e; text-align: center;">
                    <p style="margin: 0 0 6px 0; color: #8c7ea0; font-size: 12px;">
                      This notification was generated automatically by Dazzling Sky Admin Engine.
                    </p>
                    <p style="margin: 0; color: #5a4b6f; font-size: 11px;">
                      Manage all enquiries in your <a href="http://localhost:3000/admin/enquiries" style="color: #ff8ad8; text-decoration: none;">Admin Panel</a>.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const emailAttachments = [];
    if (enquiry.attachment && enquiry.attachment.filename) {
      const filePath = path.join(__dirname, '..', 'uploads', enquiry.attachment.filename);
      if (fs.existsSync(filePath)) {
        emailAttachments.push({
          filename: enquiry.attachment.originalName || enquiry.attachment.filename,
          path: filePath,
        });
      }
    }

    const mailOptions = {
      from: `"Dazzling Sky Atelier" <${emailUser}>`,
      to: adminRecipient,
      replyTo: enquiry.email,
      subject: `[New Enquiry] From ${enquiry.firstName} ${enquiry.lastName || ''} (${sourceLabel})`,
      html: htmlContent,
      attachments: emailAttachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Admin enquiry notification email successfully sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send enquiry notification email:', error.message);
    return false;
  }
};

module.exports = {
  sendAdminEnquiryNotification,
};
