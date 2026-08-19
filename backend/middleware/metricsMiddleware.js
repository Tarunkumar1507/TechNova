const client = require('prom-client');

// Create a Registry
const register = new client.Registry();

// Collect default metrics (CPU, Memory, Uptime, etc.)
client.collectDefaultMetrics({ register });

// Custom metric: HTTP request duration in seconds
const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

register.registerMetric(httpRequestDurationSeconds);

const metricsMiddleware = (req, res, next) => {
  // Avoid collecting metrics for the /metrics path itself
  if (req.path === '/metrics' || req.path === '/api/health') {
    return next();
  }

  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    // Normalize path by replacing MongoDB ObjectIds with :id placeholder
    let route = req.baseUrl + req.path;
    route = route.replace(/[0-9a-fA-F]{24}/g, ':id');

    httpRequestDurationSeconds
      .labels(req.method, route, res.statusCode)
      .observe(duration);
  });

  next();
};

module.exports = {
  metricsMiddleware,
  register,
};
