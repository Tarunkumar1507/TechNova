const logger = (req, res, next) => {
  const start = Date.now();

  // Helper function to sanitize logs
  const sanitize = (body) => {
    if (!body) return null;
    const sanitized = { ...body };
    const sensitiveKeys = ['password', 'token', 'secret', 'jwt'];
    sensitiveKeys.forEach((key) => {
      if (key in sanitized) {
        sanitized[key] = '***REDACTED***';
      }
    });
    return sanitized;
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const { method, originalUrl } = req;
    const statusCode = res.statusCode;

    // Build log message
    let logMsg = `[${timestamp}] ${method} ${originalUrl} ${statusCode} - ${duration}ms`;

    if (Object.keys(req.body).length > 0) {
      const sanitizedBody = sanitize(req.body);
      logMsg += ` | Body: ${JSON.stringify(sanitizedBody)}`;
    }

    console.log(logMsg);
  });

  next();
};

module.exports = logger;
