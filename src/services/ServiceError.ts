/**
 * ServiceError class
 */

// tslint:disable:no-any

export class ServiceError implements Error {
  public readonly name: string;
  public readonly message: string;
  public readonly otherInfo: any;

  constructor(error: ServiceError);
  constructor(message: string, otherInfo?: any);

  constructor(messageOrError: string | ServiceError, otherInfo?: any) {
    this.name = this.constructor.name;
    if (arguments.length === 1) {
      const error: ServiceError = messageOrError as ServiceError;
      this.message = error.message;
      this.otherInfo = error.otherInfo;
    } else {
      this.message = messageOrError as string;
      this.otherInfo = otherInfo;
    }

  }

  public toString(): string {
    return "Error " + this.name + ": " + this.message + (this.otherInfo ? " - " + JSON.stringify(this.otherInfo, null, 4) : "");
  }
}
