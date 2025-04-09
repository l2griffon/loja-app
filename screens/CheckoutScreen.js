import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, ScrollView } from 'react-native';
import { CartContext } from '../context/CartContext';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../firebaseConfig';

const CheckoutScreen = ({ navigation }) => {
  const { cart, clearCart } = useContext(CartContext);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(''); // Guardar o método de pagamento
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false); // Confirmar se o pagamento foi escolhido
  const [isPaymentMinimized, setIsPaymentMinimized] = useState(false); // Para minimizar a seção de pagamento

  const auth = getAuth(app);
  const firestore = getFirestore(app);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
      setLoadingUser(false);
    };

    fetchUserData();
  }, []);

  // Verificar se o carrinho está vazio e, caso esteja, garantir que o método de pagamento seja desmarcado
  useEffect(() => {
    if (cart.length === 0) {
      setPaymentMethod(''); // Reseta o método de pagamento caso o carrinho esteja vazio
      setIsPaymentConfirmed(false); // Desabilita a confirmação de pagamento
    }
  }, [cart]);

  const handleCheckout = async () => {
    if (!userData) {
      Alert.alert('Erro', 'Informações do usuário não encontradas.');
      return;
    }

    if (!isPaymentConfirmed) {
      Alert.alert('Erro', 'Por favor, confirme a forma de pagamento.');
      return;
    }

    const total = cart.reduce((sum, item) => sum + (parseFloat(item.valor_unitario) || 0), 0); // Garantir que item.valor_unitario seja convertido para número
    const produtosTexto = cart.map((item, index) => {
      const valorItem = parseFloat(item.valor_unitario) || 0; // Garantir que o valor seja um número válido
      return `\n${index + 1}. ${item.descricao} - R$ ${valorItem.toFixed(2)}`;
    }).join('');

    const mensagem = 
`Novo pedido:
👤 Nome: ${userData.name || 'Não informado'}
📞 Telefone: ${userData.phone || 'Não informado'}
🏠 Endereço: ${userData.address || 'Não informado'}
🆔 CPF: ${userData.cpf || 'Não informado'}

🛒 Produtos:${produtosTexto}

💰 Total: R$ ${total.toFixed(2)}

💳 Forma de pagamento: ${paymentMethod}
`;

    const numeroLoja = '5582988478510';
    const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(mensagem)}`;

    try {
      await Linking.openURL(url);
      clearCart();
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
    }
  };

  const renderPaymentOption = (method) => {
    return (
      <TouchableOpacity
        key={method}
        style={[styles.paymentButton, paymentMethod === method && styles.paymentButtonSelected]}
        onPress={() => {
          setPaymentMethod(method);
          setIsPaymentConfirmed(true); // Confirma a escolha do método de pagamento
        }}
      >
        <Text style={styles.paymentButtonText}>{method}</Text>
      </TouchableOpacity>
    );
  };

  const handleChangePaymentMethod = () => {
    setIsPaymentConfirmed(false); // Permite que o usuário selecione um novo método de pagamento
    setIsPaymentMinimized(false); // Exibe novamente as opções de pagamento
  };

  const handleMinimizePayment = () => {
    setIsPaymentMinimized(true); // Minimiza a seção de pagamento
  };

  const handleReopenPayment = () => {
    setIsPaymentMinimized(false); // Restaura a visibilidade das opções de pagamento
  };

  if (loadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B8860B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finalizar Compra</Text>

      {userData ? (
        <View style={styles.userInfo}>
          <Text style={styles.infoLabel}>👤 Nome:</Text>
          <Text style={styles.infoText}>{userData.name}</Text>

          <Text style={styles.infoLabel}>📞 Telefone:</Text>
          <Text style={styles.infoText}>{userData.phone}</Text>

          <Text style={styles.infoLabel}>🏠 Endereço:</Text>
          <Text style={styles.infoText}>{userData.address}</Text>

          <Text style={styles.infoLabel}>🆔 CPF:</Text>
          <Text style={styles.infoText}>{userData.cpf}</Text>
        </View>
      ) : (
        <Text style={styles.warning}>Informações do usuário não encontradas.</Text>
      )}

      <ScrollView style={styles.productList}>
        <Text style={styles.productHeader}>Resumo dos Produtos:</Text>
        {cart.length > 0 ? (
          cart.map((item, index) => {
            const valorItem = parseFloat(item.valor_unitario) || 0; // Garantir que o valor seja um número válido
            return (
              <View key={index} style={styles.productItem}>
                <Text style={styles.productText}>
                  {item.descricao} - R$ {valorItem.toFixed(2)} 
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.warning}>O carrinho está vazio.</Text>
        )}
      </ScrollView>

      <Text style={styles.total}>
        Total: R$ {cart.reduce((sum, item) => sum + (parseFloat(item.valor_unitario) || 0), 0).toFixed(2)} {/* Exibir total com 2 casas decimais */}
      </Text>

      {isPaymentConfirmed && !isPaymentMinimized && (
        <View style={styles.confirmedPaymentContainer}>
          <Text style={styles.confirmedPaymentText}>
            Forma de pagamento confirmada: {paymentMethod}
          </Text>
        </View>
      )}

      {!isPaymentConfirmed && !isPaymentMinimized && (
        <>
          <Text style={styles.paymentHeader}>Selecione a forma de pagamento:</Text>
          <View style={styles.paymentOptions}>
            {['PIX', 'DINHEIRO', 'CARTÃO CRÉDITO', 'CARTÃO DÉBITO'].map(renderPaymentOption)}
          </View>
        </>
      )}

      {isPaymentConfirmed && !isPaymentMinimized && (
        <TouchableOpacity
          style={styles.minimizeButton}
          onPress={handleMinimizePayment} // Minimiza a seção de pagamento
        >
          <Text style={styles.minimizeButtonText}>Minimizar Opções de Pagamento</Text>
        </TouchableOpacity>
      )}

      {isPaymentMinimized && (
        <TouchableOpacity
          style={styles.reopenButton}
          onPress={handleReopenPayment} // Restaura a visibilidade das opções de pagamento
        >
          <Text style={styles.reopenButtonText}>Abrir Opções de Pagamento</Text>
        </TouchableOpacity>
      )}

      {isPaymentConfirmed && !isPaymentMinimized && (
        <TouchableOpacity
          style={styles.changePaymentButton}
          onPress={handleChangePaymentMethod}
        >
          <Text style={styles.changePaymentButtonText}>Alterar Forma de Pagamento</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, !isPaymentConfirmed && styles.buttonDisabled]}
        onPress={handleCheckout}
        disabled={!isPaymentConfirmed} // Desabilitar o botão se o pagamento não for confirmado
      >
        <Text style={styles.buttonText}>Enviar Pedido via WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B8860B',
    marginBottom: 20,
    textAlign: 'center',
  },
  userInfo: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#555',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  productList: {
    marginBottom: 20,
  },
  productHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productItem: {
    paddingVertical: 8,
  },
  productText: {
    fontSize: 16,
    color: '#333',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B8860B',
    marginBottom: 20,
  },
  paymentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  paymentOptions: {
    marginBottom: 20,
  },
  paymentButton: {
    padding: 15,
    backgroundColor: '#B8860B',
    marginVertical: 5,
    borderRadius: 5,
  },
  paymentButtonSelected: {
    backgroundColor: '#8B4513', // Cor alterada para a opção selecionada
  },
  paymentButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  minimizeButton: {
    padding: 10,
    backgroundColor: '#8B4513',
    borderRadius: 5,
    marginTop: 10,
  },
  minimizeButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  reopenButton: {
    padding: 10,
    backgroundColor: '#8B4513',
    borderRadius: 5,
    marginTop: 10,
  },
  reopenButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  changePaymentButton: {
    padding: 10,
    backgroundColor: '#B8860B',
    borderRadius: 5,
    marginTop: 10,
  },
  changePaymentButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  confirmedPaymentContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  confirmedPaymentText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    padding: 15,
    backgroundColor: '#B8860B',
    marginTop: 20,
    borderRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: '#d3d3d3',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  warning: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default CheckoutScreen;
