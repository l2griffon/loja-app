import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { firebase } from '../admin-panel/firebase';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const auth = getAuth(firebase);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login realizado', 'Você se conectou com sucesso!');
      navigation.replace('Home');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Erro de login', 'Este email não está cadastrado.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Erro de login', 'Senha incorreta.');
      } else {
        Alert.alert('Erro de login', error.message);
      }
    }
  };

  const handlePasswordReset = async () => {
    const auth = getAuth(firebase);
    if (!email) {
      Alert.alert('Recuperação de senha', 'Informe o email para recuperação.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Email enviado',
        'Verifique sua caixa de entrada para redefinir sua senha.'
      );
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Erro', 'Este email não está cadastrado.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Erro', 'Formato de email inválido.');
      } else {
        Alert.alert('Erro', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../imagem/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Seja Bem-vindo!</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity onPress={handlePasswordReset}>
        <Text style={styles.forgotText}>Esqueceu a senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signupText}>
          Não tem uma conta? <Text style={styles.link}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
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
    marginBottom: 16,
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
  forgotText: {
    alignSelf: 'flex-start',
    color: '#d4af37',
    fontWeight: '600',
    marginBottom: 20,
    marginTop: -10,
    marginLeft: 4,
  },
  loginButton: {
    backgroundColor: '#d4af37',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },
  link: {
    color: '#d4af37',
    fontWeight: 'bold',
  },
});
