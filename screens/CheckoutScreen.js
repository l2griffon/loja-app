import React, { useContext, useState, useEffect } from 'react';
import {
  View, Text, Alert, StyleSheet, TouchableOpacity, Linking, ActivityIndicator,
  ScrollView, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { CartContext } from '../context/CartContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import app from '../firebaseConfig';
import uuid from 'react-native-uuid';

const CheckoutScreen = ({ navigation }) => {
  const { cart, clearCart } = useContext(CartContext);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentOptionsVisible, setPaymentOptionsVisible] = useState(false);

  const auth = getAuth(app);
  const firestore = getFirestore(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserData(docSnap.data());
      }
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  const applyDiscount = () => {
    const validDiscounts = { 'ESSENCIAL10': 0.1, 'FRETEGRATIS': 0.15 };
    const discount = validDiscounts[discountCode.toUpperCase()];
    if (discount) {
      setDiscountAmount(discount);
      setDiscountApplied(true);
      Alert.alert('Desconto aplicado!', `Desconto de ${discount * 100}% foi aplicado.`);
    } else {
      setDiscountApplied(false);
      Alert.alert('Código inválido!', 'O código promocional informado não é válido.');
    }
  };

  const handleCheckout = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !userData) {
        Alert.alert('Erro', 'Usuário não autenticado ou dados ausentes.');
        return;
      }

      if (!isPaymentConfirmed) {
        Alert.alert('Erro', 'Por favor, confirme a forma de pagamento.');
        return;
      }

      const total = cart.reduce((sum, item) => sum + (item.valor_unitario * item.quantidade), 0);
      const totalWithDiscount = (total - total * discountAmount).toFixed(2);
      const orderId = 'PED-' + uuid.v4().toString().split('-')[0].toUpperCase();

      const produtosTexto = cart.map((item, index) =>
        `\n${index + 1}. ${item.quantidade}x ${item.descricao} - R$ ${(item.valor_unitario * item.quantidade).toFixed(2)}`
      ).join('');

      const mensagem = `
🛍️ *Novo Pedido* - ID: ${orderId}

👤 *Nome:* ${userData.name || 'Não informado'}
📞 *Telefone:* ${userData.phone || 'Não informado'}
🏠 *Endereço:* ${userData.address || 'Não informado'}
🆔 *CPF:* ${userData.cpf || 'Não informado'}

📦 *Produtos:*${produtosTexto}

💰 *Total sem desconto:* R$ ${total.toFixed(2)}
🎁 *Cupom:* ${discountApplied ? discountCode.toUpperCase() : 'Nenhum'}
💸 *Desconto aplicado:* ${discountApplied ? `${(discountAmount * 100).toFixed(0)}%` : '0%'}
✅ *Total com desconto:* R$ ${totalWithDiscount}

💳 *Forma de pagamento:* ${paymentMethod || 'Não informado'}
`;

      const orderData = {
        orderId,
        userId: user.uid,
        customerName: userData.name,
        phone: userData.phone,
        address: userData.address,
        cpf: userData.cpf,
        paymentMethod,
        cart: cart.map(item => ({
          id: item.codigo,
          descricao: item.descricao,
          valor_unitario: item.valor_unitario,
          quantidade: item.quantidade,
          categoria: item.categoria || 'Perfumes',
        })),
        total: parseFloat(totalWithDiscount),
        status: 'em andamento',
        createdAt: serverTimestamp()
      };

      await setDoc(doc(firestore, 'orders', orderId), orderData);
      const numeroLoja = '5582988478510';
      const url = `https://wa.me/${numeroLoja}?text=${encodeURIComponent(mensagem)}`;
      await Linking.openURL(url);

      clearCart();
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', 'Algo deu errado ao processar o pedido.');
      console.error('Erro no checkout:', error);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.valor_unitario * item.quantidade), 0);
  const totalWithDiscount = (total * (1 - discountAmount)).toFixed(2);

  if (loadingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B8860B" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {userData && (
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
        )}

        <Text style={styles.productHeader}>Resumo dos Produtos:</Text>
        {cart.map((item, index) => (
          <View key={index} style={styles.productItem}>
            <Text style={styles.productText}>
              {item.quantidade}x {item.descricao} - R$ {(item.valor_unitario * item.quantidade).toFixed(2)}
            </Text>
          </View>
        ))}

        <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
        {discountApplied && (
          <Text style={styles.total}>Com Desconto: R$ {totalWithDiscount}</Text>
        )}

        <View style={styles.discountContainer}>
          <TextInput
            style={styles.input}
            placeholder="Código de desconto"
            value={discountCode}
            onChangeText={setDiscountCode}
          />
          <TouchableOpacity style={styles.applyButton} onPress={applyDiscount}>
            <Text style={styles.buttonText}>Aplicar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.paymentButton} onPress={() => setPaymentOptionsVisible(!paymentOptionsVisible)}>
          <Text style={styles.paymentButtonText}>
            {paymentMethod ? `Pagamento: ${paymentMethod}` : 'Selecione forma de pagamento'}
          </Text>
        </TouchableOpacity>

        {paymentOptionsVisible && (
          <View style={styles.paymentOptions}>
            {['PIX', 'DINHEIRO', 'CARTÃO CRÉDITO', 'CARTÃO DÉBITO'].map((method) => (
              <TouchableOpacity key={method} onPress={() => {
                setPaymentMethod(method);
                setIsPaymentConfirmed(true);
                setPaymentOptionsVisible(false);
              }}>
                <Text style={styles.paymentOption}>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, !isPaymentConfirmed && styles.buttonDisabled]}
          onPress={handleCheckout}
          disabled={!isPaymentConfirmed}
        >
          <Text style={styles.buttonText}>Enviar Pedido via WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  scrollViewContent: { flexGrow: 1, justifyContent: 'center' },
  userInfo: { marginBottom: 20 },
  infoLabel: { fontWeight: 'bold', marginVertical: 5 },
  infoText: { marginBottom: 10 },
  productHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  productItem: { marginBottom: 5 },
  productText: { fontSize: 16 },
  total: { fontSize: 16, marginVertical: 10 },
  discountContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, flex: 1 },
  applyButton: { backgroundColor: '#B8860B', padding: 10, marginLeft: 10 },
  paymentButton: { marginVertical: 10, padding: 10, backgroundColor: '#B8860B' },
  paymentButtonText: { color: '#fff', textAlign: 'center' },
  paymentOptions: { marginVertical: 10 },
  paymentOption: { padding: 10, fontSize: 16 },
  discountText: { color: 'green', fontSize: 16 },
  button: { backgroundColor: '#B8860B', padding: 15, marginTop: 20 },
  buttonDisabled: { backgroundColor: '#D3D3D3' },
  buttonBack: { backgroundColor: '#B8860B', padding: 15, marginTop: 10, alignItems: 'center' },
  buttonText: { color: '#fff', textAlign: 'center' },
});

export default CheckoutScreen;
