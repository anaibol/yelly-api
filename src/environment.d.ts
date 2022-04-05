declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      AWS_SECRET_ACCESS_KEY: string
      AWS_ACCESS_KEY_ID: string
      DATABASE_URL: string
      DATABASE_READ_URL: string
      SENDBIRD_BASE_URL: string
      SENDBIRD_TOKEN: string
      ALGOLIA_API_KEY: string
      ALGOLIA_APP_ID: string
      ALGOLIA_INDEX_PREFIX: string
      EMAIL_PROVIDER_API_KEY: string
      SAMUEL_ADMIN_ID: string
      EXPO_ACCESS_TOKEN: string
      APP_BASE_URL: string
      TWILIO_ACCOUNT_SID: string
      TWILIO_AUTH_TOKEN: string
      TWILIO_VERIFICATION_SERVICE_SID: string
      NEO4J_USER: string
      NEO4J_PASSWORD: string
      NEO4J_URI: string
      PHONE_VERIFICATION_DISABLED: boolean
      AMPLITUDE_API_KEY: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
