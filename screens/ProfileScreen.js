import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebase } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import AppLayout from '../components/AppLayout'; // Altere o caminho conforme necessário

// Obter a largura e altura da tela
const { height, width } = Dimensions.get('window');

// Avatar com inicial do nome
const getInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?';
};

const ProfileAvatar = ({ name, size = 80 }) => {
  const initial = getInitial(name);
  const colors = ['#FFD700', '#F4A460', '#FFA07A', '#C0C0C0'];
  const bgColor = initial ? colors[initial.charCodeAt(0) % colors.length] : colors[0];

  return (
    <View style={[styles.avatar, {
      backgroundColor: bgColor,
      width: size,
      height: size,
      borderRadius: size / 2
    }]}>
      <Text style={[styles.avatarText, { fontSize: size / 2 }]}>{initial}</Text>
    </View>
  );
};

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth(firebase);
        const user = auth.currentUser;

        if (user) {
          const db = getFirestore(firebase);
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserData(userSnap.data());
          } else {
            console.log("Usuário não encontrado no Firestore");
          }
        } else {
          console.log("Usuário não autenticado");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#B8860B" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppLayout>
        <ScrollView contentContainerStyle={{ width: '100%' }}>
          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <ProfileAvatar name={userData?.name} />
            <Text style={styles.name}>{userData?.name}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>Telefone</Text>
            <Text style={styles.value}>{userData?.phone || '-'}</Text>

            <Text style={styles.label}>CPF</Text>
            <Text style={styles.value}>{userData?.cpf || '-'}</Text>

            <Text style={styles.label}>Endereço</Text>
            <Text style={styles.value}>{userData?.address || '-'}</Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate('OrderHistory')}
          >
            <Text style={styles.historyButtonText}>📜 Ver Meus Pedidos</Text>
          </TouchableOpacity>

          {/* Botão Voltar */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()} // Voltar à tela anterior
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>

        </ScrollView>
      </AppLayout>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#B8860B',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginTop: 30,
    alignSelf: 'center', // Centraliza o botão
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#222',
  },
  infoBox: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#FFD700',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  editButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  historyButtonText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ProfileScreen;
