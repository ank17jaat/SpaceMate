import nodemailer from 'nodemailer';

// Initialize transporter
let transporter: any = null;

export function initializeEmailService() {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASS) {
    console.warn('Email service not configured. SMTP_EMAIL or SMTP_PASS env vars missing.');
    return false;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  return true;
}

interface BookingData {
  name?: string;
  email?: string;
  userEmail?: string;
  date?: string;
  totalPrice?: number;
  propertyTitle?: string;
  propertyAddress?: string;
  propertyCity?: string;
  propertyImages?: string[];
  [key: string]: any;
}

export async function sendBookingEmail(bookingData: BookingData) {
  if (!transporter) {
    console.error('Email service not initialized');
    return false;
  }

  const recipient = bookingData.userEmail || bookingData.email;
  if (!recipient) {
    console.warn('No email provided for booking notification');
    return false;
  }

  const {
    name = 'Guest',
    date = 'N/A',
    totalPrice = 0,
    propertyTitle = 'Office Space',
    propertyAddress = 'Address TBD',
    propertyCity = 'City TBD',
  } = bookingData;

  const htmlTemplate = generateBookingEmailHTML({
    name,
    propertyTitle,
    propertyAddress,
    propertyCity,
    date,
    totalPrice,
  });

  try {
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: recipient,
      subject: `Booking Confirmation - ${propertyTitle}`,
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Booking email sent to ${recipient}`);
    return true;
  } catch (error) {
    console.error('Failed to send booking email:', error);
    return false;
  }
}

function generateBookingEmailHTML(data: {
  name: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyCity: string;
  date: string;
  totalPrice: number;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .booking-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { font-weight: 600; color: #666; }
          .detail-value { color: #333; }
          .total-price { font-size: 24px; font-weight: 700; color: #667eea; margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
          .thank-you { background: #e8f5e9; padding: 15px; border-radius: 6px; margin: 20px 0; color: #2e7d32; text-align: center; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed! 🎉</h1>
            <p>Your reservation has been successfully created</p>
          </div>

          <div class="content">
            <p>Hi <strong>${data.name}</strong>,</p>

            <p>Thank you for choosing us! Your booking is confirmed. Here are your reservation details:</p>

            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Property</span>
                <span class="detail-value">${data.propertyTitle}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Location</span>
                <span class="detail-value">${data.propertyAddress}, ${data.propertyCity}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date</span>
                <span class="detail-value">${data.date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment Status</span>
                <span class="detail-value">Pay at Arrival</span>
              </div>
              <div style="text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #667eea;">
                <span class="detail-label">Total Amount</span>
                <div class="total-price">₹${data.totalPrice.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div class="thank-you">
              ✓ You will pay this amount in cash upon arrival. No prepayment required.
            </div>

            <p>If you have any questions or need to modify your booking, please contact our support team.</p>

            <p>We look forward to hosting you!</p>

            <p>Best regards,<br><strong>The SpaceMate Team</strong></p>

            <div class="footer">
              <p>© 2025 SpaceMate. All rights reserved.</p>
              <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
