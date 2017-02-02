export class ServiceError extends Error {
  readonly info: string;
  readonly otherInfo: any;

  constructor(info: string, otherInfo?: any) {
    super(info);
    this.info = info;
    this.otherInfo = otherInfo;
  }

  toString() {
    return 'Info: ' + this.info + (this.otherInfo ? ' - ' + JSON.stringify(this.otherInfo, null, 4) : '');
  }
}
