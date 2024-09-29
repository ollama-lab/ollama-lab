export interface Session {
  id: number
  title: string | null
  owner: string
  model: string | null
  date_created: Date
}
