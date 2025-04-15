// AppLayout.js
import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const AppLayout = ({ children }) => {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { height: height, width: width },
      ]}
    >
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 800, // Evitar que o conteúdo fique muito largo
  },
});

export default AppLayout;
