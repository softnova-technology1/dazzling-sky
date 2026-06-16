const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Generate HTML template for the bill
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0d0914; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0d0914; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #16121e; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid #36254a;">
                
                <!-- Hero Banner Image -->
                <tr>
                  <td>
                    <img src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1200&auto=format&fit=crop" alt="Luxury Flowers" style="width: 100%; height: 200px; object-fit: cover; display: block;" />
                  </td>
                </tr>

                <!-- Header Logo Section -->
                <tr>
                  <td align="center" style="padding: 40px 40px 20px 40px;">
                    <h1 style="margin: 0; color: #ff8ad8; font-size: 26px; font-weight: 400; letter-spacing: 6px; text-transform: uppercase; font-family: Georgia, serif;">Dazzling Sky</h1>
                    <p style="margin: 10px 0 0 0; color: #a89bbd; font-size: 11px; letter-spacing: 4px; text-transform: uppercase;">The Luxury Floral Atelier</p>
                  </td>
                </tr>

                <!-- Greeting & Intro -->
                <tr>
                  <td style="padding: 20px 40px 30px 40px; text-align: center;">
                    <h2 style="margin: 0 0 15px 0; color: #ffffff; font-size: 22px; font-weight: 300; font-family: Georgia, serif; font-style: italic;">Order Confirmed</h2>
                    <p style="margin: 0; color: #d1c4e9; font-size: 15px; line-height: 1.6; font-weight: 300;">
                      Dearest <strong style="color: #ff8ad8; font-weight: 500;">${options.customerName}</strong>,<br><br>
                      Thank you for choosing Dazzling Sky. Your premium arrangement is being exquisitely curated by our master florists.
                    </p>
                  </td>
                </tr>

                <!-- Order Receipt Box -->
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1a1525; border-radius: 12px; padding: 30px; border: 1px solid #2d203e;">
                      <tr>
                        <td colspan="2" style="padding-bottom: 20px; border-bottom: 1px solid #36254a;">
                          <p style="margin: 0; color: #ff8ad8; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold;">Receipt Summary</p>
                          <p style="margin: 5px 0 0 0; color: #8c7ea0; font-size: 12px;">Order ID: #${options.orderId.substring(0,8).toUpperCase()}</p>
                        </td>
                      </tr>

                      <!-- Items List -->
                      <tr>
                        <td colspan="2" style="padding-top: 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            ${options.orderItems.map(item => `
                              <tr>
                                <td style="padding: 10px 0; color: #ffffff; font-size: 15px; font-weight: 300;">
                                  <span style="color: #ff8ad8;">${item.quantity}x</span> &nbsp; ${item.name}
                                </td>
                                <td align="right" style="padding: 10px 0; color: #ffffff; font-size: 15px; font-weight: 400;">
                                  $${(item.price * item.quantity).toFixed(2)}
                                </td>
                              </tr>
                            `).join('')}
                          </table>
                        </td>
                      </tr>

                      <!-- Subtotals -->
                      <tr>
                        <td colspan="2" style="padding-top: 15px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding: 6px 0; color: #8c7ea0; font-size: 13px;">Shipping & Handling</td>
                              <td align="right" style="padding: 6px 0; color: #8c7ea0; font-size: 13px;">$${options.shippingPrice.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td style="padding: 6px 0; color: #8c7ea0; font-size: 13px;">Estimated Tax</td>
                              <td align="right" style="padding: 6px 0; color: #8c7ea0; font-size: 13px;">$${options.taxPrice.toFixed(2)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Grand Total -->
                      <tr>
                        <td colspan="2" style="padding-top: 20px; border-top: 1px dashed #36254a;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="color: #ffffff; font-size: 18px; font-weight: 500; letter-spacing: 1px;">Total Amount</td>
                              <td align="right" style="color: #ff8ad8; font-size: 22px; font-weight: bold; font-family: Georgia, serif;">$${options.totalPrice.toFixed(2)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>



                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 30px 40px; background-color: #100b17; border-top: 1px solid #2d203e;">
                    <p style="margin: 0 0 10px 0; color: #8c7ea0; font-size: 12px; line-height: 1.6;">
                      If you require any assistance, our concierge is available at<br>
                      <a href="mailto:info@dazzlingsky.com" style="color: #ff8ad8; text-decoration: none;">info@dazzlingsky.com</a>
                    </p>
                    <p style="margin: 0; color: #615275; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">
                      © 2024 Dazzling Sky. All rights reserved.<br>
                      01-019, Jalan besar, Singapore 208786
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

    // Define email options
    const mailOptions = {
      from: `"Dazzling Sky" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: 'Your Dazzling Sky Order Confirmation',
      html: htmlTemplate
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully to:', options.email, 'Message ID:', info.messageId);
  } catch (error) {
    console.error('Error sending order email:', error.message);
  }
};

module.exports = sendEmail;
