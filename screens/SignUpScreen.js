import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebase } from '../admin-panel/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const cpfRef = useRef();
  const addressRef = useRef();
  const phoneRef = useRef();

  const validateFields = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!email.trim()) newErrors.email = 'Email é obrigatório';
    if (!password.trim()) newErrors.password = 'Senha é obrigatória';
    if (!cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    if (!address.trim()) newErrors.address = 'Endereço é obrigatório';
    if (!phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    const auth = getAuth(firebase);
    const db = getFirestore(firebase);

    if (!validateFields()) return;

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        Alert.alert('Erro de Cadastro', 'Este email já está registrado. Tente outro.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        cpf,
        address,
        phone,
      });

      await AsyncStorage.setItem('isLoggedIn', 'true');

      Alert.alert('Cadastro realizado', 'Sua conta foi criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.replace('Home') },
      ]);
    } catch (error) {
      Alert.alert('Erro de Cadastro', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Image source={require('../imagem/logo.png')} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Criar Conta</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current.focus()}
        />
      </View>
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          ref={emailRef}
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current.focus()}
        />
      </View>
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          ref={passwordRef}
          style={[styles.input, { flex: 1 }]}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          returnKeyType="next"
          onSubmitEditing={() => cpfRef.current.getElement().focus()}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#888"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="card-outline" size={20} color="#888" style={styles.icon} />
        <TextInputMask
          ref={cpfRef}
          type={'cpf'}
          value={cpf}
          onChangeText={setCpf}
          style={styles.input}
          placeholder="CPF"
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => addressRef.current.focus()}
        />
      </View>
      {errors.cpf && <Text style={styles.error}>{errors.cpf}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          ref={addressRef}
          style={styles.input}
          placeholder="Endereço"
          value={address}
          onChangeText={setAddress}
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current.getElement().focus()}
        />
      </View>
      {errors.address && <Text style={styles.error}>{errors.address}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#888" style={styles.icon} />
        <TextInputMask
          ref={phoneRef}
          type={'cel-phone'}
          options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
          style={styles.input}
          placeholder="Telefone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          returnKeyType="done"
        />
      </View>
      {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>
          Já tem uma conta? <Text style={styles.link}>Faça login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 75,
    shadowColor: '#d4af37',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
    marginBottom: 20,
    shadowColor: '#d4af37',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: '#fff',
    shadowColor: '#d4af37',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#d4af37',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
  link: {
    color: '#d4af37',
    fontWeight: 'bold',
  },
  error: {
    color: '#b00020',
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 12,
  },
});
