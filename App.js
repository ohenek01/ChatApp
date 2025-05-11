import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack';
import Signup from "./components/Signup";
import Login from "./components/Login";
import Chatroom from "./components/Chatroom";
import Chatlist from "./components/Chatlist";

const Stack = createStackNavigator();
export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Signup' component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
          <Stack.Screen name='Chatroom' component={Chatroom} options={{ headerShown: false }} />
          <Stack.Screen name='Chatlist' component={Chatlist} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

