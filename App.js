import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routes, Link } from "expo-router";

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import TripEditor    from './components/TripEditor';
import TripSelector  from './components/TripSelector';
import HomePage from './components/HomePage';
import MapComponent from './components/MapComponent';
import { GlobalContextProvider } from './components/GlobalContext';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


/*function MyStackComponent() {

  return (
    <Stack.Navigator initialRouteName="HomePage">
      <Stack.Screen 
        name="HomePage" 
        component={HomePage} 
        options={{title: "Welcome"}}/>

      <Stack.Screen 
        name="JourneyEditor" 
        component={TripEditor} 
        options={{title: "Create your journey !"}}/>

      <Stack.Screen 
        name="JourneySelector" 
        component={TripSelector} 
        options={{title: "Choose a journey"}}/>
    </Stack.Navigator>
  );
}*/


export default function App() {

  return (
    <GlobalContextProvider>

      <NavigationContainer>
        <Drawer.Navigator initialRouteName="HomePage">

          <Drawer.Screen 
            name="HomePage" 
            component={HomePage} 
            options={{title: "Welcome"}}
          />

          <Drawer.Screen 
            name="JourneySelector" 
            component={TripSelector} 
            options={{title: "Choose a journey"}}
          />

          <Drawer.Screen 
            name="JourneyEditor" 
            component={TripEditor} 
            options={{title: "Create your journey !"}}
          />

          <Drawer.Screen 
            name="Map" 
            component={MapComponent} 
          />

        </Drawer.Navigator>
        
      </NavigationContainer>

    </GlobalContextProvider>
  );

}



