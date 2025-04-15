import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';  // Usando expo-document-picker
import { db } from '../firebaseConfig';  // Certifique-se de que o caminho esteja correto
import * as FileSystem from 'expo-file-system';  // Usado para ler o arquivo
import xml2js from 'xml2js';  // Biblioteca para processar XML

const ProductImportScreen = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleXMLImport = async () => {
    try {
      // Permitir que o administrador selecione o arquivo XML
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',  // Permite qualquer tipo de arquivo
      });

      if (res.type === 'cancel') {
        setFeedback('Seleção de arquivo cancelada.'); // Mensagem de cancelamento
        return;  // Se o usuário cancelar a seleção, não faz nada
      }

      setLoading(true);
      setFeedback('');

      const fileUri = res.uri;
      if (!fileUri) {
        setLoading(false);
        setFeedback('Nenhum arquivo foi selecionado.');
        return;  // Se não houver URI, interrompe o processo
      }

      // Usando FileSystem para ler o arquivo XML
      try {
        const xmlText = await FileSystem.readAsStringAsync(fileUri);

        // Converter XML para JSON usando xml2js
        const parser = new xml2js.Parser();
        parser.parseString(xmlText, async (err, result) => {
          if (err) {
            setLoading(false);
            setFeedback('Erro ao processar o XML');
            Alert.alert('Erro', 'Não foi possível processar o XML.');
            return;
          }

          // Aqui você pode navegar até a parte do XML que contém os produtos
          const produtos = result.nfeProc.NFe[0].infNFe[0].det.map((produto) => {
            return {
              codigo: produto.prod[0].cProd[0], 
              codigo_barras: produto.prod[0].cEAN[0],  
              descricao: produto.prod[0].xProd[0],  
              image: produto.prod[0].url[0],  
              ncm_sh: produto.prod[0].NCM[0],  
              quantidade: parseInt(produto.prod[0].qCom[0]),  
              unidade: produto.prod[0].uCom[0],  
              valor_icms: parseFloat(produto.imposto[0].ICMS[0].ICMSUFDest[0].vICMS[0]),  
              valor_total: parseFloat(produto.prod[0].vProd[0]),  
              valor_unitario: parseFloat(produto.prod[0].vUnCom[0]),  
              cfop: produto.prod[0].CFOP[0],  
            };
          });

          // Inserir os produtos no Firestore
          try {
            for (const produto of produtos) {
              const productRef = doc(db, 'products', produto.codigo_barras); 
              await setDoc(productRef, produto);  
            }
            setLoading(false);
            setFeedback('✅ Produtos importados com sucesso!');
            Alert.alert('Sucesso', 'Produtos foram importados com sucesso!');
          } catch (error) {
            setLoading(false);
            console.error('Erro ao adicionar produtos ao Firestore:', error);
            setFeedback('❌ Erro ao adicionar produtos');
            Alert.alert('Erro', 'Não foi possível adicionar os produtos.');
          }
        });
      } catch (error) {
        setLoading(false);
        console.error('Erro ao ler o arquivo:', error);
        Alert.alert('Erro', 'Não foi possível ler o arquivo XML.');
      }
    } catch (err) {
      setLoading(false);
      if (err.type === 'cancel') {
        setFeedback('Seleção de arquivo cancelada.');
      } else {
        console.error('Erro ao selecionar o arquivo:', err);
        setFeedback('Erro ao selecionar o arquivo');
        Alert.alert('Erro', 'Não foi possível selecionar o arquivo XML.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#B8860B" />
      ) : (
        <View>
          <Text style={styles.title}>📥 Importação de Produtos</Text>
          <TouchableOpacity onPress={handleXMLImport} style={styles.button}>
            <Text style={styles.buttonText}>Importar XML da Nota Fiscal</Text>
          </TouchableOpacity>
          {feedback && <Text style={styles.feedback}>{feedback}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#B8860B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  feedback: {
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ProductImportScreen;
