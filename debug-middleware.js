module.exports = function attachDebug(app) {
  // if app is passed, attach middleware; otherwise attach globally
  if (app && app.use) {
    app.use((req, res, next) => {
      console.log('[REQ]', new Date().toISOString(), req.method, req.url);
      next();
    });
  } else {
    console.warn('debug-middleware: no app instance passed — attach manually.');
  }

  // global error handlers
  process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION', err && err.stack || err);
  });
  process.on('unhandledRejection', (r) => {
    console.error('UNHANDLED REJECTION', r && (r.stack || r));
  });

  // expose attach function for manual require in app
  return attachDebug;
};
