export class ApiResponse {
  constructor(statusCode, data, message = 'Success', errors = []) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.errors = errors;
  }

  static success(res, data, message = 'Operation successful', statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message, []));
  }

  static created(res, data, message = 'Resource created successfully') {
    return res.status(201).json(new ApiResponse(201, data, message, []));
  }
}
