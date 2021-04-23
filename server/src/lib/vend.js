const axios = require('axios').default;

const {
  host,
  country,
  payuuid,
  key: pointCheckKey,
  amountkey: amountCheckKey,
} = require('../config').vend;

const vend = axios.create({
  baseURL: host,
});

async function checkPoints(code) {
  console.log('Checking remaining points');

  const postData = {
    country,
    key: pointCheckKey,
    id: code,
  };

  const headers = {
    referer: `${host}/app/point_check/point_check?key=${pointCheckKey}&country=${country}`,
  };

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
  const params = new URLSearchParams();
  params.set('func', 'loadDefaultAmount');
  params.set('vidCode', machineId);
  params.set('key', amountCheckKey);

  const headers = {
    'content-type': 'application/x-www-form-urlencoded',
    referer: `${host}/machineid/${machineId}`,
  };

  const { data } = await vend.post('/epay/model/payment_api', params.toString(), { headers });
  return data;
}

async function pay(machineId, payCode, amount) {
  const payData = {
    vid: machineId,
    amount: `${amount}`,
    staff_id: payCode,
    uuid: payuuid,
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
