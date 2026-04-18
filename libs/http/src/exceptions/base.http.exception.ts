export class BaseHttpException extends Error {
  statusCode: number;
  clientErrorMessage: string;
  systemErrorMessage: string;
  details?: unknown;

  constructor(statusCode: number, clientErrorMessage: string, systemErrorMessage: string, details?: unknown) {
    super();

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.clientErrorMessage = clientErrorMessage;
    this.systemErrorMessage = systemErrorMessage;
    this.details = details;
  }
}
