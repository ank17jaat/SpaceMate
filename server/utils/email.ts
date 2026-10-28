import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

export function initializeEmailService() {
  const { SMTP_EMAIL, SMTP_PASS } = process.env;

  if (!SMTP_EMAIL || !SMTP_PASS) {
    console.warn("Email service not configured");
    return false;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASS,
    },
  });

  return true;
}

interface BookingEmailPayload {
  name?: string;
  userEmail?: string;
  checkIn?: string | null;
  checkOut?: string | null;
  totalPrice?: number | null;
  propertyTitle?: string;
  propertyAddress?: string;
  propertyCity?: string;
}

export async function sendBookingEmail(payload: BookingEmailPayload) {
  if (!transporter || !payload.userEmail) {
    return false;
  }

  const html = generateBookingEmailHTML(payload);

  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: payload.userEmail,
      subject: `Booking Confirmation - ${payload.propertyTitle ?? "Office Space"}`,
      html,
    });

    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

function generateBookingEmailHTML(data: BookingEmailPayload): string {
  const checkIn = new Date(data.checkIn ?? Date.now()).toLocaleDateString("en-IN");
  const checkOut = new Date(data.checkOut ?? Date.now()).toLocaleDateString("en-IN");
  const totalPrice =
    typeof data.totalPrice === "number" ? data.totalPrice.toLocaleString("en-IN") : "0";

  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">
    <h2 style="margin-top: 0;">Booking Confirmed</h2>
    <p>Hi ${data.name ?? "Guest"},</p>
    <p>Your booking has been confirmed.</p>
    <p><strong>Property:</strong> ${data.propertyTitle ?? "Office Space"}</p>
    <p><strong>Location:</strong> ${data.propertyAddress ?? ""} ${data.propertyCity ?? ""}</p>
    <p><strong>Check-in:</strong> ${checkIn}</p>
    <p><strong>Check-out:</strong> ${checkOut}</p>
    <p><strong>Total:</strong> INR ${totalPrice}</p>
    <p><strong>Payment:</strong> Pay cash at arrival</p>
  </div>
</body>
</html>`;
}
