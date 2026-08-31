export interface IEmailProvider {
  sendEmail(data: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void>;
}