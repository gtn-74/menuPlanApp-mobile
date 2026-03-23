#!/bin/bash

# CalendarScreenの作成
cat > src/screens/CalendarScreen.tsx << 'EOF'
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { DateData } from 'react-native-calendars';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Header } from '../components/common/Header';
import { CalendarView } from '../components/Calendar/CalendarView';
import { useFilterStore } from '../stores/filterStore';
import { mockMenuItems, mockBudgetItems, mockEvents, getDataForDate } from '../mocks/data';
import { colors } from '../theme/colors';
import { MarkedDates, DayData } from '../types';

export const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [showFilterModal, setShowFilterModal] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const {
    showMenu,
    showBudget,
    showPersonalEvents,
    showFamilyEvents,
    loadFilters,
  } = useFilterStore();

  // フィルター設定を読み込み
  useEffect(() => {
    loadFilters();
  }, []);

  // マーク済み日付を生成
  const markedDates: MarkedDates = useMemo(() => {
    const marked: MarkedDates = {};

    // すべてのデータから日付を収集
    const allDates = new Set<string>();
    if (showMenu) mockMenuItems.forEach((item) => allDates.add(item.date));
    if (showBudget) mockBudgetItems.forEach((item) => allDates.add(item.date));
    if (showPersonalEvents || showFamilyEvents) {
      mockEvents.forEach((event) => {
        if (
          (event.type === 'personal' && showPersonalEvents) ||
          (event.type === 'family' && showFamilyEvents)
        ) {
          allDates.add(event.date);
        }
      });
    }

    // 各日付にドットを追加
    allDates.forEach((date) => {
      const dots = [];

      if (showMenu && mockMenuItems.some((item) => item.date === date)) {
        dots.push({ key: 'menu', color: colors.dots.menu });
      }
      if (showBudget && mockBudgetItems.some((item) => item.date === date)) {
        dots.push({ key: 'budget', color: colors.dots.budget });
      }
      if (showPersonalEvents && mockEvents.some((e) => e.date === date && e.type === 'personal')) {
        dots.push({ key: 'personalEvent', color: colors.dots.personalEvent });
      }
      if (showFamilyEvents && mockEvents.some((e) => e.date === date && e.type === 'family')) {
        dots.push({ key: 'familyEvent', color: colors.dots.familyEvent });
      }

      if (dots.length > 0) {
        marked[date] = {
          dots,
          selected: date === selectedDate,
          selectedColor: colors.selectedDay,
        };
      }
    });

    // 選択日をマーク
    if (!marked[selectedDate]) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.selectedDay,
      };
    }

    return marked;
  }, [showMenu, showBudget, showPersonalEvents, showFamilyEvents, selectedDate]);

  // 選択日のデータ
  const selectedDayData: DayData = useMemo(() => {
    const data = getDataForDate(selectedDate);
    return {
      date: selectedDate,
      menus: showMenu ? data.menus : [],
      budgets: showBudget ? data.budgets : [],
      events: data.events.filter((e) =>
        (e.type === 'personal' && showPersonalEvents) ||
        (e.type === 'family' && showFamilyEvents)
      ),
    };
  }, [selectedDate, showMenu, showBudget, showPersonalEvents, showFamilyEvents]);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    bottomSheetRef.current?.expand();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Header
          title="献立カレンダー"
          onFilterPress={() => setShowFilterModal(true)}
          onProfilePress={() => console.log('Profile pressed')}
        />

        <CalendarView
          markedDates={markedDates}
          selectedDate={selectedDate}
          onDayPress={handleDayPress}
        />

        {/* ボトムシート（簡易版 - 後で詳細実装） */}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={['25%', '50%', '90%']}
        >
          <View style={styles.bottomSheetContent}>
            {/* TODO: DayDetailBottomSheet コンポーネントを実装 */}
          </View>
        </BottomSheet>

        {/* TODO: FilterModal コンポーネントを実装 */}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 16,
  },
});
EOF

# App.tsxの作成
cat > App.tsx << 'EOF'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { CalendarScreen } from './src/screens/CalendarScreen';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;

            if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Menu') {
              iconName = focused ? 'restaurant' : 'restaurant-outline';
            } else if (route.name === 'Budget') {
              iconName = focused ? 'wallet' : 'wallet-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ title: 'カレンダー' }}
        />
        <Tab.Screen
          name="Menu"
          component={PlaceholderScreen}
          options={{ title: '献立' }}
        />
        <Tab.Screen
          name="Budget"
          component={PlaceholderScreen}
          options={{ title: '家計簿' }}
        />
        <Tab.Screen
          name="Profile"
          component={PlaceholderScreen}
          options={{ title: 'プロフィール' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// プレースホルダー画面（後で実装）
import { View, Text, StyleSheet } from 'react-native';

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
EOF

# package.jsonの作成
cat > package.json << 'EOF'
{
  "name": "menuplanapp-mobile",
  "version": "0.1.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-calendars": "^1.1307.0",
    "@react-navigation/native": "^7.0.15",
    "@react-navigation/bottom-tabs": "^7.2.2",
    "@react-navigation/native-stack": "^7.2.3",
    "react-native-screens": "^4.4.0",
    "react-native-safe-area-context": "^4.14.0",
    "zustand": "^5.0.2",
    "@react-native-async-storage/async-storage": "^2.1.0",
    "@gorhom/bottom-sheet": "^5.1.0",
    "react-native-reanimated": "~3.16.4",
    "react-native-gesture-handler": "~2.20.2",
    "@expo/vector-icons": "^14.0.4"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~18.3.12",
    "typescript": "~5.3.3"
  },
  "private": true
}
EOF

# tsconfig.jsonの作成
cat > tsconfig.json << 'EOF'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
EOF

# babel.config.jsの作成
cat > babel.config.js << 'EOF'
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
EOF

echo "✅ All files created successfully!"
