
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.BREVO_SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

export async function sendOtpEmail(to, otp) {

  console.log(`The otp is sending to ${to} and the otp is ${otp}`)

  const info = await transporter.sendMail({
    from: `${process.env.BREVO_FROM_NAME} <${process.env.BREVO_FROM_EMAIL}>`,
    to,
    subject: "OTP Verification",
    html: `
     <!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <title>OTP Verification – Veyra</title>

  <style type="text/css">
    

    /* ── Reset ── */
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      background-color: #0d1117;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    a {
      text-decoration: none;
    }

    /* ── Responsive ── */
    @media only screen and (max-width: 620px) {
      .email-wrapper {
        padding: 20px 10px !important;
      }

      .email-card {
        border-radius: 12px !important;
      }

      /* Header */
      .header-cell {
        padding: 24px 20px 18px 20px !important;
      }

      .brand-name {
        font-size: 22px !important;
      }

      .tagline {
        font-size: 11px !important;
        letter-spacing: 1px !important;
      }

      /* Banner image */
      .banner-img-wrap {
        padding: 0 12px 0 12px !important;
      }

      .banner-img {
        border-radius: 10px !important;
        width: 100% !important;
        max-width: 100% !important;
      }

      /* Body */
      .body-cell {
        padding: 28px 20px 24px 20px !important;
      }

      .otp-title {
        font-size: 21px !important;
      }

      .otp-subtitle {
        font-size: 14px !important;
      }

      .otp-box {
        padding: 20px 24px !important;
      }

      .otp-code {
        font-size: 32px !important;
        letter-spacing: 8px !important;
      }

      .otp-label {
        font-size: 10px !important;
      }

      /* Footer */
      .footer-cell {
        padding: 20px 20px !important;
      }

      .footer-links {
        font-size: 12px !important;
      }

      .footer-copy {
        font-size: 11px !important;
      }
    }

    @media only screen and (max-width: 400px) {
      .otp-code {
        font-size: 26px !important;
        letter-spacing: 6px !important;
      }

      .otp-box {
        padding: 16px 14px !important;
      }
    }
  </style>
</head>

<body style="margin:0;padding:0;background-color:#0d1117;">

  <!-- Outer wrapper -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
    style="background-color:#0d1117;min-width:100%;">
    <tr>
      <td align="center" class="email-wrapper" style="padding:40px 16px;">

        <!-- 600px card container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-card"
          style="max-width:600px;width:100%;border-radius:20px;overflow:hidden;background-color:#161b22;border:1px solid #30363d;box-shadow:0 4px 32px rgba(0,0,0,0.5);">

          <!-- ─── HEADER ─── -->
          <tr>
            <td class="header-cell" align="center" style="background-color:#161b22;padding:32px 40px 24px 40px;">

              <!-- Logo row: icon + wordmark side by side -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>

                  <!-- Brand name -->
                  <td valign="middle">
                    <span class="brand-name" style="
font-family: 'Michroma', sans-serif;
font-size:28px;
font-weight:700;
letter-spacing:0.15em;
text-transform:uppercase;
color: #ffffff;
display:inline-block;
">
                      Veyra
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Tagline -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                <tr>
                  <td align="center" style="padding:0;">
                    <span class="tagline"
                      style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:500;color:#8b949e;letter-spacing:1.2px;">Home of modern creators.</span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ─── BANNER IMAGE (padded + rounded corners) ─── -->
          <tr>
            <td align="center" class="banner-img-wrap"
              style="background-color:#161b22;padding:0 24px 8px 24px;font-size:0;line-height:0;">
            </td>
          </tr>

          <!-- ─── BODY ─── -->
          <tr>
            <td class="body-cell" style="background-color:#161b22;padding:36px 48px 32px 48px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">

          

                <!-- Title -->
                <tr>
                  <td align="center" style="padding-bottom:10px;">
                    <h1 class="otp-title"
                      style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;color:#f0f6fc;letter-spacing:-0.4px;">
                      Verify Your Account</h1>
                  </td>
                </tr>

                <!-- Subtitle -->
                <tr>
                  <td align="center" style="padding-bottom:30px;">
                    <p class="otp-subtitle"
                      style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#8b949e;line-height:1.65;max-width:400px;">
                      Use the one-time passcode below to complete your verification on <strong
                        style="color:#ffffff;">Veyra</strong>. This code expires in <strong style="color:#f0f6fc;">5
                        minutes</strong>.
                    </p>
                  </td>
                </tr>

                <!-- OTP Block -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0"
                      style="width:100%;max-width:380px;">
                      <tr>
                        <td align="center" class="otp-box"
                          style="background-color:#0d1117;border:2px dashed #30363d;border-radius:14px;padding:26px 40px;">
                          <p class="otp-label"
                            style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;color:#818cf8;letter-spacing:2px;text-transform:uppercase;">
                            Your One-Time Passcode</p>
                          <p class="otp-code"
                            style="margin:0;font-family:'Courier New',Courier,monospace;font-size:42px;font-weight:700;color:#c9d1d9;letter-spacing:12px;line-height:1.2;">
                            ${otp}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Timer badge -->
                <tr>
                  <td align="center" style="padding-bottom:30px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center"
                          style="background-color:#2b220e;border-radius:20px;padding:7px 18px;">
                          <span
                            style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#f59e0b;font-weight:600;">&#9200;
                            Expires in 5 minutes</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="border-top:1px solid #30363d;font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Security warning -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left"
                          style="background-color:#2c1b1d;border-left:4px solid #f85149;border-radius:0 8px 8px 0;padding:12px 16px;">
                          <p
                            style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#ff7b72;font-weight:600;">
                            &#128274;&nbsp;&nbsp;Never share this OTP with anyone — including Postify support.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Ignore notice -->
                <tr>
                  <td align="center">
                    <p
                      style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8b949e;line-height:1.6;">
                      Didn't request this? You can safely ignore this email.<br />
                      Your account will remain secure and unchanged.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- ─── FOOTER ─── -->
          <tr>
            <td class="footer-cell" align="center"
              style="background-color:#0d1117;border-top:1px solid #30363d;padding:24px 40px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom:10px;">
                    <p class="footer-links"
                      style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8b949e;">
                      <a href="https://portfolio-site-kappa-lilac.vercel.app"
                        style="color:#58a6ff;text-decoration:none;">Design & Developed By Rajat Maurya</a>
                      &nbsp;&nbsp;·&nbsp;&nbsp;
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p class="footer-copy"
                      style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#484f58;">
                      &copy; 2026 Veyra, Inc. All rights reserved.<br />
                      <span style="font-size:11px;">You're receiving this because a sign-in was attempted on your
                        account.</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- End card -->

      </td>
    </tr>
  </table>

</body>

</html>
    `,
  });

  return info;
}
