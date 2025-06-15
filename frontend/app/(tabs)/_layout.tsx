import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 90, 
          paddingBottom: 6, 
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          display: 'none', 
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '',
          headerTitle: '',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} style={{ marginTop: 0 }} />
          ),
          headerStyle: {
            height: 50,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          headerTitle: '',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} style={{ marginTop: 0 }} />
          ),
          headerStyle: {
            height: 50,
          },
        }}
      />
    </Tabs>
  );
}
