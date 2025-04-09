const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); // Carrega as variáveis do .env

const serviceAccount = require(path.join(__dirname, "firebaseServiceAccount.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };
