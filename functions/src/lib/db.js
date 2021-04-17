const admin = require('firebase-admin');
const differenceInMinutes = require('date-fns/differenceInMinutes');

const line = require('./line');

const db = admin.firestore();
const users = db.collection('users');

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

module.exports = {
  updateOrCreateUser,
  getUser,
};
