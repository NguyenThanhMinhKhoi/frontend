import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import UserListScreen from "./screens/UserListScreen";
import UserFormScreen from "./screens/UserFormScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Users" component={UserListScreen} />
        <Stack.Screen name="UserForm" component={UserFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
