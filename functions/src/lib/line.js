const functions = require('firebase-functions');
const { AuthorizationCode } = require('simple-oauth2');
const axios = require('axios').default;

const config = {
  client: {
    id: functions.config().linelogin.id,
    secret: functions.config().linelogin.secret,
  },
  auth: {
    tokenHost: 'https://api.line.me',
    tokenPath: '/oauth2/v2.1/token',
    authorizeHost: 'https://access.line.me',
    authorizePath: '/oauth2/v2.1/authorize',
  },
};

const oauthClient = new AuthorizationCode(config);

async function getProfile(accessToken) {
  let token = oauthClient.createToken(JSON.parse(accessToken));

  if (token.expired(86400)) {
    token = await token.refresh();
  }

  const { data: profileData } = await axios.get('https://api.line.me/v2/profile', {
    headers: {
      authorization: `Bearer ${token.token.access_token}`,
    },
  });

  return { token: JSON.stringify(token), profileData };
}

module.exports = {
  config,
  oauthClient,
  getProfile,
};
