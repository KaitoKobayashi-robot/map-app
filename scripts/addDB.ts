const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("../serviceAccountKey.json");
const data = require("./yamanote_station.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function uploadData() {
  console.log("start upload data...");

  const locationsCollectionRef = db.collection("locations");
  const batch = db.batch();

  for (const dataId in data) {
    const dataInfo = data[dataId];
    const locationDocRef = locationsCollectionRef.doc(dataId);
    batch.set(locationDocRef, dataInfo);
  }

  await batch.commit();
  console.log("Success! Complete adding data");
}

uploadData().catch(console.error);
