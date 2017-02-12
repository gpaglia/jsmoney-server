import { ServiceError } from '../services/service.error';
import { IApiError } from 'jsmoney-server-api';

const DEFAULT_ERROR_STATUS = 500;

export class ApiError extends ServiceError implements IApiError {
  readonly status: number;

  constructor(status: number, message: string, otherInfo?: any);
  constructor(status: number, error: ServiceError); 
  constructor(error: ServiceError);

  constructor(statusOrError: number | ServiceError, messageOrError?: string | ServiceError, otherInfo?: any) {
    let status: number;
    let error: ServiceError;
    let message: string;

    if (arguments.length === 1) {
      status = DEFAULT_ERROR_STATUS;
      error = statusOrError as ServiceError;
      super(error);
      this.status = status;
    } else if (arguments.length === 2 && typeof(messageOrError) === 'string') {
      status = statusOrError as number;
      message = messageOrError as string;
      super(message, otherInfo);
      this.status = status;      
    } else if (arguments.length === 2) {
      status = statusOrError as number;
      error = messageOrError as ServiceError;
      super(error);
      this.status = status;
    } else {
      status = statusOrError as number;
      message = messageOrError as string;
      super(message, otherInfo);
      this.status = status;
    }
  }

  toString() {
    return 'Error ' + this.name + '(' + this.status +  '): ' + this.message + (this.otherInfo ? ' - ' + JSON.stringify(this.otherInfo, null, 4) : '');
  }
}

export const NO_USER_ERROR = new ApiError(500, 'NoUserInRequest', 'No user or no role in request');
export const NO_AUTH_ERROR = new ApiError(401, 'InsufficientRole', 'Insufficient authorization for requested function');
export const NO_USERS_FOUND = new ApiError(404, 'NoUsersFound', 'No users defined');
export const NO_CURRENCY_FOUND = new ApiError(404, 'NoCurrencyFound', 'No currency defined');
export const NOT_YET_IMPLEMENTED = new ApiError(501, 'NotYetImplemented', 'Function not yet implemented');
export const INTERNAL_ERROR = new ApiError(500, 'InternalError', 'InternalError');

