// App.jsf
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Record from './screens/Record';
import Rave from './screens/Rave';
import Menu from './screens/Menu'; 


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Menu" component={Menu} /> 
        <Stack.Screen name="Record" component={Record} />
        <Stack.Screen name="Rave" component={Rave} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
