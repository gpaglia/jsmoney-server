export class ServiceError implements Error {
  readonly name: string;
  readonly message: string;
  readonly otherInfo: any;

  constructor(error: ServiceError);
  constructor(message: string, otherInfo?: any);

  constructor(messageOrError: string | ServiceError, otherInfo?: any) {
    this.name = this['constructor'].name;
    if (arguments.length === 1) {
      let error: ServiceError = messageOrError as ServiceError;
      this.message = error.message;
      this.otherInfo = error.otherInfo;
    } else {
      this.message = messageOrError as string;
      this.otherInfo = otherInfo;
    }

  }

  toString() {
    return 'Error ' + this.name + ': ' + this.message + (this.otherInfo ? ' - ' + JSON.stringify(this.otherInfo, null, 4) : '');
  }
}
