import React, { useContext, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/CustomDrawer";
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Constants from "expo-constants";

import Colors from "../config/colors";
import Configs from "../config/Configs";

import MasterMenuScreen from "../screens/master/MasterMenuScreen";
import Home from "../screens/Home";
import ManageEnquiry from "../screens/ManageEnquiry";
import Orders from "../screens/Orders";
import Chat from "../screens/Chat-section/Chat";
import Profile from "../screens/Profile";
import GameDetails from "../screens/GameDetails";
import EventDetails from "../screens/EventDetails";
import Catalog from "../screens/Catalog";
import AddCategory from "../screens/AddCategory";
import editCategory from "../screens/EditCategory";
import SubCategory from "../screens/SubCategory";
import CategoryTagAddScreen from "../screens/CategoryTagAddScreen";
import AddSubCategory from "../screens/AddSubCategory";
import EditSubCategory from "../screens/EditSubCategory";
import Games from "../screens/game/Games";
import GamesByTag from "../screens/game/GamesByTag";
import AddGame from "../screens/game/AddGame";
import EditGame from "../screens/game/EditGame";
import ProductListingDetails from "../screens/game/ProductListingDetails";
import ProductLaunchDetails from "../screens/game/ProductLaunchDetails";
import PartsList from "../screens/game/PartsList";
import GameImageScreen from "../screens/game/GameImageScreen";
import GameTagScreen from "../screens/game/GameTagScreen";
import ManageOrder from "../screens/ManageOrder";
import Logout from "../screens/Logout";
import SearchScreen from "../screens/SearchScreen";
import TemplateScreen from "../screens/master/TemplateScreen";
import VenderTypeScreen from "../screens/master/VenderTypeScreen";
import PriorityScreen from "../screens/master/PriorityScreen";
import UomScreen from "../screens/master/UomScreen";
import PartScreen from "../screens/master/PartScreen";
import VenderScreen from "../screens/master/VenderScreen";
import VenderAddUpdateScreen from "../screens/master/VenderAddUpdateScreen";
import MaterialScreen from "../screens/master/MaterialScreen";
import StorageAreaMaster from "../screens/master/StorageMaster";
import AddStorageMaster from "../screens/master/AddStorageMaster";
import EditStorageMaster from "../screens/master/EditStorageMaster";
import TagMaster from "../screens/master/TagMaster";
import AddTagMaster from "../screens/master/AddTagMaster";
import EditTagMaster from "../screens/master/EditTagMaster";
import WarehouseScreen from "../screens/master/WarehouseScreen";
import CompanyScreen from "../screens/master/CompanyScreen";
import VenderEnquiryAddUpdateScreen from "../screens/manage-order/VenderEnquiryAddUpdateScreen";
import EventVolunteerAddUpdateScreen from "../screens/manage-order/EventVolunteerAddUpdateScreen";
import OrderVolunteerListScreen from "../screens/manage-order/OrderVolunteerListScreen";
import EventEnquiryDetail from "../screens/manage-order/EventEnquiryDetail";
import PreviewScreen from "../screens/PreviewScreen";
import CallSmsRecordAddUpdateScreen from "../screens/manage-order/CallSmsRecordAddUpdateScreen";
import ManageBill from "../screens/manage-bill/ManageBill";
import EventBillDetail from "../screens/manage-bill/EventBillDetail";
import VolunteerAddUpdateScreen from "../screens/manage-order/VolunteerAddUpdateScreen";
import VehicleAddUpdateScreen from "../screens/manage-order/VehicleAddUpdateScreen";
import VehicleAddUpdateInfoScreen from "../screens/manage-order/VehicleAddUpdateInfoScreen";
import UserChangePasswordScreen from "../screens/user/UserChangePasswordScreen";
import PaymentScreen from "../screens/PaymentScreen";
import AddVehicleInfo from "../screens/vehicle/AddVehicleInfo";
import UpdateVehicleInfo from "../screens/vehicle/UpdateVehicleInfo";
import AddVehicleArrivalEntry from "../screens/vehicle/AddVehicleArrivalEntry";
import UpdateVehicleArrivalEntry from "../screens/vehicle/UpdateVehicleArrivalEntry";
import VehicleArrivalEntry from "../screens/vehicle/VehicleArrivalEntry";
import VehicleUpWordJourneyStartAdd from "../screens/vehicle/VehicleUpWordJourneyStartAdd";
import VehicleUpWordJourneyEndAdd from "../screens/vehicle/VehicleUpWordJourneyEndAdd";
import VehicleDownWordJourneyStartAdd from "../screens/vehicle/VehicleDownWordJourneyStartAdd";
import VehicleDownWordJourneyEndAdd from "../screens/vehicle/VehicleDownWordJourneyEndAdd";
import VehicleBilling from "../screens/vehicle/VehicleBilling";
import Tag from "../screens/Tag";
import VehiclePaymentInfoAdd from "../screens/vehicle/VehiclePaymentInfoAdd";
import OrderVendorVolunteersAdd from "../screens/order/OrderVendorVolunteersAdd";
import OrderVolunteerAdd from "../screens/manage-order/OrderVolunteerAdd";
import OrderVolunteerUpdate from "../screens/manage-order/OrderVolunteerUpdate";
import OrderInvoice from "../screens/manage-order/OrderInvoice";
import OrderSetupPhotos from "../screens/manage-order/OrderSetupPhotos";
import AddExpenses from "../screens/manage-order/AddExpenses";
import EditOrderedGames from "../screens/manage-order/EditOrderedGames";
import GamesForTagAndSubCat from "../components/GamesForTagAndSubCat";
import SearchTagScreen from "../screens/SearchTagScreen";
import Designation from "../screens/master/Designation";
import AddDesignationMaster from "../screens/master/AddDesignationMaster";
import Employee from "../screens/Employee";
import AddEmployee from "../screens/AddEmployee";
import AppContext from "../context/AppContext";
import ChatDetails from "../screens/Chat-section/ChatDetails";
import Chat_orders from "../screens/Chat-section/Chat_orders";
import Address_Book from "../screens/Address_Book";

import Todo from "../screens/task/Todo";
import CategoryItems from "../screens/task/CategoryItems";
import AddCategoryItem from "../screens/task/AddCategoryItem";
import ViewItem from "../screens/task/ViewItem";
import NewAssignScreen from "../screens/task/NewAssign";
import SearchByTasks from "../screens/task/SearchByTasks";
import EventScreen from "../screens/master/EventScreen";
import Address_detailsBook from "../screens/Address_detailsBook";
import Communications from "../screens/manage-order/Communications";
import TodoCategory from "../screens/master/TodoCategory";
import AddTodoCategory from "../screens/master/AddTodoCategory";
import EditTodoCategory from "../screens/master/EditTodoCategory";
import FileSetting from "../screens/master/file_setting";
import Address_Company_detailsBook from "../screens/Address_Company_detailsBook";
import TrackOrder from "../screens/Track_order";

import CashFlow from "../screens/CashFlow/CashFlow";
import Income from "../screens/CashFlow/Income";
import Expense from "../screens/CashFlow/Expense";
import AccountDetailsScreen from "../screens/CashFlow/AccountDetailsScreen";

/*
 *
 *import IncomeEdit and ExpenseEdit
 *created by - Rahul Saha
 *Created on - 25.11.22
 *
 */

import IncomeEdit from "../screens/CashFlow/IncomeEdit";
import ExpenseEdit from "../screens/CashFlow/ExpenseEdit";
import AddCategory_Cashflow from "../screens/CashFlow/AddCategory";

/*
 *
 *wishlist Suggestion
 *created by - Rahul Saha
 *Created on - 30.11.22
 *
 */
import Wishlist_Suggestion from "../screens/Wishlist_Suggestion";
import Wishlist_Details from "../screens/Wishlist_Details";
import Wishlist_GameSearch from "../screens/Wishlist_GameSearch";

/*
 *
 *Log_history
 *created by - Rahul Saha
 *Created on - 07.12.22
 *
 */
import Log_history from "../screens/Log_history";
import PaymentTerm from "../screens/master/PaymentTerm";
import AddPaymentTerm from "../screens/master/AddPaymentTerm";
import AddProjects from "../screens/CashFlow/addProjects";
import HomeScreen from "../screens/CashFlow/HomeScreen"
import Transfer from "../screens/CashFlow/AddTransfer";
import ChangePayMethod from "../screens/CashFlow/ChangePayMethod";
import TransferEdit from "../screens/CashFlow/TransferEdit";
import CashFlowHome from "../screens/CashFlow/CashFlowHome";
import CashFlowSettings from "../screens/master/CashFlowSettings";
import WalletSettings from "../screens/master/WalletSettings";
import CategorySettings from "../screens/master/CategorySettings";
import SubCategorySettings from "../screens/master/SubCategorySettings";
import AddWalletSettings from "../screens/master/AddWalletSettings";
import AddCategorySettings from "../screens/master/AddCategorySettings";
import AddsubCategorySettings from "../screens/master/AddsubCategorySettings";
import Order_CashFlow from "../screens/manage-order/Order_Cashflow";
import VersionControl from "../screens/VersionControl";
import NewPayment from "../screens/NewPayment";
import UserLoginSetting from "../screens/master/UserLoginSettings";
import Wallet from "../screens/CashFlow/Wallet";
import ScannAndPay from "../screens/CashFlow/ScannAndPay";
import BankPayment from "../screens/CashFlow/BankPayment";
import BankAmountTransfer from "../screens/CashFlow/BankAmountTransfer";
import WalletCashFlow from "../screens/Wallet/WalletCashFlow";
import WalletCashFlowHome from "../screens/Wallet/WalletCashFlowHome";
import EventExpenses from "../screens/order/EventExpenses";
import OtherExpenses from "../screens/order/OtherExpenses";
import VehicleWallet from "../screens/vehicle/VehicleWallet";
import VehicleCash from "../screens/vehicle/VehicleCash";
import PayAmount from "../screens/PayAmount";

import ManegerSettings from "../screens/master/ManegerSettings";
import AddDefaultManeger from "../screens/master/AddDefaultManeger";

function toggleDrawer({ navigation }) {
  navigation.toggleDrawer();
}
//   // const nav = () => {
//   //   navigation.toggleDrawer();
//   // };
//   // nav();
//   // useEffect({}, []);
// console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
// alert("hello");
// return (
//   <View>
//     <Text> Demo Tet</Text>
//     {/* <TouchableOpacity onPress={() => navigation.toggleDrawer()} /> */}
//   </View>
//);
//}

const styles = StyleSheet.create({
  drawerItem: {
    marginLeft: -10,
    fontSize: 16,
  },
  activeLabel: {
    fontWeight: "bold",
  },
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const activeIconSize = 22;
const inactiveIconSize = 20;
const currentVersion = Constants.manifest.version;

const TabNavigation = () => {
  const context = useContext(AppContext);
  // const toggleDrawer = () => navigation.toggleDrawer();
  // console.log('.......context.userData.menu_permission........',context.userData.menu_permission)
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.lightGrey,
        tabBarStyle: { backgroundColor: Colors.primary },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
        tabBarIcon: ({ focused, color }) => {
          let iconPkg;
          let iconName;
          let iconSize;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "Catalogue") {
            iconName = focused ? "book" : "book-outline";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "Orders") {
            iconPkg = "MaterialCommunityIcons";
            iconName = "calendar-clock";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbox" : "chatbox-outline";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "Address") {
            iconPkg = "MaterialCommunityIcons";
            iconName = focused
              ? "card-account-details"
              : "badge-account-horizontal-outline";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "Log History") {
            iconPkg = "MaterialCommunityIcons";
            iconName = focused ? "history" : "history";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "Search") {
            iconName = focused ? "md-search" : "md-search";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          } else if (route.name === "Cash") {
            iconPkg = "MaterialCommunityIcons";
            iconName = focused ? "cash-fast" : "cash-fast";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          }  else if (route.name === "Tab") {
            iconPkg = "FontAwesome";
            iconName = focused ? "navicon" : "navicon";
            iconSize = focused ? activeIconSize : inactiveIconSize;
          }

          if (iconPkg === "MaterialCommunityIcons") {
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={iconSize}
                color={color}
              />
            );
          } else if (iconPkg === "FontAwesome") {
            return (
              <FontAwesome name={iconName} size={iconSize} color={color} />
            );
          } else {
            return <Ionicons name={iconName} size={iconSize} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      {context.userData.type == 'admin' ?
        <>
          <Tab.Screen name="Search" component={SearchScreen} />
          {Configs.TAB_MENU.filter((element) =>
            (context.userData.menu_permission || []).includes(element.id)
          ).map((data) => {
            return (
              <>
                {data.id == 'Address_Book' ?
                  <Tab.Screen name="Address" component={Address_Book} />
                  : null}
                {data.id == 'Log_history' ?
                  <Tab.Screen name="Log History" component={Log_history} />
                  : null}
              </>
            )
          })}
          <Tab.Screen
            name="Chat"
            component={Chat}
            options={{
              tabBarBadge:
                context.totalUnreadChatQuantity > 0
                  ? context.totalUnreadChatQuantity
                  : null,
              tabBarBadgeStyle:
                context.totalUnreadChatQuantity > 0
                  ? { backgroundColor: Colors.lightGrey }
                  : null,
            }}
          />
        </>
        : null}
      <Tab.Screen name="Cash" component={CashFlow} />
      <Tab.Screen
        name="Tab"
        component={Home}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            navigation.toggleDrawer();
          },
        })}
      />
      {/* <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Address" component={Address_Book} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Log History" component={Log_history} />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarBadge:
            context.totalUnreadChatQuantity > 0
              ? context.totalUnreadChatQuantity
              : null,
          tabBarBadgeStyle:
            context.totalUnreadChatQuantity > 0
              ? { backgroundColor: Colors.lightGrey }
              : null,
        }}
      />
      <Tab.Screen
        name="Tab"
        component={Home}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();

            // Do something with the `navigation` object
            navigation.toggleDrawer();
          },
        })}
      /> */}

    </Tab.Navigator>
  );
};

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

const DrawerNav = () => {
  const context = useContext(AppContext);

  return (
    <Drawer.Navigator
      initialRouteName={"Home"}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: Colors.primary,
        drawerInactiveTintColor: Colors.textColor,
        drawerActiveBackgroundColor: Colors.white,
        drawerInactiveBackgroundColor: Colors.white,
        drawerItemStyle: { marginVertical: 5 },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="DrawerHome"
        component={TabNavigation}
        options={{
          drawerLabel: ({ focused, color }) =>
            getDrawerLabel(focused, color, "Home"),
          drawerIcon: ({ color }) => (
            <FontAwesome name="home" size={20} color={color} />
          ),
        }}
      />

      {Configs.HOME_SCREEN_MENUES.filter((element) =>
        (context.userData.menu_permission || []).includes(element.id)
      ).map((data) => {
        let component;
        if (data?.component == "Catalog") {
          component = Catalog;
        }
        if (data?.component == "ManageEnquiry") {
          component = ManageEnquiry;
        }
        if (data?.component == "Orders") {
          component = Orders;
        }
        if (data?.component == "ManageBill") {
          component = ManageBill;
        }
        if (data?.component == "PaymentScreen") {
          component = PaymentScreen;
        }
        if (data?.component == "Employee") {
          component = Employee;
        }
        if (data?.component == "MasterMenuScreen") {
          component = MasterMenuScreen;
        }
        if (data?.component == "Address_Book") {
          component = Address_Book;
        }
        if (data?.component == "Todo") {
          component = Todo;
        }
        if (data?.component == "Wishlist_Suggestion") {
          component = Wishlist_Suggestion;
        }
        if (data?.component == "Log_history") {
          component = Log_history;
        }
        if (data?.component == "CashFlow") {
          component = CashFlow;
        }
        if (data?.component == "WalletCashFlow") {
          component = WalletCashFlow;
        }
        if (data?.component == "Bank_Details") {
          component = BankPayment;
        }

        return (
          <Drawer.Screen
            name={data.name}
            component={component}
            options={{
              drawerLabel: ({ focused, color }) =>
                getDrawerLabel(focused, color, data.options),
              drawerIcon: ({ color }) =>
                data.iconTag == "fontAwesome" ? (
                  <FontAwesome name={data.iconName} size={20} color={color} />
                ) : data.iconTag == "ionicons" ? (
                  <Ionicons name={data.iconName} size={20} color={color} />
                ) : (
                  <MaterialCommunityIcons
                    name={data.iconName}
                    size={20}
                    color={color}
                  />
                ),
            }}
          />
        );
      })}

          <Drawer.Screen
            name="PayAmount"
            component={PayAmount}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "PayAmount"),
                drawerIcon: ({ color }) => (
                    <MaterialCommunityIcons name="badge-account-horizontal-outline" size={20} color={color} />
                ),
            }}
        />

      {/* <Drawer.Screen
            name="Address Book"
            component={Address_Book}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Address Book"),
                drawerIcon: ({ color }) => (
                    <MaterialCommunityIcons name="badge-account-horizontal-outline" size={20} color={color} />
                ),
            }}
        /> */}

      {/* <Drawer.Screen
            name="Catalog"
            component={Catalog}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Catalogue"),
                drawerIcon: ({ color }) => (
                    <Ionicons name="book" size={20} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="ManageEnquiry"
            component={ManageEnquiry}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Manage Enquiry"),
                drawerIcon: ({ color }) => (
                    <MaterialCommunityIcons
                        name="clipboard-list"
                        size={20}
                        color={color}
                    />
                ),
            }}
        />
        <Drawer.Screen
            name="Orders"
            component={Orders}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Manage Orders"),
                drawerIcon: ({ color }) => (
                    <MaterialCommunityIcons
                        name="calendar-clock"
                        size={20}
                        color={color}
                    />
                ),
            }}
        />
        <Drawer.Screen
            name="Billing"
            component={ManageBill}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Billing"),
                drawerIcon: ({ color }) => (
                    <Ionicons name="receipt" size={20} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="PaymentScreen"
            component={PaymentScreen}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Payment"),
                drawerIcon: ({ color }) => (
                    <FontAwesome name="money" size={20} color={color} />
                ),
            }}
        />
<Drawer.Screen
            name="Employee"
            component={Employee}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Employee"),
                drawerIcon: ({ color }) => (
                    <Ionicons name="person" size={20} color={color} />
                ),
            }}
        />

        <Drawer.Screen
            name="MasterMenuScreen"
            component={MasterMenuScreen}
            options={{
                drawerLabel: ({ focused, color }) =>
                    getDrawerLabel(focused, color, "Masters"),
                drawerIcon: ({ color }) => (
                    <FontAwesome name="cog" size={20} color={color} />
                ),
            }}
        /> */}
    </Drawer.Navigator>
  );
};



export default function AdminNavigation() {
  return (
    <>
      <Stack.Screen name="Home" component={DrawerNav} />
      <Stack.Screen name="UserChangePassword" component={UserChangePasswordScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
      <Stack.Screen name="AddCategory" component={AddCategory} />
      <Stack.Screen name="EditCategory" component={editCategory} />
      <Stack.Screen name="SubCategory" component={SubCategory} />
      <Stack.Screen name="CategoryTagAddScreen" component={CategoryTagAddScreen} />
      <Stack.Screen name="AddSubCategory" component={AddSubCategory} />
      <Stack.Screen name="EditSubCategory" component={EditSubCategory} />
      <Stack.Screen name="Games" component={Games} />
      <Stack.Screen name="GamesByTag" component={GamesByTag} />
      <Stack.Screen name="GamesForTagAndSubCat" component={GamesForTagAndSubCat} />
      <Stack.Screen name="AddGame" component={AddGame} />
      <Stack.Screen name="EditGame" component={EditGame} />
      <Stack.Screen name="GameDetails" component={GameDetails} />
      <Stack.Screen name="PartsList" component={PartsList} />
      <Stack.Screen name="PartScreen" component={PartScreen} />
      <Stack.Screen name="VenderScreen" component={VenderScreen} />
      <Stack.Screen name="VenderAddUpdateScreen" component={VenderAddUpdateScreen} />
      <Stack.Screen name="MaterialScreen" component={MaterialScreen} />
      <Stack.Screen name="GameImageScreen" component={GameImageScreen} />
      <Stack.Screen name="GameTagScreen" component={GameTagScreen} />
      <Stack.Screen name="UomScreen" component={UomScreen} />
      <Stack.Screen name="TemplateScreen" component={TemplateScreen} />
      <Stack.Screen name="PriorityScreen" component={PriorityScreen} />
      <Stack.Screen name="VenderTypeScreen" component={VenderTypeScreen} />
      <Stack.Screen name="TagAreaMaster" component={TagMaster} />
      <Stack.Screen name="StorageAreaMaster" component={StorageAreaMaster} />
      <Stack.Screen name="Designation" component={Designation} />
      <Stack.Screen name="AddStorageMaster" component={AddStorageMaster} />
      <Stack.Screen name="AddDesignationMaster" component={AddDesignationMaster} />
      <Stack.Screen name="EditStorageMaster" component={EditStorageMaster} />
      <Stack.Screen name="AddTagMaster" component={AddTagMaster} />
      <Stack.Screen name="EditTagMaster" component={EditTagMaster} />
      <Stack.Screen name="VenderEnquiryAddUpdate" component={VenderEnquiryAddUpdateScreen} />
      <Stack.Screen name="VolunteerAddUpdate" component={VolunteerAddUpdateScreen} />
      <Stack.Screen name="VehicleAddUpdate" component={VehicleAddUpdateScreen} />
      <Stack.Screen name="VehicleAddUpdateInfoScreen" component={VehicleAddUpdateInfoScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
      <Stack.Screen name="WarehouseScreen" component={WarehouseScreen} />
      <Stack.Screen name="EventScreen" component={EventScreen} />
      <Stack.Screen name="CompanyScreen" component={CompanyScreen} />
      <Stack.Screen name="AddVehicleInfo" component={AddVehicleInfo} />
      <Stack.Screen name="UpdateVehicleInfo" component={UpdateVehicleInfo} />
      <Stack.Screen name="AddVehicleArrivalEntry" component={AddVehicleArrivalEntry} />
      <Stack.Screen name="UpdateVehicleArrivalEntry" component={UpdateVehicleArrivalEntry} />
      <Stack.Screen name="VehicleArrivalEntry" component={VehicleArrivalEntry} />
      <Stack.Screen name="VehicleUpWordJourneyStartAdd" component={VehicleUpWordJourneyStartAdd} />
      <Stack.Screen name="VehicleUpWordJourneyEndAdd" component={VehicleUpWordJourneyEndAdd} />
      <Stack.Screen name="VehicleDownWordJourneyStartAdd" component={VehicleDownWordJourneyStartAdd} />
      <Stack.Screen name="VehicleDownWordJourneyEndAdd" component={VehicleDownWordJourneyEndAdd} />
      <Stack.Screen name="VehicleBilling" component={VehicleBilling} />
      <Stack.Screen name="VehiclePaymentInfoAdd" component={VehiclePaymentInfoAdd} />
      <Stack.Screen name="ProductListingDetails" component={ProductListingDetails} />
      <Stack.Screen name="ProductLaunchDetails" component={ProductLaunchDetails} />
      <Stack.Screen name="ManageOrder" component={ManageOrder} />
      <Stack.Screen name="EventVolunteerAddUpdate" component={EventVolunteerAddUpdateScreen} />
      <Stack.Screen name="OrderVolunteerListScreen" component={OrderVolunteerListScreen} />
      <Stack.Screen name="ManageBill" component={ManageBill} />
      <Stack.Screen name="EventEnquiryDetail" component={EventEnquiryDetail} />
      <Stack.Screen name="EventBillDetail" component={EventBillDetail} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="CallSmsRecordAddUpdate" component={CallSmsRecordAddUpdateScreen} />
      <Stack.Screen name="Logout" component={Logout} />
      <Stack.Screen name="Tag" component={Tag} />
      <Stack.Screen name="OrderVendorVolunteersAdd" component={OrderVendorVolunteersAdd} />
      <Stack.Screen name="OrderVolunteerAdd" component={OrderVolunteerAdd} />
      <Stack.Screen name="OrderVolunteerUpdate" component={OrderVolunteerUpdate} />
      <Stack.Screen name="OrderInvoice" component={OrderInvoice} />
      <Stack.Screen name="OrderSetupPhotos" component={OrderSetupPhotos} />
      <Stack.Screen name="AddExpenses" component={AddExpenses} />
      <Stack.Screen name="EditOrderedGames" component={EditOrderedGames} />
      <Stack.Screen name="SearchTagScreen" component={SearchTagScreen} />
      <Stack.Screen name="ChatDetails" component={ChatDetails} />
      <Stack.Screen name="Chat_orders" component={Chat_orders} />
      <Stack.Screen name="AddEmployee" component={AddEmployee} />
      <Stack.Screen name="Address_Book" component={Address_Book} />
      <Stack.Screen name="CategoryItems" component={CategoryItems} />
      <Stack.Screen name="AddCategoryItem" component={AddCategoryItem} />
      <Stack.Screen name="ViewItem" component={ViewItem} />
      <Stack.Screen name="NewAssignScreen" component={NewAssignScreen} />
      <Stack.Screen name="SearchByTasks" component={SearchByTasks} />
      <Stack.Screen name="Address_detailsBook" component={Address_detailsBook} />
      <Stack.Screen name="Address_Company_detailsBook" component={Address_Company_detailsBook} />
      <Stack.Screen name="Communications" component={Communications} />
      <Stack.Screen name="Todo" component={Todo} />
      <Stack.Screen name="MasterMenuScreen" component={MasterMenuScreen} />
      <Stack.Screen name="TodoCategory" component={TodoCategory} />
      <Stack.Screen name="AddTodoCategory" component={AddTodoCategory} />
      <Stack.Screen name="EditTodoCategory" component={EditTodoCategory} />
      <Stack.Screen name="FileSetting" component={FileSetting} />
      <Stack.Screen name="PaymentTerm" component={PaymentTerm} />
      <Stack.Screen name="AddPaymentTerm" component={AddPaymentTerm} />
      <Stack.Screen name="TrackOrder" component={TrackOrder} />
      <Stack.Screen name="Wishlist_Suggestion" component={Wishlist_Suggestion} />
      <Stack.Screen name="Wishlist_Details" component={Wishlist_Details} />
      <Stack.Screen name="Wishlist_GameSearch" component={Wishlist_GameSearch} />

      <Stack.Screen name="CashFlow" component={CashFlow} />
      <Stack.Screen name="Income" component={Income} />
      <Stack.Screen name="Expense" component={Expense} />
      <Stack.Screen name="AccountDetailsScreen" component={AccountDetailsScreen} />
      <Stack.Screen name="IncomeEdit" component={IncomeEdit} />
      <Stack.Screen name="ExpenseEdit" component={ExpenseEdit} />
      <Stack.Screen name="AddProjects" component={AddProjects} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Transfer" component={Transfer} />
      <Stack.Screen name="TransferEdit" component={TransferEdit} />
      <Stack.Screen name="ChangePayMethod" component={ChangePayMethod} />
      <Stack.Screen name="CashFlowHome" component={CashFlowHome} />
      <Stack.Screen name="Wallet" component={Wallet} />

      <Stack.Screen name="CashFlowSettings" component={CashFlowSettings} />
      <Stack.Screen name="WalletSettings" component={WalletSettings} />
      <Stack.Screen name="CategorySettings" component={CategorySettings} />
      <Stack.Screen name="SubCategorySettings" component={SubCategorySettings} />
      <Stack.Screen name="AddWalletSettings" component={AddWalletSettings} />
      <Stack.Screen name="AddCategorySettings" component={AddCategorySettings} />
      <Stack.Screen name="AddsubCategorySettings" component={AddsubCategorySettings} />

      <Stack.Screen name="Order_CashFlow" component={Order_CashFlow} />
      <Stack.Screen name="VersionControl" component={VersionControl} />
      <Stack.Screen name="NewPayment" component={NewPayment} />
      <Stack.Screen name="ScannAndPay" component={ScannAndPay} />
      <Stack.Screen name="BankPayment" component={BankPayment} />
      <Stack.Screen name="BankAmountTransfer" component={BankAmountTransfer} />

      <Stack.Screen name="UserLoginSetting" component={UserLoginSetting} />

      <Stack.Screen name="EventExpenses" component={EventExpenses} />
      <Stack.Screen name="OtherExpenses" component={OtherExpenses} />

      <Stack.Screen name="VehicleWallet" component={VehicleWallet} />
      <Stack.Screen name="VehicleCash" component={VehicleCash} />

      <Stack.Screen name="PayAmount" component={PayAmount} />
      {/* 
*
*log history
*created by - Rahul Saha
*Crreated on - 28.11.22
*
*
*/}
      <Stack.Screen name="Log_history" component={Log_history} />

      {/*
       *
       *cashFlow edit categoy
       *created by - Rahul Saha
       *Crreated on - 28.11.22
       *
       *
       */}

      <Stack.Screen
        name="AddCategory_Cashflow"
        component={AddCategory_Cashflow}
      />

      {/* <Stack.Screen name="Catalog" component={Catalog} />
            <Stack.Screen name="ManageEnquiry" component={ManageEnquiry} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="Billing" component={ManageBill} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen name="Employee" component={Employee} />
            <Stack.Screen name="MasterMenuScreen" component={MasterMenuScreen} /> */}
      {/** 
       *
       *wallet cashflow
       *@author Rahul Saha
       *date - 20.02.23
       *
       *
       */}
      <Stack.Screen name="WalletCashFlow" component={WalletCashFlow} />
      <Stack.Screen name="WalletCashFlowHome" component={WalletCashFlowHome} />

      <Stack.Screen name="ManegerSettings" component={ManegerSettings} />
      <Stack.Screen name="AddDefaultManeger" component={AddDefaultManeger} />
    </>
  );
}
