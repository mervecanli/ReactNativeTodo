import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/Home';
import Todo from '../screens/Todo';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


const Routes = () => {
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen 
                    name='Home'
                    component={Home}
                    options={{
                        headerShown:false
                    }}
                />
                <Stack.Screen 
                    name='Todo'
                    component={Todo}
                    options={{
                        headerShown:false
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default Routes;