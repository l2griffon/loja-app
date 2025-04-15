import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import app from '../firebaseConfig';

const HomeScreen = ({ navigation, route }) => {
  const { isAdmin } = route.params || {};  // Garantir que o parâmetro seja passado corretamente
  const auth = getAuth(app);

  // Função para navegar para a tela de Categorias
  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryProducts', { category });
  };

  // Função de Logout com confirmação
  const handleLogout = () => {
    Alert.alert(
      "Confirmar Logout",
      "Você tem certeza que deseja sair do seu usuário?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: async () => {
            try {
              await signOut(auth); // Desconecta o usuário
              navigation.navigate('Login'); // Redireciona para a tela de Login
            } catch (error) {
              console.error("Erro ao desconectar usuário: ", error);
              Alert.alert("Erro", "Não foi possível desconectar o usuário.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Exibe logo e boas-vindas apenas para usuários normais */}
      {!isAdmin && (
        <>
          <Image
            source={require('../imagem/logo.png')} // Certifique-se de que o caminho está correto
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Bem-vindo à Loja! 🛍️</Text>
        </>
      )}

      {/* Se for Admin, exibe apenas as opções administrativas */}
      {isAdmin ? (
        <View style={styles.adminPanel}>
          <Text style={styles.adminTitle}>Painel Administrativo</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminOrders')}>
            <Text style={styles.buttonText}>Visualizar Pedidos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProductImport')}>
            <Text style={styles.buttonText}>Importar Produtos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Opções de categorias para o cliente
        <View style={styles.categoryPanel}>
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
        </View>
      )}

      {/* Botão de logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>← Voltar para o Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
  adminPanel: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  adminTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 10,
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
  categoryPanel: {
    width: '100%',
    alignItems: 'center',
  },
});

export default HomeScreen;
