import { Text } from 'react-native';
import { Tabs } from 'expo-router';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#58CC02',
        tabBarInactiveTintColor: '#AFAFAF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarLabel: 'Главная', tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }}
      />
      <Tabs.Screen
        name="practice"
        options={{ tabBarLabel: 'Карточки', tabBarIcon: ({ focused }) => <TabIcon emoji="🃏" focused={focused} /> }}
      />
      <Tabs.Screen
        name="learn"
        options={{ tabBarLabel: 'Уроки', tabBarIcon: ({ focused }) => <TabIcon emoji="📚" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarLabel: 'Профиль', tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} /> }}
      />
    </Tabs>
  );
}
