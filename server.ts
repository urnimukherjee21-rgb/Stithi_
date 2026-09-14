import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer, { Transporter } from 'nodemailer';
import { createServer as createViteServer } from 'vite';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes FIRST
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/inquire/status', (_req: Request, res: Response) => {
    const isConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
    res.json({
      configured: isConfigured,
      recipient: process.env.CONTACT_EMAIL || 'urnimukherjee21@gmail.com',
      transport: isConfigured ? 'authenticated_smtp' : 'ethereal_archival_transport',
    });
  });

  app.post('/api/inquire', async (req: Request, res: Response) => {
    try {
      const { name, email, artwork, message } = req.body;

      if (!name || typeof name !== 'string' || !name.trim()) {
        res.status(400).json({ success: false, error: 'Collector name is required.' });
        return;
      }

      if (!email || typeof email !== 'string' || !email.includes('@')) {
        res.status(400).json({ success: false, error: 'A valid collector email address is required.' });
        return;
      }

      const cleanArtwork = artwork && typeof artwork === 'string' ? artwork.trim() : 'General Monograph Inquiry';
      const cleanMessage = message && typeof message === 'string' ? message.trim() : 'No additional note provided.';
      const recipientEmail = process.env.CONTACT_EMAIL || 'urnimukherjee21@gmail.com';

      // Setup Nodemailer Transporter
      let transporter: Transporter;
      let fromAddress = 'studio@stithi-monograph.art';
      let isTestAccount = false;

      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        // Authenticated SMTP (Gmail, SendGrid, Amazon SES, or custom SMTP)
        const isGmail = process.env.SMTP_USER.includes('@gmail.com');
        const host = process.env.SMTP_HOST || (isGmail ? 'smtp.gmail.com' : undefined);
        const port = Number(process.env.SMTP_PORT) || (process.env.SMTP_SECURE === 'true' ? 465 : 587);
        const secure = process.env.SMTP_SECURE === 'true' || port === 465;

        transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        fromAddress = process.env.SMTP_USER;
      } else {
        // Fallback to Nodemailer Ethereal Archival Test Account
        // Creates a real, verifiable message dispatch with preview URL
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        fromAddress = `"Stithi Fine Art Dispatch" <${testAccount.user}>`;
        isTestAccount = true;
      }

      // Styled Archival HTML Body
      const htmlContent = `
        <div style="background-color: #131313; color: #e5e2e1; font-family: 'Georgia', serif; padding: 40px 20px; line-height: 1.6;">
          <div style="max-width: 620px; margin: 0 auto; background-color: #1c1b1b; border: 1px solid #5a403c; padding: 32px;">
            <div style="border-bottom: 1px solid #5a403c; padding-bottom: 16px; margin-bottom: 24px;">
              <div style="font-family: 'Courier New', monospace; font-size: 11px; color: #ffb4a8; text-transform: uppercase; letter-spacing: 2px;">
                Stithi Monograph // Acquisition Dispatch
              </div>
              <h1 style="font-size: 26px; color: #f5f2f0; margin: 8px 0 0 0; font-weight: normal; letter-spacing: 0.5px;">
                Direct Inquiry for ${cleanArtwork}
              </h1>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #aa8984; font-family: 'Courier New', monospace; width: 140px; font-size: 11px; text-transform: uppercase;">
                  Collector Name:
                </td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #aa8984; font-family: 'Courier New', monospace; font-size: 11px; text-transform: uppercase;">
                  Collector Email:
                </td>
                <td style="padding: 8px 0; color: #ffb4a8;">
                  <a href="mailto:${email}" style="color: #ffb4a8; text-decoration: underline;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #aa8984; font-family: 'Courier New', monospace; font-size: 11px; text-transform: uppercase;">
                  Plate / Work:
                </td>
                <td style="padding: 8px 0; color: #e5e2e1;">
                  ${cleanArtwork}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #aa8984; font-family: 'Courier New', monospace; font-size: 11px; text-transform: uppercase;">
                  Dispatched At:
                </td>
                <td style="padding: 8px 0; color: #aa8984; font-size: 12px;">
                  ${new Date().toUTCString()}
                </td>
              </tr>
            </table>

            <div style="margin-bottom: 24px; background-color: #0e0e0e; border: 1px solid #332826; padding: 20px;">
              <div style="font-family: 'Courier New', monospace; font-size: 10px; color: #aa8984; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                Collector Note / Courier Region:
              </div>
              <p style="margin: 0; color: #f0ebe9; font-size: 14px; white-space: pre-wrap;">
                ${cleanMessage}
              </p>
            </div>

            <div style="border-top: 1px solid #5a403c; padding-top: 16px; font-size: 11px; color: #88726e; font-family: 'Courier New', monospace;">
              <span>Dispatched to Artist: ${recipientEmail}</span><br />
              <span>Direct Reply-To is set to collector (${email}).</span>
            </div>
          </div>
        </div>
      `;

      const mailOptions = {
        from: fromAddress,
        to: recipientEmail,
        replyTo: `${name} <${email}>`,
        subject: `[Stithi Acquisition] Inquiry: ${cleanArtwork} — ${name}`,
        text: `Stithi Monograph Acquisition Dispatch\n\nCollector: ${name} (${email})\nPlate: ${cleanArtwork}\n\nNote:\n${cleanMessage}\n\nTimestamp: ${new Date().toISOString()}`,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      const previewUrl = isTestAccount ? nodemailer.getTestMessageUrl(info) : null;

      console.log(`[Nodemailer] Inquiry dispatched: ID=${info.messageId}${previewUrl ? `, Preview=${previewUrl}` : ''}`);

      res.status(200).json({
        success: true,
        messageId: info.messageId,
        previewUrl,
        recipient: recipientEmail,
        isTestAccount,
        note: `Inquiry successfully transmitted via Nodemailer to ${recipientEmail}`,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown transport error';
      console.error('[Nodemailer Error]', err);
      res.status(500).json({
        success: false,
        error: `Nodemailer transmission failed: ${errorMessage}`,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Stithi Monograph server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
