import { UserRole } from '../common/enums/user-role.enum'

export class User {
  id: number
  username: string
  password: string
  role: UserRole
}
