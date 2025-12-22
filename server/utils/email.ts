import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

/* ================================
   Initialize Email Service
================================ */
export function initializeEmailService() {
  const { SMTP_EMAIL, SMTP_PASS } = process.env;

  if (!SMTP_EMAIL || !SMTP_PASS) {
    console.warn("⚠️ Email service not configured (SMTP_EMAIL / SMTP_PASS missing)");
    return false;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASS, // Gmail App Password
    },
  });

  console.log("✓ Email service initialized with Gmail");
  return true;
}

/* ================================
   Types
================================ */
interface BookingData {
  name?: string;
  email?: string;
  userEmail?: string;
  date?: string | null;
  totalPrice?: number | null;
  propertyTitle?: string;
  propertyCity?: string;
}

/* ================================
   Send Booking Email
================================ */
export async function sendBookingEmail(bookingData: BookingData) {
  if (!transporter) {
    console.warn("⚠️ Email transporter not initialized");
    return false;
  }

  const recipient = bookingData.userEmail || bookingData.email;
  if (!recipient) {
    console.warn("⚠️ No recipient email found");
    return false;
  }

  const html = generateBookingEmailHTML(bookingData);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: recipient,
      subject: `Booking Confirmation - ${
        bookingData.propertyTitle ?? "Office Space"
      }`,
      html,
    });

    console.log(`✓ Booking email sent to ${recipient}`);
    return true;
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return false;
  }
}

/* ================================
   Email Template (FINAL)
================================ */
function generateBookingEmailHTML(data: BookingData): string {
  const name = data.name ?? "Guest";
  const propertyTitle = data.propertyTitle ?? "Office Space";
  const propertyCity = data.propertyCity ?? "Unknown City";

  // ✅ Always show booking date (current date fallback)
  const bookingDate = new Date(
    data.date ?? Date.now()
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const price =
    typeof data.totalPrice === "number" && data.totalPrice > 0
      ? `₹${data.totalPrice.toLocaleString("en-IN")}`
      : "₹0";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      padding: 20px;
    }
    .box {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
    }
    .header {
      background: #4f46e5;
      color: #fff;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .row {
      margin: 12px 0;
    }
    .label {
      color: #555;
      font-weight: 600;
    }
    .price {
      font-size: 22px;
      font-weight: bold;
      color: #4f46e5;
      margin-top: 15px;
    }
    .footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 30px;
    }
  </style>
</head>

<body>
  <div class="box">
    <div class="header">
      <h2>Booking Confirmed 🎉</h2>
    </div>

    <p>Hi <strong>${name}</strong>,</p>

    <p>Your office space booking has been successfully confirmed.</p>

    <div class="row">
      <span class="label">Property:</span> ${propertyTitle}
    </div>

    <div class="row">
      <span class="label">Location:</span> ${propertyCity}
    </div>

    <div class="row">
      <span class="label">Booking Date:</span> ${bookingDate}
    </div>

    <div class="price">
      Total Amount: ${price}
    </div>

    <p><strong>Payment Method:</strong> Pay at arrival</p>

    <p>Thank you for choosing <strong>SpaceMate</strong>.</p>

    <div class="footer">
      © 2025 SpaceMate. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
}
