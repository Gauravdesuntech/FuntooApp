import React, { Component } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import Colors from "../config/colors";
import { Header } from "../components";
import GamesForTagAndSubCat from "../components/GamesForTagAndSubCat";
import EmptyScreen from "../components/EmptyScreen";

export default class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagList:
        this.props.route.params.tagList != null
          ? this.props.route.params.tagList
          : [],
      category_id: this.props.route.params.category_id,
      currentTagid: this.props.route.params.tag_id,
      itemPressedId: -1,
      menuItems:[
        "rent",
        //  "size",
         "Clear"],
      sort_type:'',
      sort_data:''
    };

    this.tagScrollViewRef = React.createRef();
  }

  componentDidMount() {
    if (this.state.tagList.length > 0) {
      let firstItemId = this.state.tagList[0].tag_id;
      this.setState({
        currentTagid: firstItemId,
        itemPressedId: firstItemId,
      });
    }
  }

  onMenuItemChange = (type) => {
		// console.log(".............type............>",type)

    if (this.state.sort_data || type == "rent"){
      if(type == "rent"){
        this.setState({menuItems:["Acen rent", "Dcen rent","Clear"]})
        this.setState({sort_data:type})
      }
     this.setState({sort_type:type})
    }
  //  else if (this.state.sort_data || type == "size"){
  //   if(type == "size"){
  //     this.setState({menuItems:["Acen", "Dcen","Clear"]})
  //     this.setState({sort_data:type})
  //   }
  //    this.setState({sort_type:type})
  //   }	
    else{
      this.setState({sort_data:""})
      this.setState({sort_type:""})
    }
  };

  clearData=()=>{
    // console.log('.............called..................')
    this.setState({
      sort_data:"",
    sort_type:"",
    menuItems:["rent","Clear"],
  })
  }

  toggleTab = (item) => {
    this.setState({
      currentTagid: item.tag_id,
      itemPressedId: item.tag_id,
    });
  };

  gotoAddGame = () => this.props.navigation.navigate("AddGame",{
    tagId:this.state.currentTagid,
    category_id:this.state.category_id,
  });

  render = () => {
    // console.log("...............currentTagid..................",this.state.currentTagid)
    return (
      <SafeAreaView style={styles.container}>
        <Header title="" 
        addAction={this.gotoAddGame} 
        filterdata ={true}
        menuItems={this.state.menuItems}
        onMenuItemChange={this.onMenuItemChange}
        sort_data={this.state.sort_data}
        />

        {this.state.isLoading ? (
          <Loader />
        ) : (
          <>
            {this.state.tagList.length > 0 ? (
              <View style={styles.scroll}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    flexWrap: "wrap",
                    backgroundColor: Colors.white,
                    paddingVertical: 5,
                    paddingHorizontal: 5,
                  }}
                >
                  {/* <Ionicons style={styles.icon} name="chevron-back-outline" size={26} color={Colors.white} /> */}
                  {this.state.tagList.length > 0
                    ? this.state.tagList.map((item) => {
                        return (
                          <>
                            {item.tag_name == null ? null : (
                              <TouchableOpacity
                                key={item.id}
                                onPress={this.toggleTab.bind(this, item)}
                              >
                                <View
                                  style={[
                                    styles.listItem,
                                    {
                                      backgroundColor:
                                        this.state.itemPressedId == item.tag_id
                                          ? Colors.primary
                                          : Colors.white,
                                    },
                                  ]}
                                  key={item.id}
                                >
                                  <Text
                                    style={[
                                      styles.name,
                                      {
                                        color:
                                          this.state.itemPressedId ==
                                          item.tag_id
                                            ? Colors.white
                                            : Colors.primary,
                                      },
                                    ]}
                                  >
                                    {this.state.category_id
                                      ? item.tag_name
                                      : item.name}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            )}
                          </>
                        );
                      })
                    : null}
                  {/* <Ionicons style={styles.icon} name="chevron-forward-outline" size={26} color={Colors.white} /> */}
                </ScrollView>
              </View>
            ) : (
              <EmptyScreen />
            )}

            {/* <GetGamesByTag tagId={this.state.tagId} tagName={this.state.tagName} /> */}

            {/* {
							list.map(item => {
								return <Text>{item.tag_name}</Text>
							})
						} */}
          </>
        )}

        {this.state.currentTagid && (
          <GamesForTagAndSubCat
            type={"for_tags"}
            id={this.state.currentTagid}
            tagName={this.state.tagName}
            sort_type={this.state.sort_type}
            clearData={this.clearData}
          />
        )}
      </SafeAreaView>
    );
  };
}

const windowwidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  activeTabColor: {
    backgroundColor: "red",
    padding: 5,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  icon: {
    top: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 0.6,
    borderRadius: 3,
    borderColor: Colors.primary,
    marginRight: 5,
  },
  left: {
    width: "20%",
    justifyContent: "center",
  },
  middle: {
    justifyContent: "center",
    flex: 1,
    paddingLeft: 10,
  },
  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    color: Colors.white,
  },
  scroll: {
    // backgroundColor: Colors.grey,
    // color: Colors.white,
    marginTop: 0,
  },

  galleryContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  galleryGrid: {
    width: Math.floor((windowwidth - 10) / 3),
    height: Math.floor((windowwidth - 10) / 3),
    alignItems: "center",
    justifyContent: "center",
  },
  galleryImg: {
    width: Math.floor((windowwidth - 10) / 3),
    height: Math.floor((windowwidth - 10) / 3),
    borderWidth: 2,
    borderColor: Colors.white,
  },
});
