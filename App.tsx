import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CalendarScreen } from './src/screens/CalendarScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignUpScreen } from './src/screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from './src/screens/auth/ForgotPasswordScreen';
import { ConfirmEmailScreen } from './src/screens/auth/ConfirmEmailScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { GroupSetupScreen } from './src/screens/GroupSetupScreen';
import { JoinGroupScreen } from './src/screens/JoinGroupScreen';
import { colors } from './src/theme/colors';
import { useAuthStore } from './src/stores/authStore';
import { AuthStackParamList, OnboardingStackParamList, MainStackParamList } from './src/types';

const Tab = createBottomTabNavigator();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconMap: Record<string, { active: string; inactive: string }> = {
            Calendar: { active: 'calendar', inactive: 'calendar-outline' },
            Menu: { active: 'restaurant', inactive: 'restaurant-outline' },
            Budget: { active: 'wallet', inactive: 'wallet-outline' },
            Schedule: { active: 'time', inactive: 'time-outline' },
          };
          const icon = iconMap[route.name];
          const iconName = focused ? icon?.active : icon?.inactive;
          return <Ionicons name={iconName as any} size={size} color={color} />;
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
        name="ConfirmEmail"
        component={ConfirmEmailScreen}
        options={{ headerShown: true, title: 'メール確認', headerTintColor: colors.primary }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: true, title: '', headerTintColor: colors.primary }}
      />
    </AuthStack.Navigator>
  );
}

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Onboarding" component={OnboardingScreen} />
      <OnboardingStack.Screen
        name="GroupSetup"
        component={GroupSetupScreen}
        options={{ headerShown: true, title: 'グループ作成', headerTintColor: colors.primary }}
      />
      <OnboardingStack.Screen
        name="JoinGroup"
        component={JoinGroupScreen}
        options={{ headerShown: true, title: 'グループ参加', headerTintColor: colors.primary }}
      />
    </OnboardingStack.Navigator>
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
  const user = useAuthStore((state) => state.user);
  const loadAuth = useAuthStore((state) => state.loadAuth);

  useEffect(() => {
    loadAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderNavigator = () => {
    if (!isAuthenticated) return <AuthNavigator />;
    if (!user?.familyGroupId) return <OnboardingNavigator />;
    return <MainNavigator />;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {renderNavigator()}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

import { Text, StyleSheet } from 'react-native';

const PlaceholderScreen = ({ route }: any) => (
  <View style={placeholderStyles.container}>
    <Text style={placeholderStyles.text}>
      {route.name} 画面は今後実装予定です
    </Text>
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
