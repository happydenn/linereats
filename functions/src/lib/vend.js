const functions = require('firebase-functions');
const axios = require('axios').default;

const {
  host,
  country,
  key: pointCheckKey,
  amountkey: amountCheckKey,
} = functions.config().vend;

const vend = axios.create({
  baseURL: host,
});

async function checkPoints(code) {
  console.log('Checking remaining points');

  const refererUrl = `${host}/app/point_check/point_check?key=${pointCheckKey}&country=${country}`;
  const postData = {
    country,
    key: pointCheckKey,
    id: code,
  };
  const headers = { referer: refererUrl };

  try {
    const { data } = await vend.post('/app/point_check/point_check_api', postData, { headers });

    if (data.returnCode !== '0000') {
      return -1;
    }

    return parseFloat(data.point);
  } catch (error) {
    console.warn(`Error checking points: ${error.message}`);
    return -1;
  }
}

async function checkMachineAmount(machineId) {
  const qs = new URLSearchParams();
  qs.set('func', 'loadDefaultAmount');
  qs.set('vidCode', machineId);
  qs.set('key', amountCheckKey);

  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
  };

  const { data } = await vend.post('/epay/model/payment_api', qs.toString(), { headers });
  return data;
}

async function pay(machineId, payCode, amount) {
  const payData = {
    vid: machineId,
    amount: `${amount}`,
    staff_id: payCode,
    uuid: '111',
    haveAuth: false,
  };

  const formData = new URLSearchParams();
  formData.set('data', JSON.stringify(payData));

  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    referer: `${host}/machineid/${machineId}`,
  };

  const { data } = await vend.post('/epay/staff/staff.php', formData.toString(), { headers });
  return data;
}

module.exports = {
  checkPoints,
  checkMachineAmount,
  pay,
};
