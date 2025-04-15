import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Animated
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { firebase } from '../firebase';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';

const statusColors = {
  'Pedido Confirmado': '#2196F3',
  'Preparando Pedido': '#FFA500',
  'Saiu para Entrega': '#9C27B0',
  'Entregue': '#4CAF50',
  'Pedido Cancelado': '#F44336'
};

const statusIcons = {
  'Pedido Confirmado': <FontAwesome5 name="check-circle" size={18} color={statusColors['Pedido Confirmado']} />,
  'Preparando Pedido': <MaterialIcons name="kitchen" size={18} color={statusColors['Preparando Pedido']} />,
  'Saiu para Entrega': <Entypo name="location" size={18} color={statusColors['Saiu para Entrega']} />,
  'Entregue': <FontAwesome5 name="box-open" size={18} color={statusColors['Entregue']} />,
  'Pedido Cancelado': <FontAwesome5 name="ban" size={18} color={statusColors['Pedido Cancelado']} />
};

const OrderHistory = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('Todos');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const auth = getAuth(firebase);
        const user = auth.currentUser;
        const db = getFirestore(firebase);

        if (user) {
          const q = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid)
          );

          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const sortedData = data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
          setOrders(sortedData);
          setFilteredOrders(sortedData);
        }
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    if (status === 'Todos') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.status === status);
      setFilteredOrders(filtered);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return `${date.toLocaleDateString()} às ${date.toLocaleTimeString()}`;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#B8860B" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📦 Meus Pedidos</Text>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por Status:</Text>
        <Picker
          selectedValue={selectedStatus}
          onValueChange={(itemValue) => handleStatusFilter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Todos" value="Todos" />
          {Object.keys(statusColors).map((status, idx) => (
            <Picker.Item key={idx} label={status} value={status} />
          ))}
        </Picker>
      </View>

      {filteredOrders.length === 0 ? (
        <Text style={styles.noOrders}>Você ainda não realizou nenhum pedido com esse status.</Text>
      ) : (
        filteredOrders.map((order, index) => (
          <View key={order.id || index} style={[styles.orderCard, { borderLeftColor: statusColors[order.status] || '#888' }]}>
            <Text style={styles.orderId}>🆔 {order.orderId}</Text>

            <View style={styles.statusRow}>
              {statusIcons[order.status] || null}
              <Text style={[styles.statusText, { color: statusColors[order.status] }]}>{order.status}</Text>
            </View>

            <Text style={styles.value}>Total: R$ {order.total.toFixed(2)}</Text>
            <Text style={styles.value}>Data: {formatDate(order.createdAt)}</Text>

            <Text style={styles.label}>Produtos:</Text>
            {order.cart.map((item, idx) => (
              <Text key={idx} style={styles.productItem}>• {item.descricao} - R$ {parseFloat(item.valor_unitario).toFixed(2)}</Text>
            ))}

            {order.status === 'Pedido Cancelado' && order.cancelReason && (
              <Text style={[styles.cancelReason]}>Motivo do cancelamento: {order.cancelReason}</Text>
            )}
          </View>
        ))
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
    marginTop: 40,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#f5f5f5',
  },
  noOrders: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  orderCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    borderLeftWidth: 5,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#B8860B',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#444',
  },
  value: {
    fontSize: 15,
    color: '#000',
  },
  productItem: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    marginTop: 2,
  },
  backButton: {
    backgroundColor: '#B8860B',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelReason: {
    color: '#F44336',
    fontSize: 13,
    marginTop: 10,
  },
});

export default OrderHistory;
