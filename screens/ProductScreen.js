import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Certifique-se de que esse caminho está correto

const categories = [
  { name: 'Perfumes', type: 'perfumes', emoji: '🧴' },
  { name: 'Cestas de Presente', type: 'cestas de presentes', emoji: '🎁' },
  { name: 'Brinquedos', type: 'brinquedos', emoji: '🧸' },
];

const ProductScreen = () => {
  const navigation = useNavigation();

  const handleCategoryPress = async (type) => {
    try {
      const q = query(collection(db, 'products'), where('categoria', '==', type));
      const querySnapshot = await getDocs(q);
      const produtos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      navigation.navigate('CategoryProducts', {
        category: type,
        produtos,
      });
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    }
  };

  const renderCategory = ({ item, index }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 150)}
      style={styles.card}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => handleCategoryPress(item.type)}
      >
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.categoryText}>{item.name}</Text>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Escolha uma Categoria</Text>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.type}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="arrow-back" size={22} color="#B8860B" />
            <Text style={styles.backText}>Voltar para Home</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  categoryText: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 6,
    color: '#B8860B',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
