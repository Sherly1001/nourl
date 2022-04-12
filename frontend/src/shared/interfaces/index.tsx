export type Nullable<T> = T | null

export interface User {
  id: string
  email: string
  display_name: string
  avatar_url: Nullable<string>
  github_id: Nullable<string>
  google_id: Nullable<string>
  facebook_id: Nullable<string>
  hash_passwd: Nullable<string>
}

export interface Url {
  id: string
  code: string
  url: string
  owner: Nullable<string>
}
