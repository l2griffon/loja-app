import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { db } from '../firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';

const PersonalizedOptionsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);
  const [produtos, setProdutos] = useState([]);
  
  useEffect(() => {
    const fetchCategoriasComProdutos = async () => {
      try {
        // Aqui você busca as coleções de categorias (como Canecas, Garrafas, Tacas)
        const categorias = ['Canecas', 'Garrafas', 'Tacas']; // A lista de categorias

        // Aqui vamos verificar se há documentos dentro dessas coleções
        const categoriasComDados = [];

        for (let categoria of categorias) {
          const categoriaRef = collection(db, categoria); // Exemplo: Canecas
          const querySnapshot = await getDocs(categoriaRef);
          if (!querySnapshot.empty) {
            categoriasComDados.push(categoria); // Armazenar as categorias que possuem produtos
          }
        }

        setCategoriasDisponiveis(categoriasComDados);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriasComProdutos();
  }, []);

  const handleCategoryPress = async (categoria) => {
    navigation.navigate('CategoryProducts', { category: categoria });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#B8860B" />
        <Text style={styles.loadingText}>Carregando opções...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Escolha a opção personalizada</Text>

      {categoriasDisponiveis.length === 0 ? (
        <Text style={styles.noProductsText}>Nenhum produto disponível no momento.</Text>
      ) : (
        categoriasDisponiveis.map((categoria) => (
          <TouchableOpacity
            key={categoria}
            style={styles.button}
            onPress={() => handleCategoryPress(categoria)} // Navega para a categoria de produtos
          >
            <Text style={styles.buttonText}>{categoria}</Text>
          </TouchableOpacity>
        ))
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  button: {
    backgroundColor: '#d4af37',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noProductsText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  backButton: {
    marginTop: 30,
  },
  backButtonText: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'underline',
  },
});

export default PersonalizedOptionsScreen;
