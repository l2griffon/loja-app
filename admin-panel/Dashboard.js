// admin-panel/Dashboard.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { migrarProdutosParaNovaColecao } from '../services/migrarProdutos';

const Dashboard = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const produtosRef = collection(db, 'products');
        const snapshot = await getDocs(produtosRef);

        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProdutos(lista);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    buscarProdutos();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Painel Administrativo</h1>

      <button style={styles.button} onClick={migrarProdutosParaNovaColecao}>
        Migrar Produtos (Canecas, Garrafas, Taças)
      </button>

      <div style={styles.grid}>
        {produtos.map((produto) => (
          <div key={produto.id} style={styles.card}>
            <img src={produto.imagem} alt={produto.nome} style={styles.image} />
            <h3>{produto.nome}</h3>
            <p><strong>Preço:</strong> R$ {Number(produto.valor).toFixed(2)}</p>
            <p><strong>Categoria:</strong> {produto.categoria}</p>
            {/* Botões de editar e deletar podem vir aqui depois */}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: 40,
    maxWidth: 1200,
    margin: '0 auto',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: 28,
    color: '#B8860B',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#B8860B',
    color: 'white',
    padding: '12px 24px',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: 20,
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: 12,
    padding: 16,
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: 180,
    objectFit: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
};

export default Dashboard;
