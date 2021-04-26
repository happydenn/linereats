const admin = require('firebase-admin');
const differenceInMinutes = require('date-fns/differenceInMinutes');

const line = require('./line');
const vend = require('./vend');

const db = admin.firestore();
const users = db.collection('users');
const machines = db.collection('machines');
const orders = db.collection('orders');

async function updateOrCreateUser(data) {
  const { id, ...userData } = data;
  const ref = users.doc(id);
  const { exists } = await ref.get();

  userData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

  if (!exists) {
    userData.createdAt = admin.firestore.FieldValue.serverTimestamp();
    return ref.set(userData);
  }

  return ref.update(userData);
}

async function getUser(id) {
  const ref = users.doc(id);
  const snap = await ref.get();

  if (!snap.exists) {
    return null;
  }

  let userData = snap.data();

  if (differenceInMinutes(new Date(), userData.updatedAt.toDate()) > 60) {
    const { token, profileData } = await line.getProfile(userData.accessToken);

    await updateOrCreateUser({
      id,
      displayName: profileData.displayName,
      photoUrl: profileData.pictureUrl || null,
      accessToken: token,
    });

    userData = (await ref.get()).data();
  }

  return { id, ...userData };
}

async function getMachine(id) {
  const ref = machines.doc(id);
  const snap = await ref.get();

  let machineData = snap.data();

  if (!snap.exists) {
    machineData = { id };
  }

  if (!machineData.updatedAt || differenceInMinutes(new Date(), machineData.updatedAt.toDate()) > 120) {
    const name = await vend.getMachineName(id);
    await createOrUpdateMachine(id, { id, name });
    return getMachine(id);
  }

  return machineData;
}

async function createOrUpdateMachine(id, data) {
  const ref = machines.doc(id);
  const snap = await ref.get();
  const timestamp = admin.firestore.FieldValue.serverTimestamp();

  if (snap.exists) {
    return ref.update({
      ...data,
      updatedAt: timestamp,
    })
  }

  return ref.set({
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

async function createOrder(data) {
  return orders.add({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

module.exports = {
  updateOrCreateUser,
  getUser,
  createOrUpdateMachine,
  getMachine,
  createOrder,
};
