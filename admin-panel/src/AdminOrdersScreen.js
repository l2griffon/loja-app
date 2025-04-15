import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../firebaseConfig';

const AdminOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        let q = query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));

        if (statusFilter) {
          q = query(q, where('status', '==', statusFilter));
        }

        if (dateFilter) {
          q = query(q, where('createdAt', '>=', new Date(dateFilter)));
        }

        const snapshot = await getDocs(q);
        const ordersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersList);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter, dateFilter]);

  const handleMarkAsCompleted = async (orderId) => {
    try {
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'Concluído', // Atualiza o status do pedido para 'Concluído'
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: 'Concluído' } : order
        )
      );
    } catch (error) {
      console.error('Erro ao marcar pedido como concluído:', error);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderHeader}>Pedido: {item.id.slice(0, 8)}...</Text>
      <Text>Status: {item.status}</Text>
      <Text>Total: R$ {item.total.toFixed(2)}</Text>
      <Text>Forma de pagamento: {item.paymentMethod}</Text>
      <Text style={styles.date}>
        {item.createdAt?.toDate().toLocaleString() || 'Data não disponível'}
      </Text>

      {item.status !== 'Concluído' && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => handleMarkAsCompleted(item.id)} // Marca como concluído
        >
          <Text style={styles.completeButtonText}>Marcar como Concluído</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
      >
        <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B8860B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Pedidos</Text>

      <TextInput
        style={styles.filterInput}
        placeholder="Filtrar por status (ex: 'Pendente')"
        value={statusFilter}
        onChangeText={setStatusFilter}
      />
      <TextInput
        style={styles.filterInput}
        placeholder="Filtrar por data (ex: '2023-06-15')"
        value={dateFilter}
        onChangeText={setDateFilter}
      />

      {orders.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum pedido encontrado.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B8860B',
    marginBottom: 20,
  },
  orderItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    borderRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsButton: {
    backgroundColor: '#B8860B',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default AdminOrdersScreen;
