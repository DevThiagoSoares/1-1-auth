import { UserRole } from '../common/enums/user-role.enum';

export class CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export class UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: UserRole;
}