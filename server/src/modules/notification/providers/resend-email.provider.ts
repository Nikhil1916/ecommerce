import { Resend } from "resend";
import { env } from "../../../config/env";
import { IEmailProvider } from "../interfaces/email.provider.interface";
import logger from "../../../lib/logger";

export class ResendEmailProvider implements IEmailProvider {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
  }

  async sendEmail(data: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    const { data: result, error } = await this.resend.emails.send({
      from: env.EMAIL_FROM,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    logger.info(
      {
        emailId: result?.id,
        to: data.to,
        subject: data.subject,
      },
      "Email sent successfully",
    );
  }
}