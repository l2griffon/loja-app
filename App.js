import 'react-native-reanimated';
import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Telas principais
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProductScreen from './screens/ProductScreen';
import CategoryProductsScreen from './screens/CategoryProductsScreen';
import PersonalizedOptionsScreen from './screens/PersonalizedOptionsScreen';

// Carrinho e Checkout
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';

// Perfil do usuário
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';

// Admin
import AdminOrdersScreen from './screens/AdminOrdersScreen';
import PedidoDetalhesScreen from './screens/PedidoDetalhesScreen';
import ProductImportScreen from './screens/ProductImportScreen';

// Contexto
import { CartProvider } from './context/CartContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false, // Oculta o header padrão em todas as telas
          }}
        >
          {/* Telas principais */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
          <Stack.Screen name="PersonalizedOptions" component={PersonalizedOptionsScreen} />

          {/* Carrinho e Checkout */}
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />

          {/* Perfil do usuário */}
          <Stack.Screen name="Perfil" component={ProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />

          {/* Admin */}
          <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
          <Stack.Screen name="PedidoDetalhes" component={PedidoDetalhesScreen} />
          <Stack.Screen name="ProductImport" component={ProductImportScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
