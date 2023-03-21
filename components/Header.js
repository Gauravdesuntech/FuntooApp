import React, { useContext, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "../config/colors";
import AppContext from "../context/AppContext";
import { Menu, MenuItem } from "react-native-material-menu";
import DateTimePicker from "@react-native-community/datetimepicker";

const Header = (props) => {
  const [action_typeAdd, setAction_typeAdd] = useState("");
  const [action_typeEdit, setAction_typeEdit] = useState("");
  const [workingDate, setWorkingDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const menuRef = useRef(null);
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const route = useRoute();
  const routeName = route.name;
  const toggleDrawer = () => navigation.toggleDrawer();
  const gotoBack = () => navigation.goBack();
  const gotoHome = () => navigation.push("Home");
  const action_types = context.userData.action_types.split(",");
  // console.log("...........context.userData..............",context.userData.order_details_permission);
  const showMenu = () => {
    menuRef.current.show();
    setVisible(true);
  };
  const hideMenu = () => {
    setVisible(false);
  };
  // const  gotoSearchByTasks = () => this.props.navigation.navigate("SearchByAddress");
  const onMenuItemChange = (type) => {
    props.onMenuItemChange(type);
    if (type == "rent") {
      menuRef.current.show();
      setVisible(true);
    } else if (type == "size") {
      menuRef.current.show();
      setVisible(true);
    } else {
      menuRef.current.hide();
      setVisible(false);
    }
  };

  const onChange = (event, selectedDate) => {
    // console.log("selectedDate*****************",selectedDate);
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    props.setWorkingDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  useEffect(() => {
    setAction_typeAdd(context.userData.action_types.indexOf("Add"));
    setAction_typeEdit(context.userData.action_types.indexOf("Edit"));

    // console.log("action_typeAdd*****************",action_typeAdd);
    // console.log("action_typeEdit*****************",action_typeEdit);
  }, []);

  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={Platform.OS == "ios" ? Colors.primary : Colors.white}
      />
      {routeName === "Home" ? null : (
        <View style={styles.headerContainer}>
          {props.hideArrowBack == true ? (
            <View style={styles.headerLeft}></View>
          ) : (
            <>
              {props.backArrowDisable == true ?
                <Ionicons
                  name="close"
                  size={26}
                  color={Colors.white}
                />
                :

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={routeName === "Home" ? null : gotoBack}
                  style={styles.headerLeft}
                >
                  {routeName === "Home" ? null : (
                    <>
                      {props.drowerIcon == true ? (
                        <TouchableOpacity onPress={props.onPress_drowerIcon}>
                          <FontAwesome
                            name="navicon"
                            size={24}
                            color={Colors.white}
                          />
                        </TouchableOpacity>
                      ) : (
                        <>
                        {props.backArrowDisable == undefined ?
                        <Ionicons
                          name="arrow-back"
                          size={26}
                          color={Colors.white}
                        />
                        :
                        <Ionicons
                  name="close"
                  size={26}
                  color={Colors.white}
                />}
                </>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              }
            </>
          )}

          {routeName === "Home" ? (
            <View></View>
          ) : (
            // <TouchableOpacity
            // style={{flex: 1, backgroundColor: '#fff', height: 30, justifyContent: 'center', paddingLeft: 10, borderRadius: 2}}
            // onPress={() => props.navigation.navigate("SearchScreen")}
            // activeOpacity={0.8}
            // >
            // 	<Text>Search</Text>
            // </TouchableOpacity>
            <View style={[styles.headerMiddle, {}]}>
              <TouchableOpacity onPress={props.onPress_title} activeOpacity={1}>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ fontSize: 20, color: Colors.white }}
                  >
                    {props.title}
                  </Text>
                  {props.walletAmount != null ? (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontSize: 18,
                        color: Colors.white,
                        marginLeft: 10,
                      }}
                    >
                      ₹ {props.walletAmount}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
              {props.datePicker ? (
                <>
                  {props.date != null ? (
                    <TouchableOpacity onPress={showDatepicker}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          fontSize: 18,
                          color: Colors.white,
                          marginLeft: 10,
                          alignItems: "center",
                        }}
                      >
                        {props.date}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </>
              ) : (
                <>
                  {props.date != null ? (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontSize: 18,
                        color: Colors.white,
                        marginLeft: 10,
                        alignItems: "center",
                      }}
                    >
                      {props.date}
                    </Text>
                  ) : null}
                </>
              )}
            </View>
          )}

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={workingDate}
              mode={"date"}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}

          {routeName !== "Home" ? (
            <View style={styles.headerRight}>
              {/* {typeof props.searchIcon !== "undefined" ? (
						<TouchableOpacity
							activeOpacity={0.5}
							onPress={()=>props.navigation.navigate("SearchScreen")}
							style={{ padding: 5 }}
						>
							<Ionicons name="search" size={20} color={Colors.white} />
						</TouchableOpacity>
					) : null} */}

              {props.showHome == false ? null : (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={gotoHome}
                  style={{ padding: 5 }}
                >
                  <FontAwesome name="home" size={22} color={Colors.white} />
                </TouchableOpacity>
              )}
              {props.Event == "Event" ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={props.gotoEvent}
                  style={{ padding: 5 }}
                >
                  <FontAwesome
                    name="calendar-o"
                    size={20}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              ) : null}
              {props.Parts == "Parts" ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={props.gotoParts}
                  style={{ padding: 5 }}
                >
                  <FontAwesome name="list" size={20} color={Colors.white} />
                </TouchableOpacity>
              ) : null}
              {props.Communications == "Communications" ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={props.gotoCommunications}
                  style={{ padding: 5 }}
                >
                  <Ionicons name="call" size={20} color={Colors.white} />
                </TouchableOpacity>
              ) : null}

              {action_typeEdit >= 0 ? (
                <>
                  {props.editAction && (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={props.editAction}
                      style={{ padding: 5 }}
                    >
                      <MaterialIcons
                        name="mode-edit"
                        size={20}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  )}
                </>
              ) : null}

              {action_typeAdd >= 0 ? (
                <>
                  {typeof props.addAction !== "undefined" ? (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={props.addAction}
                      style={{ padding: 5 }}
                    >
                      <AntDesign
                        name="pluscircleo"
                        size={20}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  ) : null}
                </>
              ) : null}
              {props.search == true ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={props.gotoSearch}
                  style={{ padding: 5 }}
                >
                  <Ionicons
                    name="search-outline"
                    size={20}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              ) : null}
              {/* {props.delete == "delete" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.deleteItem}
                style={{ padding: 5 }}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.white} />
              </TouchableOpacity>
            ) : null} */}

              {typeof props.filterdata !== "undefined" ? (
                <Menu
                  ref={menuRef}
                  onRequestClose={hideMenu}
                  visible={visible}
                  anchor={
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={showMenu}
                      style={{ padding: 5 }}
                    >
                      <Ionicons name="filter" size={20} color={Colors.white} />
                    </TouchableOpacity>
                  }
                >
                  <>
                    {(props.menuItems || []).map((item, index) => {
                      // console.log("........menuItems..........",item)
                      return (
                        <MenuItem
                          key={index}
                          onPress={() => onMenuItemChange(item)}
                          disabled={props.selectedMenuItem === item}
                          disabledTextColor={Colors.grey}
                        >
                          {item}
                        </MenuItem>
                      );
                    })}
                  </>
                </Menu>
              ) : null}

              {typeof props.sortAction !== "undefined" ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={props.sortAction}
                  style={{ padding: 5 }}
                >
                  <MaterialIcons name="sort" size={22} color={Colors.white} />
                </TouchableOpacity>
              ) : null}
              {/* {typeof props.export !== "undefined" ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={props.exportAction} 
                style={{ padding: 5 }}
              >
              <AntDesign name="export" size={22} color={Colors.white} />
              </TouchableOpacity>
            ) : null} */}
              {typeof props.exportData !== "undefined"
                ? props.exportData(props.exportItems, props.exportGamedata,props.eventModal)
                : null}
              {props.delete == "delete" ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={props.deleteItem}
                  style={{ padding: 5, marginRight: 3 }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              ) : null}

              {props.onSave /* !== "undefined" */ ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={props.onSave}
                  style={{ padding: 5 }}
                >
                  <MaterialCommunityIcons
                    name="content-save"
                    size={20}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
        </View>
      )}
    </>
  );
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    paddingHorizontal: 5,
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    width: "10%",
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerMiddle: {
    width: "58%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  headerRight: {
    minWidth: "15%",
    maxWidth: "32%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  searchModalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth,
    height: windowHeight,
  },
  seacrhModalContainer: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: Colors.white,
  },
  searchModalHeader: {
    height: 50,
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.primary,
    elevation: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerBackBtnContainer: {
    width: "20%",
    height: 50,
    paddingLeft: 8,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitleContainer: {
    width: "60%",
    height: 50,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.white,
    alignSelf: "center",
  },
  searchModalBody: {
    flex: 1,
    height: windowHeight - 50,
    padding: 8,
  },
  searchInputBox: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  textInput: {
    borderWidth: 1,
    width: "93%",
    height: "100%",
    marginLeft: 5,
    paddingLeft: 5,
    fontSize: 14,
    color: Colors.textColor,
  },

  autocompleteContainer: {
    //flex: 1,
    //left: 0,
    //position: 'absolute',
    //right: 0,
    //top: 0,
    //zIndex: 1,
    //width: "100%",
    height: 45,
    padding: 10,
    //borderWidth: 1,
    //borderColor: Colors.primary,
    //borderRadius: 4,
    //flexDirection: "row",
    //alignItems: "center",
    //paddingHorizontal: 5,
    color: Colors.textColor,
  },

  listItem: {
    flexDirection: "row",
    borderBottomColor: Colors.textInputBorder,
    borderBottomWidth: 1,
    padding: 10,
  },
  left: {
    width: "20%",
    justifyContent: "center",
  },
  middle: {
    justifyContent: "center",
    flex: 1,
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
  },
});

export default Header;
