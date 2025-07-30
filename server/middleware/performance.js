const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    
    // Log slow requests (> 1000ms)
    if (duration > 1000) {
      console.warn(`🐌 Slow API Request: ${req.method} ${req.path} - ${duration}ms`);
    }
    
    // Log all requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 API Request: ${req.method} ${req.path} - ${duration}ms`);
    }
    
    // Add response time header
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

module.exports = performanceMiddleware; 