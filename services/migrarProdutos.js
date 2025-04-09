import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // ajuste o caminho se estiver diferente

const CATEGORIAS_ORIGINAIS = ['Canecas', 'Garrafas', 'Tacas'];

export const migrarProdutosParaNovaColecao = async () => {
  try {
    for (const categoria of CATEGORIAS_ORIGINAIS) {
      const ref = collection(db, categoria);
      const snapshot = await getDocs(ref);

      for (const document of snapshot.docs) {
        const dados = document.data();

        const novoProduto = {
          ...dados,
          categoria: categoria,
        };

        const novoDocRef = doc(db, 'products', document.id);
        await setDoc(novoDocRef, novoProduto);
        console.log(`Produto ${document.id} migrado da coleção ${categoria}`);
      }
    }

    alert('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao migrar produtos:', error);
    alert('Erro ao migrar produtos. Veja o console.');
  }
};
