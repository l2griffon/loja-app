import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function AddProduct({ token }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddProduct = async () => {
    if (!name || !price || !category || !image) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post(
        'http://localhost:3001/add-product',
        { name, price, category, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Produto adicionado com sucesso!');
      setName('');
      setPrice('');
      setCategory('');
      setImage('');
    } catch (error) {
      setErrorMessage('Erro ao adicionar produto. Tente novamente.');
      console.error('Erro ao adicionar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Categoria (perfumes, cestas, brinquedos)"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="URL da imagem"
        value={image}
        onChangeText={setImage}
      />
      <Button title="Adicionar Produto" onPress={handleAddProduct} disabled={loading} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
