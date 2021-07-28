export interface Tranche {
  tranche_id: string
  tranche_start: Date
  tranche_end: Date
  total_added: number
  total_removed: number
  locked_amount: number
  deposits: Array<any>
  withdrawals: Array<any>
  users: Array<any>
}