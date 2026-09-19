import { ApiError } from '../utils/apiError.js';

export const validate = schema => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign parsed/sanitized values back to request
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;

      next();
    } catch (error) {
      if (error.errors) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.').replace(/^(body|query|params)\./, ''),
          message: err.message,
        }));
        return next(new ApiError(400, 'Validation failed for request data', errorMessages));
      }
      return next(new ApiError(400, error.message || 'Validation error'));
    }
  };
};
