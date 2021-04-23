const admin = require('firebase-admin');
const express = require('express');

const config = require('./config');

admin.initializeApp({
  projectId: config.projectId,
});

const api = require('./api');
const auth = require('./auth');

const server = express();

server.disable('x-powered-by');
server.disable('etag');

server.use((req, res, next) => {
  res.set('Expires', 'Thu, 01 Jan 1970 00:00:00 UTC');
  res.set('Cache-Control', 'no-cache, no-store, no-transform, must-revalidate, private, max-age=0');
  res.set('Pragma', 'no-cache');
  res.set('X-Accel-Expires', '0');
  next();
});

server.get('/ping', (req, res) => {
  res.type('text');
  res.send('');
});

server.use(api);
server.use(auth);

server.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
});
