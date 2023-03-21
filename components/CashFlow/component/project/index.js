
/*
*
* move and modify from cashflow app
* updated by - Rahul Saha
* updated on - 24.11.22
*
*/


/*Example of Expandable ListView in React Native*/
import React, { Component } from "react";
//import react in our project
import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
//import basic react native components
import { Icon } from "native-base";
import colors from "../../../../config/colors";
class ExpandableItemComponent extends Component {
  //Custom Component for the Expandable List
  constructor(props) {
    super();
    this.state = {
      layoutHeight: 0,
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <View>
        {/*Header of the Expandable List Item*/}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={[
            styles.header,
            { width: "100%", borderBottomWidth: 1, borderColor: "#ccc" },
          ]}
        >
          <Text style={styles.headerText}>{this.props.item.category_name}</Text>
        </TouchableOpacity>
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: "hidden",
          }}
        ></View>
      </View>
    );
  }
}

export default class Category extends Component {
  //Main View defined under this Class
  constructor({ categoryData, onCatPress, heading, userType, navigation, permission, screen }) {
    //console.log("category data=====================>", categoryData);
    super();
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      newCat: null,
      listDataSource: categoryData,
      catPresed: onCatPress,
      heading: heading,
      userType: userType,
      navigation: navigation,
      permission: permission,
      screen: screen
    };
  }

  filterSubCat = (i) => {
    //console.log("I================>", i)
    const arrayy = [...this.state.listDataSource];
    arrayy.map((value, placeindex) =>
      placeindex === i
        ? this.setState({ newCat: value })
        : 
        // console.log("None=========>")
        null
    );
  };

  updateLayout = (index) => {
    this.filterSubCat(index);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.listDataSource];
    //For Single Expand at a time
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]["isExpanded"] = !array[placeindex]["isExpanded"])
        : (array[placeindex]["isExpanded"] = false)
    );

    //For Multiple Expand at a time
    //array[index]['isExpanded'] = !array[index]['isExpanded'];
    this.setState(() => {
      return {
        listDataSource: array,
      };
    });
  };

  render() {
    const {heading, userType, navigation, permission, screen} = this.state;
    return (
      <>
        {this.state.listDataSource != null ? (
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: colors.primary,
              }}
            >
              <Text style={styles.topHeading}>{heading}</Text>
              {userType.type == "admin" && permission == 'Yes' ? (
                <TouchableOpacity
                  style={{
                    paddingVertical: 5,
                    paddingRight: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    navigation.navigate(screen);
                  }}
                >
                  {/* <Icon
                    active
                    name="edit"
                    type="AntDesign"
                    style={{
                      color: "#fff",
                      fontSize: 20,
                    }}
                  /> */}
                </TouchableOpacity>
              ) : null}
            </View>
            <ScrollView contentContainerStyle={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "50%",
                  borderColor: "#ccc",
                  borderRightWidth: 1,
                }}
              >
                {this.state.listDataSource.map((item, key) => (
                  <ExpandableItemComponent
                    key={item.category_name}
                    onClickFunction={this.updateLayout.bind(this, key)}
                    onCatPressed={this.state.catPresed}
                    item={item}
                  />
                ))}
              </View>
              <View style={{ width: "50%" }}>
                {this.state.newCat != null ? (
                  <View>
                    {this.state.newCat.subcategory.map((item, key) => (
                      <>
                        <TouchableOpacity
                          key={key}
                          style={styles.content}
                          onPress={this.state.catPresed.bind(this, item)}
                        >
                          <Image
                            style={{ width: 25, height: 25 }}
                            source={{
                              uri: `http://stage.cablinkdigital.in/money-lover/uploads/icon/${item.image}`,
                            }}
                          />
                          <Text style={styles.text}>{item.val}</Text>
                        </TouchableOpacity>
                      </>
                    ))}
                  </View>
                ) : null}
              </View>
            </ScrollView>
          </View>
        ) : (
          <View style={[styles.container, { justifyContent: "center" }]}>
            <Text style={{ alignSelf: "center" }}>{"No Data Found"}</Text>
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topHeading: {
    paddingLeft: 10,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: colors.primary,
    color: '#fff'
  },
  header: {
    backgroundColor: "#fff",
    height: 40,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 15,
    fontWeight: "500",
    paddingLeft: 15,
  },
  separator: {
    height: 0.5,
    backgroundColor: "#808080",
    width: "95%",
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 15,
    color: "#606070",
    padding: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 6,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
