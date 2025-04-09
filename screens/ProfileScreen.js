import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebase } from '../admin-panel/firebase';
import Animated, { FadeInDown } from 'react-native-reanimated';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientCode, setClientCode] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth(firebase);
      const user = auth.currentUser;

      if (user) {
        const uid = user.uid;
        const db = getFirestore(firebase);
        const userRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setClientCode(uid.slice(-6));
        }
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d4af37" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Não foi possível carregar seus dados.</Text>
      </View>
    );
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeInDown.delay(200)} style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(userData.name)}</Text>
        </View>
        <Text style={styles.nameText}>{userData.name}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300)} style={styles.infoBox}>
        <Text style={styles.label}>Telefone</Text>
        <Text style={styles.value}>{userData.phone}</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400)} style={styles.infoBox}>
        <Text style={styles.label}>CPF</Text>
        <Text style={styles.value}>{userData.cpf}</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(500)} style={styles.infoBox}>
        <Text style={styles.label}>Endereço</Text>
        <Text style={styles.value}>{userData.address}</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(600)} style={styles.codeBox}>
        <Text style={styles.codeLabel}>Código de Cliente</Text>
        <Text style={styles.code}>{clientCode}</Text>
      </Animated.View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fefdf9',
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    backgroundColor: '#d4af37',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 12,
  },
  editButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#d4af37',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  editButtonText: {
    color: '#d4af37',
    fontWeight: 'bold',
  },
  infoBox: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#d4af37',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  codeBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff8e1',
    borderColor: '#d4af37',
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  code: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
