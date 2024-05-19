import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TayyariApp from './src/index'
import TayyariScreen from './src/tayyariScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name ='TayyariApp' component={TayyariApp}/>
        <Stack.Screen name ='TayyariScreen' component={TayyariScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


