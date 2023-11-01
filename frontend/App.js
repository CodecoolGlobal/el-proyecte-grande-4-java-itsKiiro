import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import FavoriteScreen from './pages/FavoriteScreen';
import StartScreen from './pages/StartScreen';
import HomeScreen from './pages/HomeScreen';
import CreateAccountScreen from './pages/CreateAccountScreen';
import SettingScreen from './pages/SettingScreen';

export default function App() {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingScreen} />
        <Stack.Screen name="Favorites" component={FavoriteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

