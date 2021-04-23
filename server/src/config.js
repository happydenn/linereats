const required = [
  'GCP_PROJECT',
  'LINEREATS_PAYCODE_SECRET',
  'LINEREATS_COOKIE_SECRET',
  'LINEREATS_LINE_CHANNEL_ID',
  'LINEREATS_LINE_CHANNEL_SECRET',
  'LINEREATS_REDIRECT_URL',
  'LINEREATS_VEND_POINTSKEY',
  'LINEREATS_VEND_HOST',
  'LINEREATS_VEND_AMOUNTKEY',
  'LINEREATS_VEND_UUID',
]

required.forEach((k) => {
  if (!(k in process.env)) {
    throw new Error(`Missing required setting ${k}`);
  }
});

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  projectId: process.env.GCP_PROJECT,
  api: {
    paycodesecret: process.env.LINEREATS_PAYCODE_SECRET,
  },
  auth: {
    cookiesecret: process.env.LINEREATS_COOKIE_SECRET,
  },
  linelogin: {
    id: process.env.LINEREATS_LINE_CHANNEL_ID,
    secret: process.env.LINEREATS_LINE_CHANNEL_SECRET,
    callbackurl: process.env.LINEREATS_REDIRECT_URL,
  },
  vend: {
    country: process.env.LINEREATS_VEND_COUNTRY || 'tw',
    key: process.env.LINEREATS_VEND_POINTSKEY,
    host: process.env.LINEREATS_VEND_HOST,
    amountkey: process.env.LINEREATS_VEND_AMOUNTKEY,
    payuuid: process.env.LINEREATS_VEND_UUID,
  },
};

module.exports = config;
