import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebase } from '../firebase';

const AdminPanelScreen = ({ navigation }) => {
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(firebase);
      const ordersRef = collection(db, 'orders');
      const productsRef = collection(db, 'products');

      try {
        const ordersSnapshot = await getDocs(ordersRef);
        setOrdersCount(ordersSnapshot.size);

        const productsSnapshot = await getDocs(productsRef);
        setProductsCount(productsSnapshot.size);
      } catch (error) {
        console.error('Erro ao carregar dados do painel:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painel Administrativo</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pedidos</Text>
        <Text style={styles.cardText}>Total de pedidos: {ordersCount}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AdminOrders')}
        >
          <Text style={styles.buttonText}>Ver Todos os Pedidos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Produtos</Text>
        <Text style={styles.cardText}>Total de produtos: {productsCount}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ProductManagement')}
        >
          <Text style={styles.buttonText}>Gerenciar Produtos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Importação de Produtos</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ProductImporter')}
        >
          <Text style={styles.buttonText}>Importar Produtos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Filtrar Pedidos por Status</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('OrdersByStatus', { status: 'Pedido Confirmado' })}
        >
          <Text style={styles.buttonText}>Pedido Confirmado</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('OrdersByStatus', { status: 'Preparando Pedido' })}
        >
          <Text style={styles.buttonText}>Preparando Pedido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('OrdersByStatus', { status: 'Saiu para Entrega' })}
        >
          <Text style={styles.buttonText}>Saiu para Entrega</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('OrdersByStatus', { status: 'Entregue' })}
        >
          <Text style={styles.buttonText}>Pedidos Entregues</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#555', marginTop: 30 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#B8860B',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AdminPanelScreen;
