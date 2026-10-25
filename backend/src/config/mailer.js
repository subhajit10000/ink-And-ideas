import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import env from "./env.js";
let transporter = null;

// Lazily created so a missing SMTP config doesn't crash server boot —
// it only throws when an email actually needs to be sent.
const getTransporter = () => {
    if (transporter) return transporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        throw new Error(
            "Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in .env"
        );
    }

    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: Number(SMTP_PORT) === 465, // true for port 465, false for 587/25
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    return transporter;
};


const otpEmailTemplate = ({ name, otp, expiryMinutes, purpose = "verifyEmail", appUrl = env.CLIENT_URL }) => {
  const isReset = purpose === "resetPassword";
  const heading = isReset ? "Reset your password" : "Verify your email address";
  const action = isReset ? "reset your Ink & Ideas password" : "finish creating your Ink & Ideas account";
  return `<!doctype html><html><body style="margin:0;padding:32px 12px;background:#f4f5f0;font-family:Arial,sans-serif;color:#263326"><div style="max-width:520px;margin:auto;background:#fff;border:1px solid #e3e7df;border-radius:22px;overflow:hidden"><div style="padding:28px 30px;background:#354331;color:#fff"><div style="font-size:24px;font-weight:800">ink<span style="color:#c8d5bb">&</span>ideas</div><p style="margin:8px 0 0;color:#dbe4d4;font-size:13px">A home for stories and ideas</p></div><div style="padding:32px"><p style="margin:0 0 8px;color:#718064;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">Secure verification</p><h1 style="margin:0 0 14px;font-size:25px">${heading}</h1><p style="line-height:1.7;color:#62695f">Hello ${String(name || "writer").replace(/[&<>"']/g, "")}, use the code below to ${action}. It expires in ${expiryMinutes} minutes.</p><div style="margin:26px 0;padding:22px;text-align:center;border-radius:16px;background:#f0f3eb;border:1px solid #dfe6d7"><div style="font-size:11px;font-weight:bold;letter-spacing:2px;color:#68745e;text-transform:uppercase">Your one-time code</div><div style="margin-top:12px;font-size:36px;font-weight:800;letter-spacing:10px;color:#354331">${otp}</div></div><p style="font-size:12px;line-height:1.7;color:#858b80">If you did not request this code, you can safely ignore this email. Never share your code with anyone.</p>${appUrl ? `<p style="margin-top:24px"><a href="${appUrl}" style="color:#354331;font-weight:bold">Return to Ink & Ideas</a></p>` : ""}</div><div style="padding:18px 30px;background:#f8f9f6;color:#92978d;font-size:11px">© ${new Date().getFullYear()} Ink & Ideas</div></div></body></html>`;
};


const sendOtpEmail = async ({ to, name, otp, expiryMinutes, appUrl, purpose = "verifyEmail" }) => {
    // Local development convenience: without SMTP settings, print the code to
    // the server console instead of failing, so the app is usable out of the box.
    const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    if (!smtpConfigured && env.NODE_ENV !== "production") {
        console.log(`\n[DEV MAIL] SMTP not configured. ${purpose} code for ${to}: ${otp} (expires in ${expiryMinutes} min)\n`);
        return;
    }
    const mailer = getTransporter();
    const isReset = purpose === "resetPassword";
    await mailer.sendMail({
        from: process.env.EMAIL_FROM || `"Ink & Ideas" <${process.env.SMTP_USER}>`,
        to,
        subject: isReset ? "Your Ink & Ideas password reset code" : "Verify your Ink & Ideas email",
        html: otpEmailTemplate({ name, otp, expiryMinutes, appUrl, purpose }),
        text: `${isReset ? "Your password reset code" : "Your Ink & Ideas email verification code"} is ${otp}. It expires in ${expiryMinutes} minutes.`,
    });
};

// =========================================================
// SHARED SIMPLE TEMPLATE (booking / status / invoice emails)
// =========================================================
// Reuses the same dark/amber "Car Detailing" branding as otpEmailTemplate
// above, but as a lighter single-card layout so we're not duplicating a
// 400-line table for every transactional email.
const simpleEmailTemplate = ({
  heading,
  greetingName,
  bodyLines = [],
  highlight,
  rows = [],
  footerNote,
  appUrl = env.CLIENT_URL,
}) => `
<div style="margin:0; padding:0; background-color:#0b0f14; font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0b0f14;">
    <tr>
      <td align="center" style="padding:40px 14px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px; max-width:560px; background-color:#11161d; border:1px solid #252c35; border-radius:20px; overflow:hidden;">

          <tr>
            <td align="center" style="padding:30px 28px; background-color:#171d25; border-bottom:1px solid #2a323d;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:800; letter-spacing:-0.6px;">
                Car<span style="color:#f59e0b;">Detailing</span>
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 30px;">
              <h2 style="margin:0 0 14px; color:#ffffff; font-size:21px; font-weight:700;">${heading}</h2>

              <p style="margin:0 0 16px; color:#9ca6b2; font-size:14px; line-height:1.7;">
                Hi <strong style="color:#fbbf24;">${greetingName || "there"}</strong>,
              </p>

              ${bodyLines
                .map(
                  (line) =>
                    `<p style="margin:0 0 12px; color:#c6ccd3; font-size:14px; line-height:1.7;">${line}</p>`,
                )
                .join("")}

              ${
                highlight
                  ? `<div style="margin:20px 0; padding:16px 18px; background-color:#171d25; border:1px solid #303944; border-radius:14px; text-align:center;">
                       <span style="color:#fbbf24; font-size:20px; font-weight:800;">${highlight}</span>
                     </div>`
                  : ""
              }

              ${
                rows.length
                  ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px; background-color:#171d25; border:1px solid #303944; border-radius:14px;">
                      ${rows
                        .map(
                          ([label, value]) => `
                        <tr>
                          <td style="padding:11px 16px; color:#7f8a97; font-size:12px; border-bottom:1px solid #232b33;">${label}</td>
                          <td style="padding:11px 16px; color:#e5e7eb; font-size:13px; font-weight:600; text-align:right; border-bottom:1px solid #232b33;">${value}</td>
                        </tr>`,
                        )
                        .join("")}
                    </table>`
                  : ""
              }

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px auto 0;">
                <tr>
                  <td align="center" style="background-color:#f59e0b; border-radius:10px;">
                    <a href="${appUrl || "#"}" target="_blank" style="display:inline-block; padding:12px 26px; color:#111111; font-size:13px; font-weight:800; text-decoration:none;">
                      View in Car Detailing &nbsp;&#8594;
                    </a>
                  </td>
                </tr>
              </table>

              ${
                footerNote
                  ? `<p style="margin:22px 0 0; text-align:center; color:#68737f; font-size:11px; line-height:1.6;">${footerNote}</p>`
                  : ""
              }
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 28px; background-color:#0b0f14;">
              <p style="margin:0; color:#4e5863; font-size:9px;">&copy; ${new Date().getFullYear()} Car Detailing. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>
`;

const sendMailSafely = async ({ to, subject, html, text }) => {
  const mailer = getTransporter();
  await mailer.sendMail({
    from: `"Car Detailing" <${process.env.SMTP_USER}>` || process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });
};

// Feature 1: sent right after a successful booking, and again on every
// repair-progress update. `event` is "booked" | "progress" | "invoice".
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const sendAppointmentConfirmationEmail = async ({
  to,
  name,
  appointment,
  workshopName,
  serviceNames = [],
}) => {
  await sendMailSafely({
    to,
    subject: "Your appointment is confirmed — Car Detailing",
    html: simpleEmailTemplate({
      heading: "Appointment Booked!",
      greetingName: name,
      bodyLines: [
        `Your appointment at <strong style="color:#fbbf24;">${workshopName}</strong> has been booked successfully. Here are the details:`,
      ],
      rows: [
        ["Date", formatDate(appointment.appointmentDate)],
        ["Time Slot", appointment.timeSlot],
        ["Vehicle", `${appointment.vehicle.make} ${appointment.vehicle.model} (${appointment.vehicle.regNumber})`],
        ["Services", serviceNames.join(", ") || "—"],
        ["Estimated Cost", appointment.estimatedCost != null ? `₹${appointment.estimatedCost}` : "To be confirmed"],
        ["Status", appointment.status],
      ],
      footerNote: "We'll email you again the moment the workshop updates your repair's progress.",
    }),
    text: `Your appointment at ${workshopName} on ${formatDate(appointment.appointmentDate)} (${appointment.timeSlot}) is booked. Estimated cost: ₹${appointment.estimatedCost ?? "TBD"}.`,
  });
};

// Feature 1 (continued): sent on every repair-progress / status update.
const sendAppointmentStatusEmail = async ({
  to,
  name,
  appointment,
  workshopName,
  newStatus,
  note,
}) => {
  const statusCopy = {
    CONFIRMED: "Your appointment has been confirmed by the workshop.",
    IN_PROGRESS: "Work has started on your vehicle.",
    COMPLETED: "Your repair/service is complete and your vehicle is ready.",
    CANCELLED: "Your appointment has been cancelled.",
  };

  await sendMailSafely({
    to,
    subject: `Update on your repair — now ${newStatus.replace("_", " ")}`,
    html: simpleEmailTemplate({
      heading: "Repair Progress Update",
      greetingName: name,
      bodyLines: [
        statusCopy[newStatus] || `Your appointment status changed to ${newStatus}.`,
        note ? `Note from the workshop: <em>${note}</em>` : "",
      ].filter(Boolean),
      highlight: newStatus.replace("_", " "),
      rows: [
        ["Workshop", workshopName],
        ["Vehicle", `${appointment.vehicle.make} ${appointment.vehicle.model} (${appointment.vehicle.regNumber})`],
        ["Date", formatDate(appointment.appointmentDate)],
      ],
    }),
    text: `Update: your appointment at ${workshopName} is now ${newStatus}.`,
  });
};

// Feature 4: invoice email, sent once the repair is marked COMPLETED.
const sendInvoiceEmail = async ({
  to,
  name,
  appointment,
  workshopName,
  serviceNames = [],
  attachmentBuffer,
}) => {
  await sendMailSafely({
    to,
    subject: `Invoice ${appointment.invoiceNumber} — Car Detailing`,
    html: simpleEmailTemplate({
      heading: "Your Invoice Is Ready",
      greetingName: name,
      bodyLines: [
        `Your service at <strong style="color:#fbbf24;">${workshopName}</strong> is complete. Your invoice is attached as a PDF.`,
      ],
      rows: [
        ["Invoice No.", appointment.invoiceNumber],
        ["Services", serviceNames.join(", ") || "—"],
        ["Estimated Cost", `₹${appointment.estimatedCost ?? 0}`],
        ["Final Cost", `₹${appointment.finalCost ?? appointment.estimatedCost ?? 0}`],
      ],
    }),
    text: `Your invoice ${appointment.invoiceNumber} is ready. Final cost: ₹${appointment.finalCost ?? appointment.estimatedCost ?? 0}.`,
  });

  if (attachmentBuffer) {
    const mailer = getTransporter();
    await mailer.sendMail({
      from: `"Car Detailing" <${process.env.SMTP_USER}>` || process.env.EMAIL_FROM,
      to,
      subject: `Invoice ${appointment.invoiceNumber} (PDF) — Car Detailing`,
      text: "Your invoice PDF is attached.",
      attachments: [
        {
          filename: `${appointment.invoiceNumber}.pdf`,
          content: attachmentBuffer,
          contentType: "application/pdf",
        },
      ],
    });
  }
};

// Feature 8: OTP for changing profile email/phone.
const sendProfileUpdateOtpEmail = async ({ to, name, otp, expiryMinutes, field, newValue }) => {
  await sendMailSafely({
    to,
    subject: `Confirm your ${field} change — Car Detailing`,
    html: simpleEmailTemplate({
      heading: `Confirm Your ${field === "email" ? "Email" : "Phone"} Change`,
      greetingName: name,
      bodyLines: [
        `We received a request to change the ${field} on your account to <strong style="color:#fbbf24;">${newValue}</strong>. Use the code below to confirm this change.`,
      ],
      highlight: otp,
      footerNote: `This code expires in ${expiryMinutes} minutes. Didn't request this? You can safely ignore this email.`,
    }),
    text: `Your verification code to change your ${field} is ${otp}. It expires in ${expiryMinutes} minutes.`,
  });
};

const sendRepairPhotoEmail = async ({ to, name, appointment, workshopName, photoUrl, stage, caption }) => {
  await sendMailSafely({
    to,
    subject: `Repair photo update — ${stage === "MID_REPAIR" ? "repair in progress" : "repair completed"}`,
    html: simpleEmailTemplate({
      heading: "Repair Photo Update",
      greetingName: name,
      bodyLines: [
        `The workshop <strong style="color:#fbbf24;">${workshopName}</strong> shared a photo from your vehicle repair.`,
        caption ? `<em>${caption}</em>` : "",
        `<img src="${photoUrl}" alt="Repair photo" style="max-width:100%;border-radius:12px;margin-top:12px;" />`,
      ].filter(Boolean),
      highlight: stage === "MID_REPAIR" ? "Repair in progress" : "After repair",
    }),
    text: `Repair photo update from ${workshopName}: ${photoUrl}${caption ? `\n${caption}` : ""}`,
  });
};

const sendAdvisorCustomerEmail = async ({ to, name, advisorName, workshopName, subject, message, imageUrl }) => {
  await sendMailSafely({
    to,
    subject: subject || `Message from your service advisor — ${workshopName}`,
    html: simpleEmailTemplate({
      heading: "Message From Your Service Advisor",
      greetingName: name,
      bodyLines: [
        `Your service advisor <strong>${advisorName}</strong> from <strong style="color:#fbbf24;">${workshopName}</strong> sent you the following message:`,
        `<div style="white-space:pre-wrap;background:#171d25;padding:16px;border-radius:12px;">${message}</div>`,
        imageUrl ? `<img src="${imageUrl}" alt="Shared photo" style="max-width:100%;border-radius:12px;margin-top:12px;" />` : "",
        `<p style="margin-top:16px;font-size:13px;color:#9ca3af;">You can also view this conversation any time from the Community tab in your account.</p>`,
      ].filter(Boolean),
    }),
    text: `${advisorName} from ${workshopName}:\n${message}${imageUrl ? `\n${imageUrl}` : ""}`,
  });
};

export {
  sendOtpEmail,
  sendAppointmentConfirmationEmail,
  sendAppointmentStatusEmail,
  sendInvoiceEmail,
  sendProfileUpdateOtpEmail,
  sendRepairPhotoEmail,
  sendAdvisorCustomerEmail,
};
export default {
  sendOtpEmail,
  sendAppointmentConfirmationEmail,
  sendAppointmentStatusEmail,
  sendInvoiceEmail,
  sendProfileUpdateOtpEmail,
  sendRepairPhotoEmail,
  sendAdvisorCustomerEmail,
};