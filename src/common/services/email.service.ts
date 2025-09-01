import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SibApiV3Sdk from '@getbrevo/brevo';
import { EmailTemplateType, EmailTemplateData } from '../types/email.types';

@Injectable()
export class EmailService {
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;

  constructor(private configService: ConfigService) {
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      this.configService.get<string>('brevo.apiKey'),
    );
  }

  private getTemplateId(type: EmailTemplateType): number {
    const templateIds = {
      verification: this.configService.get<number>(
        'email.templates.verification',
      ),
      'password-reset': this.configService.get<number>(
        'email.templates.passwordReset',
      ),
    };

    const templateId = templateIds[type];
    if (!templateId) {
      throw new Error(`Template ID not configured for ${type} email`);
    }

    return templateId;
  }

  private async sendTemplateEmail(
    templateData: EmailTemplateData,
  ): Promise<void> {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.templateId = templateData.templateId;
    sendSmtpEmail.params = templateData.params;
    sendSmtpEmail.to = [templateData.recipient];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.error('Error sending template email:', error);
      throw new Error('Failed to send template email');
    }
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    verificationToken: string,
  ): Promise<void> {
    const verificationBaseUrl = this.configService.get<string>(
      'email.verificationUrl',
    );
    const verificationUrl = `${verificationBaseUrl}?token=${verificationToken}`;

    const templateData: EmailTemplateData = {
      templateId: this.getTemplateId('verification'),
      params: {
        name,
        verificationUrl,
        baseUrl: verificationBaseUrl,
      },
      recipient: { email, name },
    };

    await this.sendTemplateEmail(templateData);
  }

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetToken: string,
  ): Promise<void> {
    const resetPasswordUrl = this.configService.get<string>(
      'email.resetPasswordUrl',
    );
    const resetUrl = `${resetPasswordUrl}?token=${resetToken}`;

    const templateData: EmailTemplateData = {
      templateId: this.getTemplateId('password-reset'),
      params: {
        name,
        resetUrl,
        baseUrl: resetPasswordUrl,
      },
      recipient: { email, name },
    };

    await this.sendTemplateEmail(templateData);
  }
}
