const admin = require('firebase-admin');

admin.initializeApp();

exports.api = require('./src/api');
exports.auth = require('./src/auth');
