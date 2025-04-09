import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { CartContext } from '../context/CartContext';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const CategoryProductsScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const produtosRef = collection(db, category); // Busca os produtos na coleção da categoria
        const querySnapshot = await getDocs(produtosRef);

        if (!querySnapshot.empty) {
          const produtosList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProdutos(produtosList);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [category]);

  const renderProductItem = ({ item }) => {
    const isInCart = cart.some(cartItem => cartItem.id === item.id);

    return (
      <View style={styles.productItem}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/100' }}
          style={styles.productImage}
        />
        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>{item.descricao}</Text>

          <Text style={styles.productPrice}>
            R$ {item.valor_unitario ? item.valor_unitario.toFixed(2) : '0.00'}
          </Text>

          <View style={styles.productActions}>
            {!isInCart ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.addButtonText}>Adicionar ao Carrinho</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
              >
                <Text style={styles.removeButtonText}>Remover</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Carregando produtos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{category}</Text>

      <FlatList
        data={produtos}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartButtonText}>
            Ir para o Carrinho ({cart.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    marginBottom: 20,
    color: '#B8860B',
  },
  productItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 15,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    color: '#B8860B',
    marginVertical: 8,
  },
  addButton: {
    backgroundColor: '#B8860B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#e53935',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'underline',
    marginTop: 30,
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  cartButton: {
    backgroundColor: '#B8860B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 15,
    alignItems: 'center',
  },
  cartButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategoryProductsScreen;
