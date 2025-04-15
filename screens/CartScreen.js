import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { CartContext } from '../context/CartContext';

const { height } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const { cart, increaseQuantity, decreaseQuantity } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + (item.valor_unitario * (item.quantidade || 1)), 0);

  const renderCartItem = ({ item }) => {
    const valor = item.valor_unitario || 0;
    const quantidade = item.quantidade || 1;

    return (
      <View style={styles.cartItem}>
        {item.imagem && <Image source={{ uri: item.imagem }} style={styles.image} />}
        <View style={styles.itemDetails}>
          <Text style={styles.itemText}>{item.descricao}</Text>
          <Text style={styles.itemPrice}>R$ {valor.toFixed(2)}</Text>
          <Text style={styles.itemQuantity}>Quantidade: {quantidade}</Text>
          <Text style={styles.itemSubtotal}>Subtotal: R$ {(valor * quantidade).toFixed(2)}</Text>

          <View style={styles.quantityButtons}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => decreaseQuantity(item.id)}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quantityButton} onPress={() => increaseQuantity(item)}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho de Compras</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={require('../imagem/carrinho-vazio.png')} style={styles.emptyImage} />
          <Text style={styles.emptyMessage}>O carrinho está vazio.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.backButtonText}>Voltar para a Loja</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
          ListFooterComponent={
            <>
              <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
              <TouchableOpacity
                style={[styles.checkoutButton, cart.length === 0 && styles.disabledButton]}
                onPress={() => navigation.navigate('Checkout')}
                disabled={cart.length === 0}
              >
                <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
              >
                <Text style={styles.backButtonText}>← Voltar</Text>
              </TouchableOpacity>
            </>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', minHeight: height },
  title: { fontSize: 24, fontWeight: 'bold', color: '#B8860B', marginBottom: 20, textAlign: 'center', marginTop: 40 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyImage: { width: 150, height: 150, marginBottom: 20 },
  emptyMessage: { fontSize: 16, color: '#888', marginBottom: 20 },
  backButton: {
    backgroundColor: '#B8860B', paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: 30, marginTop: 15, alignItems: 'center', width: '80%', alignSelf: 'center',
  },
  backButtonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  cartItem: { flexDirection: 'row', backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10, marginBottom: 15, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  itemDetails: { flex: 1, justifyContent: 'center' },
  itemText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemPrice: { fontSize: 14, color: '#B8860B' },
  itemQuantity: { fontSize: 14, color: '#555' },
  itemSubtotal: { fontSize: 14, color: '#444', fontWeight: 'bold', marginVertical: 4 },
  quantityButtons: { flexDirection: 'row', marginTop: 10 },
  quantityButton: {
    backgroundColor: '#B8860B', padding: 6, borderRadius: 5,
    width: 30, height: 30, alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20, textAlign: 'right' },
  checkoutButton: { backgroundColor: '#B8860B', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, marginTop: 30, alignItems: 'center' },
  checkoutButtonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#ccc' },
});

export default CartScreen;
