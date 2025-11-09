import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { first_name, last_name, email, phone, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email ke kamu dengan HTML format yang lebih mudah dibaca
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📬 New Contact Message from ${first_name} ${last_name}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 30px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                        📬 New Contact Message
                      </h1>
                      <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                        From your portfolio website
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      
                      <!-- Contact Info Box -->
                      <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                        <h2 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: 600;">
                          Contact Information
                        </h2>
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 100px;">
                              <strong>👤 Name:</strong>
                            </td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                              ${first_name} ${last_name}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                              <strong>📧 Email:</strong>
                            </td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                              <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                            </td>
                          </tr>
                          ${
                            phone
                              ? `
                          <tr>
                            <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                              <strong>📱 Phone:</strong>
                            </td>
                            <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                              <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a>
                            </td>
                          </tr>
                          `
                              : ""
                          }
                        </table>
                      </div>
                      
                      <!-- Message Box -->
                      <div style="background-color: #ffffff; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px;">
                        <h2 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: 600;">
                          💬 Message
                        </h2>
                        <div style="color: #555555; font-size: 15px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">
                          ${message}
                        </div>
                      </div>
                      
                      <!-- Quick Action Button -->
                      <div style="margin-top: 30px; text-align: center;">
                        <a href="mailto:${email}" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                          Reply to ${first_name}
                        </a>
                      </div>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        This notification was sent from your portfolio contact form<br>
                        <a href="https://www.yvezh.my.id/" style="color: #667eea; text-decoration: none;">www.yvezh.my.id</a>
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      // Fallback text version untuk email clients yang tidak support HTML
      text: `
        NEW CONTACT MESSAGE
        ==================

        Contact Information:
        -------------------
        Name: ${first_name} ${last_name}
        Email: ${email}
        Phone: ${phone || "Not provided"}

        Message:
        --------
        ${message}

        ---
        This notification was sent from your portfolio contact form
        Reply to: ${email}
      `.trim(),
    });

    // Balasan otomatis ke pengirim - Enhanced HTML design
    await transporter.sendMail({
      from: `"Naufal Fathi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for reaching out!",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        Thank You!
                      </h1>
                      <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                        Your message has been received
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 40px 30px;">
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Hi <strong>${first_name}</strong>,
                      </p>
                      
                      <p style="margin: 0 0 20px; color: #555555; font-size: 15px; line-height: 1.6;">
                        Thank you for taking the time to reach out! I really appreciate your message and I'm excited to connect with you.
                      </p>
                      
                      <p style="margin: 0 0 30px; color: #555555; font-size: 15px; line-height: 1.6;">
                        I'll review your message carefully and get back to you as soon as possible, typically within 24-48 hours.
                      </p>
                      
                      <!-- Divider -->
                      <div style="border-top: 2px solid #f0f0f0; margin: 30px 0;"></div>
                      
                      <!-- Info Box -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <tr>
                          <td style="padding: 0;">
                            <p style="margin: 0 0 12px; color: #667eea; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                              Your Message Details
                            </p>
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="padding: 6px 0; color: #666666; font-size: 14px;">
                                  <strong>Name:</strong>
                                </td>
                                <td style="padding: 6px 0; color: #333333; font-size: 14px; text-align: right;">
                                  ${first_name} ${last_name}
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 6px 0; color: #666666; font-size: 14px;">
                                  <strong>Email:</strong>
                                </td>
                                <td style="padding: 6px 0; color: #333333; font-size: 14px; text-align: right;">
                                  ${email}
                                </td>
                              </tr>
                              ${
                                phone
                                  ? `
                              <tr>
                                <td style="padding: 6px 0; color: #666666; font-size: 14px;">
                                  <strong>Phone:</strong>
                                </td>
                                <td style="padding: 6px 0; color: #333333; font-size: 14px; text-align: right;">
                                  ${phone}
                                </td>
                              </tr>
                              `
                                  : ""
                              }
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0; color: #555555; font-size: 15px; line-height: 1.6;">
                        In the meantime, feel free to explore more of my work on my portfolio website.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- CTA Button -->
                  <tr>
                    <td style="padding: 0 40px 40px; text-align: center;">
                      <a href="https://www.yvezh.my.id/" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 8px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                        Visit My Portfolio
                      </a>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="margin: 0 0 15px; color: #333333; font-size: 16px; font-weight: 600;">
                        Best regards,
                      </p>
                      <p style="margin: 0 0 20px; color: #667eea; font-size: 18px; font-weight: 700;">
                        Naufal Fathi
                      </p>
                      
                      <!-- Contact Info -->
                      <table role="presentation" style="margin: 20px auto 0; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 0 15px;">
                            <a href="mailto:naufalfathi37@gmail.com" style="color: #666666; text-decoration: none; font-size: 13px;">
                              📧 naufalfathi37@gmail.com
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 15px 0;">
                            <a href="tel:+6281236122611" style="color: #666666; text-decoration: none; font-size: 13px;">
                              📱 +62 812-3612-2611
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Social Links (optional) -->
                      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                          Web, Mobile & Fullstack Developer
                        </p>
                        <p style="margin: 0; color: #999999; font-size: 12px;">
                          SMK Telkom Purwokerto
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                </table>
                
                <!-- Bottom Footer -->
                <table role="presentation" style="max-width: 600px; width: 100%; margin-top: 20px;">
                  <tr>
                    <td style="text-align: center; padding: 20px;">
                      <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.5;">
                        This is an automated response confirming receipt of your message.<br>
                        Please do not reply directly to this email.
                      </p>
                    </td>
                  </tr>
                </table>
                
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
