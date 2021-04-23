const admin = require('firebase-admin');
const express = require('express');
const asyncHandler = require('express-async-handler');
const cookieParser = require('cookie-parser');
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');

const config = require('./config');
const db = require('./lib/db');
const { oauthClient } = require('./lib/line');

const cookieSecret = config.auth.cookiesecret;
const callbackUrl = config.linelogin.callbackurl;
const scope = 'profile openid';

const app = express();

app.use(cookieParser(cookieSecret));

app.get('/auth/login', (req, res) => {
  console.log('Generating a new state for login request');
  const state = nanoid();

  const redirectUrl = oauthClient.authorizeURL({
    redirect_uri: callbackUrl,
    scope,
    state,
  });

  const nextUrl = req.headers.referer || '/';
  const sessionData = Buffer.from(JSON.stringify({ state, nextUrl })).toString('base64');

  console.log('Saving state and redirect url to session cookie');
  res.cookie('__session', sessionData, { httpOnly: true, maxAge: 180000, signed: true });

  res.redirect(redirectUrl);
});

app.get('/auth/callback', asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  // eslint-disable-next-line no-underscore-dangle
  const rawSession = req.signedCookies.__session;

  if (!code || !state || !rawSession) {
    res.sendStatus(400);
    return;
  }

  const session = JSON.parse(Buffer.from(rawSession, 'base64').toString());
  const { state: origState } = session;

  if (state !== origState) {
    console.log('state not match with origState');
    res.sendStatus(401);
    return;
  }

  const tokenParams = {
    code,
    scope,
    redirect_uri: callbackUrl,
  };

  console.log('Exchange code for access token');
  const { token } = await oauthClient.getToken(tokenParams);
  const decoded = jwt.verify(token.id_token, config.linelogin.secret, { algorithms: ['HS256'] });

  console.log(`Create Firebase custom token for user: ${decoded.sub}`);
  const customToken = await admin.auth().createCustomToken(decoded.sub);

  await db.updateOrCreateUser({
    id: decoded.sub,
    displayName: decoded.name,
    photoUrl: decoded.picture || null,
    accessToken: JSON.stringify(token),
  });

  res.redirect(`/#access_token=${customToken}`);
}));

module.exports = app;
