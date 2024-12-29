class ApiError extends Error {
  httpStatus: number;
  errorCode: string;
  constructor(message: string, httpStatus: number, errorCode: string) {
    super(message);
    this.httpStatus = httpStatus;
    this.errorCode = errorCode;
  }
}

export const throwError = ({ message, httpStatus, errorCode }: { message: string; httpStatus: number; errorCode: string }) => {
  const error = new ApiError(message, httpStatus, errorCode);
  throw error;
};
