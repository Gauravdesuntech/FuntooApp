/*
*
* move and modify from cashflow app
* updated by - Rahul Saha
* updated on - 14.02.23
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
  FlatList,
  SafeAreaView
} from "react-native";
import colors from "../../../../config/colors";
import { showDateAsClientWant } from "../../../../utils/Util";
import moment from "moment";
import {  AntDesign,} from '@expo/vector-icons';

class ExpandableItemComponent extends Component {
  //Custom Component for the Expandable List
  constructor(props) {
    super();
    this.state = {
      active: false,
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          active: true,
        };
      });
    } else {
      this.setState(() => {
        return {
          active: false,
        };
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.active !== nextState.active) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <ScrollView>
        {/*Header of the Expandable List Item*/}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.item.subcategory.length > 0 ? this.props.onClickFunction : this.props.onCatPressed.bind(this, this.props.item)}
          style={[
            styles.header,
            { width: "100%", borderBottomWidth: 1, borderColor: "#ccc" },
            this.props.item.isExpanded == true ? styles.activeBackground : styles.inactiveBackground,
          ]}
        >
          <Text style={[styles.headerText, this.props.item.isExpanded == true ? styles.activeColor : styles.inactiveColor]}>{this.props.item.category_name}</Text>
        </TouchableOpacity>
        <View
          style={{
            overflow: "hidden",
          }}
        ></View>
      </ScrollView>
    );
  }
}

export default class SubCategory extends Component {
  //Main View defined under this Class
  constructor(props) {
    super(props);
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      newCat: null,
      listDataSource: props.categoryData,
      catPresed: props.onCatPress,
      heading: props.heading,
      userType: props.userType,
      navigation: props.navigation,
      permission: props.permission,
      screen: props.screen,
      subproject: props.subproject,
      project: props.project,
      extraData: []
    };
  }

  getOrderStatus = (current_status) => {
    if (current_status == 'pending') {
      return (
        <Text style={styles.desc}>
          Status:  <Text style={{ color: 'red' }}>Pending</Text>
        </Text>
      )
    }
    if (current_status == 'review') {
      return (
        <Text style={styles.desc}>
          Status:  <Text style={{ color: 'red' }}>Review</Text>
        </Text>
      )
    }
    if (current_status == 'request_confirmation') {
      return (
        <Text style={styles.desc}>
          Status:  <Text style={{ color: 'red' }}>Request Confirmation</Text>
        </Text>
      )
    }

    if (current_status == 'confirmed') {
      return (
        <Text style={styles.desc}>
          Status:  <Text style={{ color: 'green' }}>Confirmed</Text>
        </Text>
      )
    }

    if (current_status == 'declined') {
      return (
        <Text style={styles.desc}>
          Status:  <Text style={{ color: 'red' }}>Declined</Text>
        </Text>
      )
    }
    if (current_status == 'closed') {
      return (
        <Text style={styles.desc}>
          Status:  <Text style={{ color: 'red' }}>Closed</Text>
        </Text>
      )
    }


    if (current_status == 'ongoing') {
      return (
        <Text style={styles.desc}>
          Status:  <Text>Ongoing</Text>
        </Text>
      )
    }

    if (current_status == 'completed') {
      return (
        <Text style={styles.desc}>
          Status:  <Text style={{ color: Colors.primary }}>Completed</Text>
        </Text>
      )
    }
  }

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.categoryData.length != state.listDataSource.length) {
      return {
        newCat: null,
        listDataSource: props.categoryData,
        catPresed: props.onCatPress,
        heading: props.heading,
        userType: props.userType,
        navigation: props.navigation,
        permission: props.permission,
        subproject: props.subproject,
        project: props.project,
        screen: props.screen
      }
    }
    return null
  }

  filterSubCat = (i) => {
    //console.log("I================>", i)
    const arrayy = [...this.state.listDataSource];
    arrayy.map((value, placeindex) =>
      placeindex === i
        ? this.setState({ newCat: value })
        :
        //  console.log("None=========>")
        null
    );
  };
  pressercat = (value, extradata) => {
    console.log('.....null subcat...Presed.........');
    this.state.catPresed.bind(this, value, extradata)
  }

  updateLayout = (index) => {
    this.filterSubCat(index);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.listDataSource];
    this.setState({ extraData: array[index] });
    //For Single Expand at a time
    array.map((value, placeindex) => {
      if (placeindex === index) {
        // if (!value.subcategory.length > 0 ) {
        //  this.pressercat(value, array[index])
        // }
        // else {
        return (array[placeindex]["isExpanded"] = !array[placeindex]["isExpanded"])
        // }
      } else {
        return (array[placeindex]["isExpanded"] = false)
      }
      // return (placeindex === index
      //   ? (array[placeindex]["isExpanded"] = !array[placeindex]["isExpanded"])
      //   : (array[placeindex]["isExpanded"] = false))

    }
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
    const { listDataSource, newCat, catPresed, heading, navigation, screen, subproject, project } = this.state;
    // console.log('.............this.props............',this.props);
    // console.log('.............listDataSource............', listDataSource);
    return (
      <>
        {listDataSource != "" ? (
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: colors.primary,
              }}
            >
              <Text style={styles.topHeading}>{this.state.heading}</Text>
              {this.state.permission == "Yes" ? (
                <TouchableOpacity
                  style={{
                    paddingVertical: 5,
                    paddingRight: 15,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    this.state.navigation.navigate(screen);
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
                  <AntDesign name="edit" size={20} color="white" />
                </TouchableOpacity>
              ) : null}
            </View>

            {this.state.subproject != true ?
              <>
                {project == true ?
                  <SafeAreaView>
                    <ScrollView>
                      {listDataSource.map((item, key) => (

                        <TouchableOpacity
                          key={key}
                          style={styles.content}
                          onPress={catPresed.bind(this, item, this.state.extraData)}
                        >
                          <Text style={styles.text}>{item.val}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </SafeAreaView>
                  :
                  <SafeAreaView style={{ flexDirection: "row", flex: 1 }}>
                    <View
                      style={{
                        width: "50%",
                        borderColor: "#ccc",
                        borderRightWidth: 1,
                      }}
                    >
                      <FlatList
                        data={listDataSource}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                          <ExpandableItemComponent
                            key={item.category_name}
                            onClickFunction={this.updateLayout.bind(this, index)}
                            onCatPressed={catPresed}
                            item={item}
                          />
                        )}
                      />
                    </View>
                    <View style={{ width: "50%"}}>
                      {newCat != null ? (
                        <ScrollView>
                          {newCat.subcategory.map((item, key) => (
                            <>
                              <TouchableOpacity
                                key={key}
                                style={styles.content}
                                onPress={catPresed.bind(this, item, this.state.extraData)}
                              >
                                {/* <Image
                            style={{ width: 25, height: 25 }}
                            source={{
                              uri: `http://funtoogames.com/cashflowdev/uploads/icon/${item.image}`,
                            }}
                          /> */}
                                <View state={{padding:5}}>
                                  <Text style={styles.newtext}>{item.val}</Text>
                                  {/* <Text style={styles.newtext}>{item.data.customer_name}</Text> 
                                   <Text style={styles.newtext}>{item.data.venue}</Text>
                                  <Text style={styles.newtext}>{moment(item.data.event_start_timestamp).format("DD/MM/YY")}</Text> */}
                                </View>
                              </TouchableOpacity>
                            </>
                          ))}
                        </ScrollView>
                      ) : null}
                    </View>
                  </SafeAreaView >
                }
              </>
              :
              <SafeAreaView>

                <ScrollView>
                  {listDataSource.map((item, key) => (
                    <>
                      {item != null ?
                        // <TouchableOpacity
                        //   key={key}
                        //   style={styles.content}
                        //   onPress={catPresed.bind(this, item, this.state.extraData)}
                        // >
                        //   <Text style={styles.text}>{item.data.order_id}</Text>
                        //   <Text style={styles.text}>{item.data.customer_name}</Text>
                        // </TouchableOpacity>
                        <TouchableOpacity
                          key={key}
                          style={styles.new_content}
                          onPress={catPresed.bind(this, item, this.state.extraData)}
                        >
                          {/* <Text style={styles.desc}>Order id: {item.data.order_id}</Text>
                          <Text style={styles.desc}>{"Venue: " + item.data.venue}</Text>
                          <Text style={styles.desc}>{"Event Date: "}{showDateAsClientWant(item.data.event_start_timestamp)}</Text>
                          <Text style={styles.desc}>
                            {"Client Name: " + (item.data.customer_name !== null ? item.data.customer_name : "")}
                          </Text> */}
                             <Text style={styles.desc}>{item.val}</Text>
                          {this.getOrderStatus(item.data.order_status)}
                        </TouchableOpacity>
                        : null}
                    </>
                  ))}
                </ScrollView>

              </SafeAreaView>
            }
          </View>
        ) : (
          <View style={styles.container}>
            <View
              style={{
                justifyContent: "space-between",
                backgroundColor: "#273238",
              }}
            >
              <Text style={styles.topHeading}>{this.state.heading}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              {/* <Bullets active listSize={5} /> */}
            </View>
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
    color: "#fff",
  },
  header: {
    height: 45,
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
  newtext: {
    fontSize: 15,
    color: "#606070",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 6,
    height: 45,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  new_content: {
    paddingLeft: 6,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  activeBackground: {
    backgroundColor: colors.primaryOpacity
  },
  inactiveBackground: {
    backgroundColor: colors.white
  },
  inactiveColor: {
    color: colors.medium
  },
  activeColor: {
    color: colors.primary
  },
  desc: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 3,
    fontWeight: "normal",
  },
});
