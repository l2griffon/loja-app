import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { CartContext } from '../context/CartContext';

const CartScreen = ({ navigation }) => {
  const { cart, removeFromCart } = useContext(CartContext);

  // Calcular o total, garantindo que os valores sejam válidos
  const total = cart.reduce((sum, item) => {
    const valor = item.valor_unitario || 0;  // Garantir que o item.valor_unitario seja numérico
    return sum + valor;
  }, 0);

  // Função de renderização para cada item do carrinho
  const renderCartItem = ({ item }) => {
    const valor = item.valor_unitario || 0; // Garantir que o valor seja um número válido

    return (
      <View style={styles.cartItem} key={item.id}>  
        {item.imagem && <Image source={{ uri: item.imagem }} style={styles.image} />}
        <View style={styles.itemDetails}>
          <Text style={styles.itemText}>{item.descricao}</Text>
          <Text style={styles.itemPrice}>
            {valor > 0 ? `R$ ${valor.toFixed(2)}` : 'Preço não disponível'}
          </Text>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFromCart(item.id)}
          >
            <Text style={styles.removeButtonText}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Função para voltar à tela anterior ou para a Home se não houver como voltar
  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack(); // Se o usuário pode voltar, vai para a tela anterior
    } else {
      navigation.replace('Home'); // Senão, substitui pela tela Home
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho de Compras</Text>

      {cart.length === 0 ? (
        <Text style={styles.emptyMessage}>O carrinho está vazio.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()} // Garantir que a chave seja única
            renderItem={renderCartItem} // Função que renderiza os itens
          />

          <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>

          <TouchableOpacity
            style={[styles.checkoutButton, cart.length === 0 && styles.disabledButton]}
            onPress={() => navigation.navigate('Checkout')}
            disabled={cart.length === 0}
          >
            <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack} // Funcionalidade de voltar ou ir para a Home
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B8860B',
    marginBottom: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: 'gray',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#B8860B',
    marginVertical: 4,
  },
  removeButton: {
    backgroundColor: '#e53935',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'right',
  },
  checkoutButton: {
    backgroundColor: '#B8860B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 30,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  backButton: {
    marginTop: 30,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'underline',
  },
});

export default CartScreen;
