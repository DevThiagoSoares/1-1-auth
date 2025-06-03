import { UserRole } from '../common/enums/user-role.enum'

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: Email;
  password: string;
  phone: Phone;
  role: UserRole;

  static create(props: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
  }): User {
    const user = new User();
    user.firstName = props.firstName;
    user.lastName = props.lastName;
    user.email = new Email(props.email);
    user.password = props.password;
    user.phone = new Phone(props.phone);
    user.role = props.role;

    return user;
  }
}

export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new Error(`Invalid email: ${email}`);
    }

    this.value = email;
  }

  public static isValid(email: string): boolean {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.toLowerCase());
  }

  public getValue(): string {
    return this.value;
  }
}

export class Phone {
  private readonly ddi: string;
  private readonly ddd: string;
  private readonly number: string;

  constructor(phone: string) {
    const onlyDigits = Phone.sanitize(phone);

    if (!Phone.isValid(onlyDigits)) {
      throw new Error(`Invalid phone number: ${phone}`);
    }

    this.ddi = onlyDigits.slice(0, 2);
    this.ddd = onlyDigits.slice(2, 4);
    this.number = onlyDigits.slice(4);
  }

  private static sanitize(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  public static isValid(phone: string): boolean {
    const digits = this.sanitize(phone);
    const lengthValid = digits.length === 12 || digits.length === 13;
    const numberPart = digits.slice(4);

    const numberValid = numberPart.length === 8 || numberPart.length === 9;

    return /^\d+$/.test(digits) && lengthValid && numberValid;
  }

  public toObject(): {
    ddi: string;
    ddd: string;
    number: string;
    formatted: string;
  } {
    return {
      ddi: this.ddi,
      ddd: this.ddd,
      number: this.number,
      formatted: this.toString()
    };
  }

  public toString(): string {
    const n = this.number;
    const formattedNumber =
      n.length === 9
        ? `${n.slice(0, 5)}-${n.slice(5)}`
        : `${n.slice(0, 4)}-${n.slice(4)}`;

    return `+${this.ddi} (${this.ddd}) ${formattedNumber}`;
  }

  public getRaw(): string {
    return `${this.ddi}${this.ddd}${this.number}`;
  }
}


