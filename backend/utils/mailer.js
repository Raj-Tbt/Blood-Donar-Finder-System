/**
 * Email Notification Service
 *
 * Sends email alerts to matching donors when a critical blood request
 * is posted. Uses Nodemailer with Gmail SMTP transport.
 *
 * @module utils/mailer
 */

const nodemailer = require('nodemailer');

/** Nodemailer transporter configured with Gmail SMTP credentials */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send email alerts to matching donors for a critical blood request.
 *
 * @param {Array<{email: string, name: string}>} donors - Matching donor records.
 * @param {Object} request - The blood request details.
 * @param {string} request.blood_group - Required blood group.
 * @param {number} request.units_needed - Number of units needed.
 * @param {string} [request.description] - Additional request details.
 * @returns {Promise<void>}
 */
async function sendCriticalAlert(donors, request) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured. Skipping email alerts.');
    return;
  }

  const emailPromises = donors.map(donor => {
    const mailOptions = {
      from: `"Blood Donor Finder" <${process.env.EMAIL_USER}>`,
      to: donor.email,
      subject: `CRITICAL: ${request.blood_group} Blood Needed Urgently!`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #C0392B, #922B21); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Urgent Blood Request</h1>
          </div>
          <div style="padding: 32px;">
            <p style="font-size: 16px; color: #2C3E50;">Dear <strong>${donor.name}</strong>,</p>
            <p style="font-size: 16px; color: #2C3E50;">
              A <strong style="color: #C0392B;">CRITICAL</strong> blood request has been posted that matches your blood group.
            </p>
            <div style="background: #FDF2F2; border-left: 4px solid #C0392B; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <p style="margin: 4px 0;"><strong>Blood Group:</strong> ${request.blood_group}</p>
              <p style="margin: 4px 0;"><strong>Units Needed:</strong> ${request.units_needed}</p>
              <p style="margin: 4px 0;"><strong>Description:</strong> ${request.description || 'N/A'}</p>
            </div>
            <p style="font-size: 16px; color: #2C3E50;">
              Your donation can save a life. Please log in to the Blood Donor Finder System to respond.
            </p>
            <p style="font-size: 14px; color: #7F8C8D; margin-top: 32px;">
              Thank you for being a donor!
            </p>
          </div>
        </div>
      `
    };

    return transporter.sendMail(mailOptions).catch(err => {
      console.error(`Failed to send email to ${donor.email}:`, err.message);
    });
  });

  await Promise.allSettled(emailPromises);
}

module.exports = { sendCriticalAlert };
