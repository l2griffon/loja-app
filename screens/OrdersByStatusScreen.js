// OrdersByStatusScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { firebase } from '../admin-panel/firebase'; // Certifique-se de importar o Firebase corretamente

const OrdersByStatusScreen = ({ route }) => {
  const { status } = route.params; // Obtém o status passado pela navegação
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersByStatus = async () => {
      const db = getFirestore(firebase);
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('status', '==', status));

      try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          console.log('Nenhum pedido encontrado');
          setOrders([]); // Caso não haja pedidos, exibe lista vazia
        } else {
          const ordersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersList);
        }
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        Alert.alert('Erro', 'Não foi possível carregar os pedidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersByStatus();
  }, [status]);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Cliente: {item.customerName}</Text>
      <Text style={styles.orderText}>Data: {item.data.toDate().toLocaleDateString()}</Text>
      <Text style={styles.orderText}>Total: R$ {item.totalAmount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos - Status: {status}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#B8860B" />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  orderItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2,
  },
  orderText: {
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default OrdersByStatusScreen;
