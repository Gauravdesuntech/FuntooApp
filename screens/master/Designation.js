import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import EmptyScreen from "../../components/EmptyScreen";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import Colors from "../../config/colors";
import { GetDesignation } from "../../services/APIServices";
import AppContext from "../../context/AppContext";

export default class Designation extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      DesignationList: [],
      isLoading: true,
      refreshing: false,
    };
  }
  getRoles=()=>{
	GetDesignation()
	.then((response) => {
	  // console.log("response....................", response);
	  this.setState({ DesignationList: response ,
		isLoading:false});
	})
	.catch((error) => {
	  console.log(error);
	});
}
  componentDidMount() {
	this.focusListner = this.props.navigation.addListener("focus", () => { this.getRoles() })
  }
  componentWillUnmount() {
    this.focusListner();
  }

  renderEmptyContainer = () => {
    return <EmptyScreen />;
  };

  editRole=(item)=>{
    if(this.context.userData.action_types.indexOf('Edit') >= 0 )
	{this.props.navigation.navigate("AddDesignationMaster",{
data:item,
	})}
  }

  renderListItem = ({ item }) => {
    return (	
      <TouchableOpacity 
	  style={[styles.card
	  ,{ backgroundColor: "white" }]}
	  onPress={()=>this.editRole(item)}
	  >
        <Text style={{color:Colors.textColor,fontSize:16}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  onRefresh = () => {
    this.setState({ refreshing: true }, () => { this.getRoles()});
  };
  gotoAddDesignation = () =>{
   if( this.context.userData.action_types.indexOf('Add') >= 0 )
   { this.props.navigation.navigate("AddDesignationMaster",{
		data:null,
	})}}


  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Designations" addAction={this.gotoAddDesignation} />
		{this.state.isLoading ?
		<Loader />
		:
        <FlatList
          data={this.state.DesignationList}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={this.renderListItem}
          ListEmptyComponent={this.renderEmptyContainer()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
			
          }
        />
  }
      </SafeAreaView>
    );
  }
}

const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  card: {
	width: windowWidth-10,
	padding: 10,
	backgroundColor: Colors.white,
    borderBottomWidth:0.6,
    borderBottomColor: Colors.lightGrey,
	margin: 5,
},
});
