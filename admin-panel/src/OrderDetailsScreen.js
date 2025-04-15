import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../firebaseConfig';

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params; // Recebe o ID do pedido
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderRef = doc(firestore, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          setOrder(orderSnap.data());
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do pedido:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B8860B" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pedido não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalhes do Pedido</Text>

      <Text style={styles.orderHeader}>Pedido: {order.id.slice(0, 8)}...</Text>
      <Text>Status: {order.status}</Text>
      <Text>Total: R$ {order.total.toFixed(2)}</Text>
      <Text>Pagamento: {order.paymentMethod}</Text>
      <Text>Data do Pedido: {order.createdAt?.toDate().toLocaleString() || 'Data não disponível'}</Text>

      <Text style={styles.productHeader}>Produtos:</Text>
      {order.products?.map((prod, index) => (
        <View key={index} style={styles.productItem}>
          <Text style={styles.productText}>{prod.descricao}</Text>
          <Text>Preço: R$ {prod.valor_unitario?.toFixed(2)}</Text>
          <Text>Quantidade: {prod.quantidade}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
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
    textAlign: 'center',
  },
  orderHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  productHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#333',
  },
  productItem: {
    marginVertical: 8,
  },
  productText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  backButton: {
    backgroundColor: '#B8860B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderDetailsScreen;
