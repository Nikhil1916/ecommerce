import { IEmailProvider } from "../interfaces/email.provider.interface";

export class FakeEmailProvider implements IEmailProvider {
  async sendEmail(data: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    console.log("📧 Sending email...");
    console.log("To:", data.to);
    console.log("Subject:", data.subject);
    console.log("HTML:", data.html);
  }
}