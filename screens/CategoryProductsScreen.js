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
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const CategoryProductsScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const { cart, addToCart, decreaseQuantity } = useContext(CartContext);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const produtosRef = collection(db, category);
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

  const getQuantityInCart = (productId) => {
    const item = cart.find(i => i.id === productId);
    return item?.quantidade || 0;
  };

  const renderProductItem = ({ item }) => {
    const quantity = getQuantityInCart(item.id);

    return (
      <View style={styles.productItem}>
        <TouchableOpacity onPress={() => navigation.navigate('Product', { product: item })}>
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/100' }}
            style={styles.productImage}
          />
        </TouchableOpacity>

        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>{item.descricao}</Text>
          <Text style={styles.productPrice}>
            R$ {item.valor_unitario ? item.valor_unitario.toFixed(2) : '0.00'}
          </Text>
          <Text style={styles.stockText}>Estoque: {item.quantidade ?? 'N/A'}</Text>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => decreaseQuantity(item.id)}
              style={styles.controlButton}
            >
              <Text style={styles.controlButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => addToCart(item)}
              style={styles.controlButton}
            >
              <Text style={styles.controlButtonText}>＋</Text>
            </TouchableOpacity>
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
    marginVertical: 4,
  },
  stockText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  controlButton: {
    backgroundColor: '#B8860B',
    padding: 6,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  controlButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
