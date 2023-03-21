import React from "react";
import {Text, StyleSheet} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/CustomDrawer";
import {FontAwesome} from "@expo/vector-icons";
import Colors from "../config/colors";

import Home from "../screens/Home";
import Logout from "../screens/Logout";
import VenderOrderDetails from "../screens/vender/VenderOrderDetails";
import OrderVolunteerListScreen from "../screens/manage-order/OrderVolunteerListScreen";
import OrderVolunteerAdd from "../screens/manage-order/OrderVolunteerAdd";
import OrderVolunteerUpdate from "../screens/manage-order/OrderVolunteerUpdate";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNav = () => (
    <Drawer.Navigator 
        initialRouteName="Home"
        screenOptions={{
            headerShown: false,
            drawerActiveTintColor: Colors.primary,
            drawerInactiveTintColor: Colors.grey,
            drawerActiveBackgroundColor: Colors.white,
            drawerInactiveBackgroundColor: Colors.white,
            drawerItemStyle: { marginVertical: 5 }
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
       <Drawer.Screen
            name="Home"
            component={Home}
            options={{
                drawerLabel: ({ focused, color }) =>
                getDrawerLabel(focused, color, "Home"),
                drawerIcon: ({ color }) => (
                    <FontAwesome name="home" size={20} color={color} />
                ),
            }}
        />
    </Drawer.Navigator>
)

export  default function VendorNavigation () {
    return(
        <>
            <Stack.Screen name="DashBoard" component={DrawerNav} />
            <Stack.Screen name="VenderOrderDetails" component={VenderOrderDetails} />
            <Stack.Screen name="OrderVolunteerListScreen" component={OrderVolunteerListScreen} />
            <Stack.Screen name="OrderVolunteerAdd" component={OrderVolunteerAdd} />
            <Stack.Screen name="OrderVolunteerUpdate" component={OrderVolunteerUpdate} />
            <Stack.Screen name="Logout" component={Logout} />
        </>
    )
}

const getDrawerLabel = (focused, color, label) => {
    return (
        <Text
            style={[
                { color },
                styles.drawerItem,
                focused ? styles.activeLabel : null,
            ]}
        >
            {label}
        </Text>
    );
};

const styles = StyleSheet.create({
    drawerItem: {
      marginLeft: -10,
      fontSize: 16,
    },
    activeLabel: {
      fontWeight: "bold",
    },
});