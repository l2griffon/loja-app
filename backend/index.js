const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const serviceAccount = require('./serviceAccountKey.json');

const app = express();
const port = 3001;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(cors());
app.use(bodyParser.json());

// Rota para adicionar produtos em lote
app.post('/adicionar-produtos', async (req, res) => {
  const { produtos } = req.body;

  if (!Array.isArray(produtos) || produtos.length === 0) {
    return res.status(400).json({ message: 'Nenhum produto enviado.' });
  }

  const batch = db.batch();
  const produtosRef = db.collection('products');

  produtos.forEach((produto) => {
    const docRef = produtosRef.doc(); // gera ID automático
    batch.set(docRef, {
      name: produto.nome,
      price: Number(produto.preco),
      category: produto.categoria,
      image: produto.imagem,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  try {
    await batch.commit();
    res.status(200).json({ message: 'Produtos adicionados com sucesso!' });
  } catch (error) {
    console.error('Erro ao adicionar produtos:', error);
    res.status(500).json({ message: 'Erro ao adicionar produtos.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
