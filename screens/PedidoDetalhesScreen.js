import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import {
  getFirestore, doc, updateDoc, getDocs, collection, query, where
} from 'firebase/firestore';
import { firebase } from '../admin-panel/firebase';

const PedidoDetalhesScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [status, setStatus] = useState(order.status);
  const [cancelReason, setCancelReason] = useState(order.cancelReason || '');
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);
  const db = getFirestore(firebase);

  const atualizarEstoque = async () => {
    try {
      for (const item of order.cart) {
        const codigo = item.id;
        const produtosRef = collection(db, 'Perfumes');
        const q = query(produtosRef, where('codigo', '==', codigo));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const produtoDoc = querySnapshot.docs[0];
          const produtoRef = doc(db, 'Perfumes', produtoDoc.id);
          const produtoData = produtoDoc.data();
          const novaQuantidade = (produtoData.quantidade || 0) - item.quantidade;
          await updateDoc(produtoRef, {
            quantidade: novaQuantidade < 0 ? 0 : novaQuantidade
          });
        } else {
          console.warn(`Produto com código ${codigo} não encontrado.`);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      Alert.alert('Erro', 'Erro ao atualizar o estoque dos produtos.');
    }
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      const pedidoRef = doc(db, 'orders', order.id);
      await updateDoc(pedidoRef, { status: newStatus });
      setStatus(newStatus);
      Alert.alert('Sucesso', `Status atualizado para: ${newStatus}`);

      if (newStatus === 'Pedido Confirmado' && status !== 'Pedido Confirmado') {
        await atualizarEstoque();
      }

      if (newStatus === 'Pedido Cancelado') {
        setShowCancelInput(true);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status do pedido.');
    }
  };

  const handleSubmitCancelReason = async () => {
    try {
      setIsSubmittingCancel(true);
      const pedidoRef = doc(db, 'orders', order.id);
      await updateDoc(pedidoRef, { cancelReason });
      Alert.alert('Motivo salvo', 'O motivo do cancelamento foi registrado.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o motivo do cancelamento.');
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  const statusOptions = [
    'Pedido Confirmado',
    'Preparando Pedido',
    'Saiu para Entrega',
    'Entregue'
  ];

  const isDisabled = (option) => {
    if (status === 'Pedido Cancelado') return true;
    const index = statusOptions.indexOf(option);
    const currentIndex = statusOptions.indexOf(status);
    return index <= currentIndex;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🧾 Detalhes do Pedido</Text>

        <Text style={styles.label}>Cliente:</Text>
        <Text style={styles.value}>{order.customerName}</Text>

        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.value}>{order.phone}</Text>

        <Text style={styles.label}>CPF:</Text>
        <Text style={styles.value}>{order.cpf}</Text>

        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.value}>{order.address}</Text>

        <Text style={styles.label}>Forma de Pagamento:</Text>
        <Text style={styles.value}>{order.paymentMethod}</Text>

        <Text style={styles.label}>Total:</Text>
        <Text style={styles.value}>R$ {order.total.toFixed(2)}</Text>

        <Text style={styles.label}>Status Atual:</Text>
        <Text style={[styles.value, { fontWeight: 'bold' }]}>{status}</Text>

        {order.cancelReason && (
          <>
            <Text style={styles.label}>Motivo do Cancelamento:</Text>
            <Text style={styles.value}>{order.cancelReason}</Text>
          </>
        )}

        <Text style={styles.label}>Produtos:</Text>
        {order.cart.map((item, index) => (
          <Text key={index} style={styles.productItem}>
            • {item.quantidade}x {item.descricao} - R$ {(item.valor_unitario * item.quantidade).toFixed(2)}
          </Text>
        ))}

        <Text style={styles.label}>Atualizar Status:</Text>
        {statusOptions.map((s, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.statusButton, isDisabled(s) && { backgroundColor: '#ccc' }]}
            onPress={() => handleChangeStatus(s)}
            disabled={isDisabled(s)}
          >
            <Text style={styles.statusButtonText}>{s}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.statusButton, status === 'Pedido Cancelado' && { backgroundColor: '#ccc' }]}
          onPress={() => handleChangeStatus('Pedido Cancelado')}
          disabled={status === 'Pedido Cancelado'}
        >
          <Text style={styles.statusButtonText}>Cancelar Pedido</Text>
        </TouchableOpacity>

        {showCancelInput && status === 'Pedido Cancelado' && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Motivo do Cancelamento:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o motivo do cancelamento"
              value={cancelReason}
              onChangeText={setCancelReason}
              multiline
            />
            <TouchableOpacity style={styles.statusButton} onPress={handleSubmitCancelReason} disabled={isSubmittingCancel}>
              <Text style={styles.statusButtonText}>Salvar Motivo</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 20,
    color: '#222',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  productItem: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
    marginTop: 2,
  },
  statusButton: {
    backgroundColor: '#B8860B',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    minHeight: 80
  },
  backButton: {
    backgroundColor: '#B8860B',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PedidoDetalhesScreen;