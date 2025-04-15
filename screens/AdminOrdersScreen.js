import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, Alert,
  TouchableOpacity, TextInput, Modal, Pressable
} from 'react-native';
import {
  getFirestore, collection, getDocs, orderBy, query
} from 'firebase/firestore';
import { firebase } from '../admin-panel/firebase';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const statusOptions = [
  'Todos',
  'Pedido Confirmado',
  'Preparando Pedido',
  'Saiu para Entrega',
  'Entregue',
  'Pedido Cancelado'
];

const AdminOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [modalVisible, setModalVisible] = useState(false);
  const db = getFirestore(firebase);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersList);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pedido Confirmado': return '#32CD32';
      case 'Preparando Pedido': return '#FFA500';
      case 'Saiu para Entrega': return '#1E90FF';
      case 'Entregue': return '#8A2BE2';
      case 'Pedido Cancelado': return '#B22222';
      default: return '#999';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'Todos' || order.status === selectedStatus;
    const matchesSearch = order.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.orderId?.toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const renderOrderItem = ({ item }) => (
    <Animatable.View animation="fadeInUp" duration={500} style={styles.orderItem}>
      <Text style={styles.orderText}>🧾 Pedido: {item.orderId}</Text>
      <Text style={styles.orderText}>👤 Cliente: {item.customerName}</Text>
      <Text style={styles.orderText}>📅 Data: {item.createdAt?.toDate().toLocaleString() || '-'}</Text>
      <Text style={styles.orderText}>💰 Total: R$ {item.total.toFixed(2)}</Text>
      <Text style={[styles.orderText, { color: getStatusColor(item.status), fontWeight: 'bold' }]}>📦 Status: {item.status}</Text>

      <TouchableOpacity style={styles.statusButton} onPress={() => navigation.navigate('PedidoDetalhes', { order: item })}>
        <Text style={styles.statusButtonText}>Ver Detalhes</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel de Pedidos</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar por nome ou ID"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {selectedStatus !== 'Todos' && (
        <Text style={styles.activeFilterText}>Filtrando por: <Text style={{ fontWeight: 'bold' }}>{selectedStatus}</Text></Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#B8860B" />
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por status</Text>
            {statusOptions.map((status, index) => (
              <Pressable
                key={index}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedStatus(status);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{status}</Text>
              </Pressable>
            ))}

            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
              <Text style={{ color: '#B8860B', fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    marginBottom: 20,
    marginTop: 30,
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
  statusButton: {
    marginTop: 10,
    backgroundColor: '#B8860B',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonText: { color: '#fff', fontWeight: 'bold' },
  listContainer: { paddingBottom: 60 },
  backButton: {
    backgroundColor: '#B8860B',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: '#B8860B',
    padding: 10,
    borderRadius: 8,
  },
  activeFilterText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333'
  },
  modalCancel: {
    paddingVertical: 12,
    alignItems: 'center'
  }
});

export default AdminOrdersScreen;
