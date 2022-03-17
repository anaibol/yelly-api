/* eslint-disable @typescript-eslint/no-empty-interface */
export interface CreatedBy {
  require_auth_for_profile_image: boolean
  nickname: string
  user_id: string
  profile_url: string
}

export interface DisappearingMessage {
  message_survival_seconds: number
  is_triggered_by_message_read: boolean
}

export interface Translations {}

export interface User {
  require_auth_for_profile_image: boolean
  is_active: boolean
  role: string
  user_id: string
  nickname: string
  profile_url: string
  metadata: string[]
}

export interface File {}

export interface LastMessage {
  message_survival_seconds: number
  custom_type: string
  mentioned_users: any[]
  translations: Translations
  updated_at: number
  is_op_msg: boolean
  is_removed: boolean
  user: User
  file: File
  message: string
  data: string
  message_retention_hour: number
  silent: boolean
  type: string
  created_at: number
  channel_type: string
  mention_type: string
  channel_url: string
  message_id: number
}

export interface SmsFallback {
  wait_seconds: number
  exclude_user_ids: any[]
}

export interface Channel {
  name: string
  member_count: number
  custom_type: string
  channel_url: string
  created_at: number
  cover_url: string
  max_length_message: number
  data: string
}

export interface GroupChannel {
  message_survival_seconds: number
  unread_message_count: number
  is_distinct: boolean
  custom_type: string
  is_ephemeral: boolean
  cover_url: string
  freeze: boolean
  created_by: CreatedBy
  is_discoverable: boolean
  is_public: boolean
  data: string
  disappearing_message: DisappearingMessage
  ignore_profanity_filter: boolean
  is_super: boolean
  name: string
  member_count: number
  created_at: number
  is_access_code_required: boolean
  is_broadcast: boolean
  last_message: LastMessage
  unread_mention_count: number
  sms_fallback: SmsFallback
  joined_member_count: number
  max_length_message: number
  channel_url: string
  channel: Channel
}
