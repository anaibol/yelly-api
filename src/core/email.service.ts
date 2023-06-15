import * as mailchimp from '@mailchimp/mailchimp_transactional'
import { Injectable } from '@nestjs/common'

import { EMAIL_SUBJECT, EMAIL_TEMPLATE, EMAIL_VARIABLES_KEY, FROM_EMAIL } from './email.constants'

@Injectable()
export class EmailService {
  private emailProvider
  constructor() {
    this.emailProvider = mailchimp(process.env.EMAIL_PROVIDER_API_KEY)

    this.testConnection()
  }

  private testConnection() {
    // eslint-disable-next-line functional/no-return-void
    return this.emailProvider.users.ping().then(() => {
      console.log('EMAIL Server is working as expected')
    })
  }

  private sendTemplate(templateName: string, toEmail: string, variableValues: { name: string; content: string }[]) {
    return this.emailProvider.messages.sendTemplate({
      template_name: templateName,
      template_content: [{}],
      _message: {
        global_merge_vars: variableValues,
        from_email: FROM_EMAIL,
        to: [{ email: toEmail }],
        subject: EMAIL_SUBJECT.FORGOTTEN_PASSWORD,
        important: false,
      },
      get message() {
        return this._message
      },
      set message(value) {
        // eslint-disable-next-line functional/immutable-data
        this._message = value
      },
    })
  }

  sendForgottenPasswordEmail(to: string, resetToken: string) {
    return this.sendTemplate(EMAIL_TEMPLATE.FORGOTTEN_PASSWORD, to, [
      { name: EMAIL_VARIABLES_KEY.RESET_TOKEN, content: resetToken },
    ])
  }
}
