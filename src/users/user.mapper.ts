import { UserDocument } from "./user.schema";
import { Email, Phone, User } from "./users.entity";


export class UserMapper {
  static toDomain(document: UserDocument): User {
    return {
      id: document._id.toString(),
      firstName: document.firstName,
      lastName: document.lastName,
      email: new Email(document.email),
      password: document.password,
      phone: new Phone(document.phone),
      role: document.role
    };
  }

  static toPersistence(user: User): any {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.getValue(),
      password: user.password,
      phone: user.phone.getRaw(),
      role: user.role
    };
  }
}
