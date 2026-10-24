import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/tokens';
import { useDepotStore } from '../store/useDepotStore';

import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen, SessionLockScreen, LogoutConfirmScreen } from '../screens/AuthScreens';
import { DashboardScreen } from '../screens/DashboardScreen';
import { PosTerminalScreen } from '../screens/PosTerminalScreen';
import { PaymentCheckoutScreen } from '../screens/PaymentCheckoutScreen';
import {
  SaleReceiptScreen,
  SalesJournalScreen,
  SaleAuditDetailScreen,
} from '../screens/ReceiptAndJournalScreens';
import {
  StockCatalogScreen,
  ProductDetailScreen,
  ProductFormScreen,
} from '../screens/StockCatalogScreens';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SessionLock: undefined;
  MainTabs: undefined;
  LogoutConfirm: undefined;
  PaymentCheckout: undefined;
  SaleReceipt: { saleId: string };
  SaleAuditDetail: { saleId: string };
  ProductDetail: { productId: string };
  ProductForm: { productId?: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Ventes: undefined;
  Stock: undefined;
  Journal: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainBottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: Colors.surfaceContainerLowest,
          borderTopColor: '#E2E8F0',
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'grid-outline',
            Ventes: 'cart-outline',
            Stock: 'cube-outline',
            Journal: 'receipt-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Ventes" component={PosTerminalScreen} options={{ title: 'Ventes' }} />
      <Tab.Screen name="Stock" component={StockCatalogScreen} options={{ title: 'Stock' }} />
      <Tab.Screen name="Journal" component={SalesJournalScreen} options={{ title: 'Clients & Journal' }} />
    </Tab.Navigator>
  );
}

export function RootNavigator({ dbReady }: { dbReady: boolean }) {
  const { currentOperator, isSessionLocked } = useDepotStore();

  if (!dbReady) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!currentOperator ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : isSessionLocked ? (
        <Stack.Screen name="SessionLock" component={SessionLockScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainBottomTabs} />
          <Stack.Screen name="PaymentCheckout" component={PaymentCheckoutScreen} />
          <Stack.Screen name="SaleReceipt" component={SaleReceiptScreen} />
          <Stack.Screen name="SaleAuditDetail" component={SaleAuditDetailScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="ProductForm" component={ProductFormScreen} />
          <Stack.Screen
            name="LogoutConfirm"
            component={LogoutConfirmScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
