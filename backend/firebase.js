const admin = require("firebase-admin");
const serviceAccount = require("./firebaseServiceAccount.json"); // Importa as credenciais

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://essencial-fa6a9.firebaseio.com", // Substitua pelo seu Database URL
});

const db = admin.firestore(); // Inicializa o Firestore

module.exports = db;
