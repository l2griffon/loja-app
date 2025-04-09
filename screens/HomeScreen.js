import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  // Função para navegar para a tela de Categorias
  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryProducts', { category });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../imagem/logo.png')} // Certifique-se de que o caminho está correto
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Bem-vindo à Loja! 🛍️</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleCategoryPress('Perfumes')}>
        <Text style={styles.buttonText}>Perfumes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleCategoryPress('Cestas de Presentes')}>
        <Text style={styles.buttonText}>Cestas de Presente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleCategoryPress('Brinquedos')}>
        <Text style={styles.buttonText}>Brinquedos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PersonalizedOptions')}>
        <Text style={styles.buttonText}>Personalizados</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('Perfil')}>
        <View style={styles.iconRow}>
          <Ionicons name="person-circle-outline" size={22} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Ver Meu Perfil</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.replace('Cart')}>
        <Text style={styles.buttonText}>Ir para o meu Carrinho</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.logoutText}>← Voltar para o Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 30,
    textAlign: 'center',
    shadowColor: '#d4af37',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  button: {
    backgroundColor: '#d4af37',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: '#b8860b',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 30,
  },
  logoutText: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'underline',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
});
