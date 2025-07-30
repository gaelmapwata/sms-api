import MailService from './MailService';

export default {
  async sendOtpToUser(email: string, otp: string) {
    const mailPayload = {
      template: 'otp',
      mailTo: email,
      locals: { otp },
    };
    await MailService.sendMailFromEmailTemplates(mailPayload);
  },
};
