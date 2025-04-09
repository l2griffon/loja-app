import React, { useState } from 'react';
import { XMLParser } from 'fast-xml-parser';
import { db } from './firebaseConfig';  // Assumindo que o Firestore já está configurado
import { collection, doc, writeBatch } from 'firebase/firestore';  // Importando writeBatch corretamente

function UploaderDeProdutos() {
  const [xmlFile, setXmlFile] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setXmlFile(event.target.files[0]);
    setProdutos([]);
    setStatus('');
  };

  const handleUpload = () => {
    if (!xmlFile) {
      setStatus('❗ Por favor, selecione um arquivo XML.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const xml = e.target.result;
        const parser = new XMLParser({ ignoreAttributes: false });
        const json = parser.parse(xml);

        let det = null;

        // Extrair a parte da "detalhamento" da nota fiscal
        if (json?.nfeProc?.NFe?.infNFe?.det) {
          det = json.nfeProc.NFe.infNFe.det;
        } else if (json?.NFe?.infNFe?.det) {
          det = json.NFe.infNFe.det;
        } else if (json?.infNFe?.det) {
          det = json.infNFe.det;
        }

        if (!det) {
          setStatus('❌ Nenhum produto encontrado na nota.');
          return;
        }

        const itens = Array.isArray(det) ? det : [det];

        const produtosExtraidos = itens.map((item) => {
          const prod = item.prod;
          if (!prod || !prod.xProd || !prod.vUnCom) return null;
          const nome = prod.xProd;
          let categoria = 'outros';
          const nomeLower = nome.toLowerCase();
          // Definir categorias com base no nome do produto
          if (nomeLower.includes('perfume')) categoria = 'perfumes';
          else if (nomeLower.includes('cesta')) categoria = 'cestas';
          else if (nomeLower.includes('brinquedo')) categoria = 'brinquedos';
          else if (nomeLower.includes('caneca')) categoria = 'canecas';

          return {
            nome,
            codigo: prod?.cProd || '',
            quantidade: parseFloat(prod?.qCom || 0),
            precoUnitario: parseFloat(prod?.vUnCom || 0),
            precoTotal: parseFloat(prod?.vProd || 0),
            ncm: prod?.NCM || '',
            cfop: prod?.CFOP || '',
            categoria,
          };
        }).filter(Boolean);

        setProdutos(produtosExtraidos);
        setStatus('✅ Produtos carregados com sucesso!');
      } catch (err) {
        console.error("❌ Erro ao processar XML:", err);
        setStatus('❌ Erro ao ler o XML.');
      }
    };

    reader.readAsText(xmlFile);
  };

  const handleEnviar = async () => {
    if (produtos.length === 0) {
      setStatus('⚠️ Nenhum produto carregado.');
      return;
    }

    try {
      setLoading(true);
      const batch = writeBatch(db);

      produtos.forEach((produto) => {
        if (!produto.nome || !produto.codigo || !produto.precoUnitario || !produto.quantidade) {
          console.error("Produto inválido:", produto);
          return;
        }

        // Usando a categoria para decidir a coleção
        const produtoRef = doc(collection(db, produto.categoria));  // Coleção baseada na categoria
        batch.set(produtoRef, produto);  // Adiciona o produto na coleção correta
      });

      await batch.commit();

      setStatus('✅ Produtos enviados com sucesso!');
      setProdutos([]);
    } catch (error) {
      console.error("❌ Erro ao enviar produtos:", error);
      setStatus('❌ Erro ao enviar produtos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <input type="file" accept=".xml" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: 10 }}>📤 Carregar XML</button>

      {produtos.length > 0 && (
        <>
          <h3 style={{ marginTop: 20 }}>📋 Produtos encontrados:</h3>
          <ul>
            {produtos.map((p, index) => (
              <li key={index}>
                <strong>{p.nome}</strong> - Cód: {p.codigo} | Qtde: {p.quantidade} | R$ {p.precoUnitario.toFixed(2)} (Total: R$ {p.precoTotal.toFixed(2)}) | NCM: {p.ncm} | CFOP: {p.cfop} | Categoria: {p.categoria}
              </li>
            ))}
          </ul>
          <button onClick={handleEnviar} disabled={loading}>
            {loading ? '⏳ Enviando...' : '🚀 Enviar para Firestore'}
          </button>
        </>
      )}

      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </div>
  );
}

export default UploaderDeProdutos;
