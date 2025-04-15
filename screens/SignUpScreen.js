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
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard 
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  // Add a state for tracking focused fields
  const [focusedField, setFocusedField] = useState(null);

  const emailRef = useRef();
  const passwordRef = useRef();
  const cpfRef = useRef();
  const addressRef = useRef();
  const phoneRef = useRef();

  const validateFields = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (name.split(' ').length < 2) {
      newErrors.name = 'Digite seu nome completo';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha fraca (mín. 6 caracteres)';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    const cpfNumeros = cpf.replace(/[^\d]+/g, '');
    if (!cpfNumeros) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (cpfNumeros.length !== 11) {
      newErrors.cpf = 'CPF inválido';
    }

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
        cpf: cpf.replace(/[^\d]+/g, ''),
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
          <Image source={require('../imagem/logo.png')} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>Criar Conta</Text>

          {/* Campos de entrada */}
          <TextInput
            style={[styles.input, focusedField === 'name' && { borderColor: '#FFD700', borderWidth: 2 }]}
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <TextInput
            style={[styles.input, focusedField === 'email' && { borderColor: '#FFD700', borderWidth: 2 }]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <TextInput
            style={[styles.input, focusedField === 'password' && { borderColor: '#FFD700', borderWidth: 2 }]}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          <TextInput
            style={[styles.input, focusedField === 'confirmPassword' && { borderColor: '#FFD700', borderWidth: 2 }]}
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => setFocusedField(null)}
          />
          {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

          <TextInputMask
            style={[styles.input, focusedField === 'cpf' && { borderColor: '#FFD700', borderWidth: 2 }]}
            type={'cpf'}
            value={cpf}
            onChangeText={setCpf}
            placeholder="CPF"
            keyboardType="numeric"
            onFocus={() => setFocusedField('cpf')}
            onBlur={() => setFocusedField(null)}
          />
          {errors.cpf && <Text style={styles.error}>{errors.cpf}</Text>}

          <TextInput
            style={[styles.input, focusedField === 'address' && { borderColor: '#FFD700', borderWidth: 2 }]}
            placeholder="Endereço"
            value={address}
            onChangeText={setAddress}
            onFocus={() => setFocusedField('address')}
            onBlur={() => setFocusedField(null)}
          />
          {errors.address && <Text style={styles.error}>{errors.address}</Text>}

          <TextInputMask
            style={[styles.input, focusedField === 'phone' && { borderColor: '#FFD700', borderWidth: 2 }]}
            type={'cel-phone'}
            options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
            value={phone}
            onChangeText={setPhone}
            placeholder="Telefone"
            keyboardType="phone-pad"
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
          />
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 24,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 75,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#d4af37',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: '#b00020',
    marginBottom: 10,
    fontSize: 12,
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
});
