export class HttpError extends Error {
  readonly status: number;
  readonly info: string;
  readonly otherInfo: any;

  constructor(status: number, info: string, otherInfo?: any) {
    super(info);
    this.status = status;
    this.info = info;
    this.otherInfo = otherInfo;
  }

  toString() {
    return 'Status: ' + this.status + ' info: ' + this.info + (this.otherInfo ? ' - ' + JSON.stringify(this.otherInfo, null, 4) : '');
  }
}
