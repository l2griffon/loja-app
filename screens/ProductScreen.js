import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { CartContext } from '../context/CartContext';

const ProductScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { cart, addToCart, decreaseQuantity } = useContext(CartContext);

  const cartItem = cart.find(item => item.id === product.id);
  const quantidadeNoCarrinho = cartItem?.quantidade || 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <Text style={styles.title}>{product.descricao}</Text>

      {product.descricao && (
        <Text style={styles.description}>{product.descricao}</Text>
      )}

      <Text style={styles.price}>R$ {parseFloat(product.valor_unitario).toFixed(2)}</Text>
      <Text style={styles.stock}>Estoque: {product.quantidade ?? 'N/A'}</Text>

      <Text style={styles.section}>Quantidade no carrinho:</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={() => decreaseQuantity(product.id)}>
          <Text style={styles.quantityText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantityNumber}>{quantidadeNoCarrinho}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={() => addToCart(product)}>
          <Text style={styles.quantityText}>＋</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  price: {
    fontSize: 20,
    color: '#B8860B',
    marginBottom: 5,
  },
  stock: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  quantityButton: {
    backgroundColor: '#B8860B',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 15,
  },
  quantityText: {
    fontSize: 18,
    color: '#fff',
  },
  quantityNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  backButton: {
    marginTop: 10,
    backgroundColor: '#B8860B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProductScreen;
