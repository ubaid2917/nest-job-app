import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract error message as string
    let errorMessage: string;
    if (exception instanceof HttpException) {
      const responseObj = exception.getResponse();
      if (typeof responseObj === 'string') {
        errorMessage = responseObj;
      } else if (typeof responseObj === 'object' && responseObj !== null && 'message' in responseObj) {
        errorMessage = Array.isArray(responseObj['message'])
          ? (responseObj['message'] as unknown[]).map(String).join(', ')
          : String(responseObj['message']);
      } else {
        errorMessage = exception.message;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    } else {
      errorMessage = String(exception);
    }

    response.status(status).json({
      statusCode: status,
      message: errorMessage,
    });
  }
}