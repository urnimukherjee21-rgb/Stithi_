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

      // 1. If real authenticated SMTP is configured in environment
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const isGmail = process.env.SMTP_USER.includes('@gmail.com');
        const host = process.env.SMTP_HOST || (isGmail ? 'smtp.gmail.com' : undefined);
        const port = Number(process.env.SMTP_PORT) || 465;
        const secure = process.env.SMTP_SECURE === 'true' || port === 465;

        const transporter = nodemailer.createTransport(
          isGmail
            ? {
                service: 'gmail',
                auth: {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
                },
              }
            : {
                host,
                port,
                secure,
                auth: {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
                },
              }
        );

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
          from: process.env.SMTP_USER,
          to: recipientEmail,
          replyTo: `${name} <${email}>`,
          subject: `[Stithi Acquisition] Inquiry: ${cleanArtwork} — ${name}`,
          text: `Stithi Monograph Acquisition Dispatch\n\nCollector: ${name} (${email})\nPlate: ${cleanArtwork}\n\nNote:\n${cleanMessage}\n\nTimestamp: ${new Date().toISOString()}`,
          html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[SMTP] Inquiry sent directly to ${recipientEmail}, MessageId: ${info.messageId}`);
        res.status(200).json({
          success: true,
          method: 'smtp',
          recipient: recipientEmail,
          message: `Inquiry successfully transmitted via SMTP to ${recipientEmail}.`,
        });
        return;
      }

      // 2. Dispatch via FormSubmit directly to recipient email
      const originUrl = req.headers.origin || 'https://ais-pre-gjpxuzzl5vdsblx5i47hmz-925278960502.asia-east1.run.app';
      const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': originUrl,
          'Referer': `${originUrl}/`,
        },
        body: JSON.stringify({
          name,
          email,
          artwork: cleanArtwork,
          message: cleanMessage,
          _subject: `[Stithi Acquisition] Inquiry: ${cleanArtwork} — ${name}`,
          _replyto: email,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await formSubmitRes.json();
      console.log('[FormSubmit Response]', data);

      if (data.success === 'true' || data.success === true) {
        res.status(200).json({
          success: true,
          method: 'formsubmit',
          recipient: recipientEmail,
          message: `Inquiry successfully forwarded to ${recipientEmail}.`,
        });
        return;
      }

      if (data.message && data.message.includes('Activation')) {
        res.status(200).json({
          success: false,
          needsActivation: true,
          recipient: recipientEmail,
          message: `FormSubmit requires one-time activation. An activation email has been sent to ${recipientEmail}. Please check your Gmail (including Spam/Junk) and click "Activate Form" once to receive future submissions directly.`,
        });
        return;
      }

      res.status(400).json({
        success: false,
        recipient: recipientEmail,
        error: data.message || 'FormSubmit delivery could not be completed.',
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown transport error';
      console.error('[Inquiry Endpoint Error]', err);
      res.status(500).json({
        success: false,
        error: `Inquiry transmission error: ${errorMessage}`,
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
