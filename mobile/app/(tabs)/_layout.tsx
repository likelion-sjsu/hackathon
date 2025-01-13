import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "@/styles/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.light.primary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="categories/index"
        options={{
          title: "categories",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "man" : "man-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create-group/index"
        options={{
          title: "create group",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-add" : "person-add-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="join-group/index"
        options={{
          title: "join group",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people-circle" : "people-circle-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
