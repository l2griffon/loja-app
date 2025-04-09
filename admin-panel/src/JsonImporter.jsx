import React, { useState } from 'react';
import { db } from './firebaseConfig'; // Supondo que o firebaseConfig está configurado corretamente
import { collection, doc, writeBatch } from 'firebase/firestore';  // Importando funções necessárias do Firestore

export default function JsonImporter() {
  const [jsonInput, setJsonInput] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para analisar o JSON
  const handlePreview = () => {
    try {
      const data = JSON.parse(jsonInput);
      
      if (Array.isArray(data)) {
        // Validação dos campos necessários
        const validData = data.filter(produto => produto.descricao && produto.preco && produto.categoria);
        setProdutos(validData);  // Apenas produtos válidos
        setFeedback('✅ Pré-visualização pronta!');
      } else {
        setFeedback('❌ O JSON precisa ser um array de produtos.');
        setProdutos([]);
      }
    } catch (err) {
      setFeedback('❌ JSON inválido.');
      setProdutos([]);
    }
  };

  // Função para importar os produtos para o Firestore
  const handleImport = async () => {
    setLoading(true);
    setFeedback('');

    try {
      const batch = writeBatch(db); // Cria um batch de escrita

      produtos.forEach(produto => {
        const categoria = produto.categoria || 'outros'; // Define categoria padrão se faltar
        const categoriaRef = collection(db, categoria); // Coleção por categoria
        const produtoRef = doc(categoriaRef); // Cria um novo doc

        batch.set(produtoRef, {
          codigo: produto.codigo,
          valor_icms: produto.icms,
          valor_total: produto.vTotal,
          valor_unitario: produto.preco,
          ncm_sh: produto.ncm,
          descricao: produto.descricao,
          unidade: produto.unidade,
          quantidade: produto.quantidade,
          cfop: produto.cfop,
          codigo_barras: produto.codigoBarras,
          image: produto.image || '' // 👉 Adiciona a imagem, se existir
        });
      });

      await batch.commit();
      setFeedback('✅ Produtos importados com sucesso!');
    } catch (error) {
      console.error(error);
      setFeedback('❌ Erro ao importar os produtos.');
    }
    setLoading(false);
  };

  // Exibe produtos agrupados por categoria
  const renderProductsByCategory = () => {
    const groupedByCategory = produtos.reduce((acc, produto) => {
      (acc[produto.categoria] = acc[produto.categoria] || []).push(produto);
      return acc;
    }, {});

    return Object.keys(groupedByCategory).map((categoria, index) => (
      <div key={index} style={{ marginBottom: 20 }}>
        <h4>{categoria}</h4>
        {groupedByCategory[categoria].map((produto, prodIndex) => (
          <div key={prodIndex} style={{ marginBottom: 15 }}>
            <strong>{produto.descricao}</strong>
            <ul>
              <li>Código: {produto.codigo}</li>
              <li>Valor Unitário: R$ {produto.preco}</li>
              <li>Quantidade: {produto.quantidade}</li>
              <li>Categoria: {produto.categoria}</li>
              {produto.image && (
                <li>
                  <img src={produto.image} alt="Produto" style={{ width: 100, marginTop: 5 }} />
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h3>📥 Importador de Produtos</h3>
      <textarea
        placeholder="Cole o JSON aqui..."
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows={10}
        cols={80}
        style={{ marginBottom: 10 }}
      />
      <br />
      <button onClick={handlePreview} style={{ marginRight: 10 }}>🔍 Pré-visualizar</button>
      <button onClick={handleImport} disabled={loading || produtos.length === 0}>
        {loading ? 'Importando...' : '📤 Importar para Firestore'}
      </button>
      {feedback && <p style={{ marginTop: 10 }}>{feedback}</p>}

      {produtos.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4>📂 Produtos:</h4>
          {renderProductsByCategory()}
        </div>
      )}
    </div>
  );
}
