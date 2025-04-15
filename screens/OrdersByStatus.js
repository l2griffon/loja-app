import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity
} from 'react-native';
import {
  getFirestore, collection, query, where, getDocs, orderBy
} from 'firebase/firestore';
import { firebase } from '../admin-panel/firebase';

const OrdersByStatus = ({ route, navigation }) => {
  const { status } = route.params;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const db = getFirestore(firebase);
        const q = query(
          collection(db, 'orders'),
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(list);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        Alert.alert('Erro', 'Não foi possível carregar os pedidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status]);

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>🧾 Pedido: {item.orderId}</Text>
      <Text style={styles.orderText}>👤 Cliente: {item.customerName}</Text>
      <Text style={styles.orderText}>📅 Data: {item.createdAt?.toDate().toLocaleString() || '-'}</Text>
      <Text style={styles.orderText}>💰 Total: R$ {item.total.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos: {status}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#B8860B" />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 40,
    color: '#222',
  },
  orderItem: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  orderText: { fontSize: 15, marginBottom: 5, color: '#333' },
  listContainer: { paddingBottom: 60 },
  backButton: {
    backgroundColor: '#B8860B',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default OrdersByStatus;
