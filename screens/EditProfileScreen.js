import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firebase } from '../firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Obter altura da tela
const { height } = Dimensions.get('window');

const isNomeCompleto = (nome) => {
  const partes = nome.trim().split(' ');
  return partes.length >= 2;
};

const isCPFValido = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
};

const EditProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth(firebase);
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore(firebase);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          setName(data.name || '');
          setPhone(data.phone || '');
          setCpf(data.cpf || '');
          setAddress(data.address || '');
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    if (!name.trim()) return Alert.alert('Erro', 'Por favor, insira seu nome.');
    if (!isNomeCompleto(name)) return Alert.alert('Erro', 'Digite seu nome completo.');
    if (!phone.trim() || phone.length < 8) return Alert.alert('Erro', 'Telefone inválido.');
    if (!cpf.trim() || !isCPFValido(cpf)) return Alert.alert('Erro', 'CPF inválido.');
    if (!address.trim()) return Alert.alert('Erro', 'Informe seu endereço.');

    setUpdating(true);
    const auth = getAuth(firebase);
    const db = getFirestore(firebase);
    const user = auth.currentUser;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { name, phone, cpf, address });
      Alert.alert('Sucesso', 'Seus dados foram atualizados.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar seus dados.');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const renderInput = (label, value, onChangeText, icon, multiline = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, multiline && { height: 80 }]}>
        <Icon name={icon} size={22} color="#B8860B" style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.input, multiline && { height: '100%' }]}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#B8860B" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.container, { minHeight: height }]}>
        <Text style={styles.title}>Editar Perfil</Text>

        {renderInput('Nome completo', name, setName, 'person')}
        {renderInput('Telefone', phone, setPhone, 'phone')}
        {renderInput('CPF', cpf, setCpf, 'assignment-ind')}
        {renderInput('Endereço', address, setAddress, 'location-on', true)}

        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={updating}>
          <Text style={styles.buttonText}>{updating ? 'Salvando...' : 'Salvar Alterações'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'flex-start', // Ajusta para evitar que o conteúdo fique muito para cima
    paddingTop: 30, // Adiciona um pequeno espaçamento no topo
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#B8860B',
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
