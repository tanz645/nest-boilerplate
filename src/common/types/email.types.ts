export type EmailTemplateType = 'verification' | 'password-reset';

export interface EmailTemplateConfig {
  verification: number;
  'password-reset': number;
}

export interface EmailParams {
  name: string;
  verificationUrl?: string;
  resetUrl?: string;
  baseUrl: string;
}

export interface EmailRecipient {
  email: string;
  name: string;
}

export interface EmailTemplateData {
  templateId: number;
  params: EmailParams;
  recipient: EmailRecipient;
}
