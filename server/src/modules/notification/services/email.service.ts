import { IEmailProvider } from "../interfaces/email.provider.interface";

export class EmailService {
  constructor(
    private readonly emailProvider: IEmailProvider,
  ) {}

  async sendEmail(data: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    await this.emailProvider.sendEmail(data);
  }
}