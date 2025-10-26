export class CustomAuthError extends Error {
  type: string;

  constructor(message: string, type = "CustomAuthError") {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
  }
}

export class InvalidEmailPasswordError extends Error {
  type = "InvalidEmailPassword";

  constructor(message: string) {
    super(message);
    this.name = "InvalidEmailPasswordError";
  }
}

export class InActiveAccountError extends Error {
  type = "Account is not active !";

  constructor(message: string) {
    super(message);
    this.name = "InActiveAccountError";
  }
}
