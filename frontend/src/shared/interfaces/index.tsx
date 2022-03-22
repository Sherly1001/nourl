export type Nullable<T> = T | null

export interface User {
  id: string
  email: string
  display_name?: string
  avatar_url?: string
  github_id?: string
  google_id?: string
  facebook_id?: string
}
