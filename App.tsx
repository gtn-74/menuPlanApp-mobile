import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ForgotPasswordScreen } from './src/screens/auth/ForgotPasswordScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignUpScreen } from './src/screens/auth/SignUpScreen';
import { CalendarScreen } from './src/screens/CalendarScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { useAuthStore } from './src/stores/authStore';
import { colors } from './src/theme/colors';
import type { AuthStackParamList, MainStackParamList, MainTabParamList } from './src/types';

// Ionicons が受け付けるアイコン名（ライブラリの glyphMap から導出）
type IconName = keyof typeof Ionicons.glyphMap;

const Tab = createBottomTabNavigator<MainTabParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap: Record<string, { active: IconName; inactive: IconName }> = {
            Calendar: { active: 'calendar', inactive: 'calendar-outline' },
            Menu: { active: 'restaurant', inactive: 'restaurant-outline' },
            Budget: { active: 'wallet', inactive: 'wallet-outline' },
            Schedule: { active: 'time', inactive: 'time-outline' },
            // 以下はプロフィール設定で有効化可能
            // Todo: { active: 'checkbox', inactive: 'checkbox-outline' },
            // Diary: { active: 'book', inactive: 'book-outline' },
            // Messages: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
          };

          const icon = iconMap[route.name];
          const iconName = focused ? icon?.active : icon?.inactive;

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'カレンダー' }} />
      <Tab.Screen name="Menu" component={PlaceholderScreen} options={{ title: '献立' }} />
      <Tab.Screen name="Budget" component={PlaceholderScreen} options={{ title: '家計簿' }} />
      <Tab.Screen name="Schedule" component={PlaceholderScreen} options={{ title: '予定' }} />
      {/* 以下はプロフィール設定で有効化可能
      <Tab.Screen
        name="Todo"
        component={PlaceholderScreen}
        options={{ title: 'Todo' }}
      />
      <Tab.Screen
        name="Diary"
        component={PlaceholderScreen}
        options={{ title: '日記' }}
      />
      <Tab.Screen
        name="Messages"
        component={PlaceholderScreen}
        options={{ title: 'メッセージ' }}
      />
      */}
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: true, title: '', headerTintColor: colors.primary }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: true, title: '', headerTintColor: colors.primary }}
      />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <MainStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'プロフィール',
          headerTintColor: colors.primary,
          presentation: 'modal',
        }}
      />
    </MainStack.Navigator>
  );
}

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const loadAuth = useAuthStore((state) => state.loadAuth);

  useEffect(() => {
    loadAuth();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

// プレースホルダー画面（後で実装）
import { StyleSheet, Text } from 'react-native';

const PlaceholderScreen = ({ route }: BottomTabScreenProps<MainTabParamList>) => (
  <View style={placeholderStyles.container}>
    <Text style={placeholderStyles.text}>{route.name} 画面は今後実装予定です</Text>
  </View>
);

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
