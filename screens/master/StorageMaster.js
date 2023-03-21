import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableHighlight,
	Image,
	FlatList,SafeAreaView,
	RefreshControl,
	Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import Configs from "../../config/Configs";
import { StorageAreaList,DeleteStorageArea } from "../../services/StorageAreaApiService";
import Loader from "../../components/Loader";
import ProgressiveImage from "../../components/ProgressiveImage";
import EmptyScreen from "../../components/EmptyScreen";
import AppContext from "../../context/AppContext";

export default class StorageAreaMaster extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
		  strageList: [],
		  isLoading: true,
		  refreshing: false,
		};
	  }
	
	  componentDidMount = () => {
		  this.loadStorageList();
		this.focusListner = this.props.navigation.addListener("focus",()=>{this.loadStorageList()})	
	  };

	  componentWillUnmount() {
		this.focusListner();
	  }
	
	  loadStorageList = () => {
		this.setState({isLoading: true}) 
		this.getStorageData();
	  };

	  getStorageData = () => {
		StorageAreaList()
		.then((response) => {
		  this.setState({
			strageList: response.data,
			isLoading: false,
			refreshing: false,
		  });
		})
		.catch((err) => {
		  console.log(err);
		});
	  }

	onRefresh = () => {
		this.setState({refreshing: true},()=>{this.getStorageData()})
	} 
	
	
	DeleteStorageArea = (id) => {
		if(this.context.userData.action_types.indexOf('Delete') >= 0 )
        {Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this storage area?",
            [
              {
                text: "Yes",
                onPress: () => {
                    DeleteStorageArea({id:id}).then(res => {
                        if(res.is_success){
                            this.getStorageData();
                        }
            
                    }).catch((error) => {
                        Alert.alert("Server Error", error.message);
                    })
                },
              },
              {
                text: "No",
              },
            ]
          )}
    }

	gotoEditArea = (item) =>{
		if(this.context.userData.action_types.indexOf('Edit') >= 0 ){
		this.props.navigation.navigate("EditStorageMaster", { area_id: item.id, area_name: item.name })}
	}
	
	
	gotoAddStorage = () =>{ 
		if(this.context.userData.action_types.indexOf('Add') >= 0 ){
		this.props.navigation.navigate("AddStorageMaster")}
		;}

	renderEmptyContainer=()=> {
		return(
			<EmptyScreen/>
		)
	}

	renderListItem = ({ item }) => {
		let url = '';
		if(item.image != ''){
			 url = Configs.CATEGORY_IMAGE_URL + item.image;
		}else{
			 url = 'https://www.osgtool.com/images/thumbs/default-image_450.png';
		}
		
		return(
		<>
		{
		<TouchableHighlight
			underlayColor={Colors.textInputBg}
			onPress={this.gotoEditArea.bind(this, item)}
			onLongPress={this.DeleteStorageArea.bind(this, item.id)}
		>
			<View style={styles.listItem}>
				<View style={styles.middle}>
					<Text style={styles.name}>{item.name}</Text>
				</View>
				<View style={styles.right}>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textInputBorder}
              />
            </View>
			</View>
		</TouchableHighlight>
		}
		</>
	)};

	render = () => {
		return(
		<SafeAreaView style={styles.container}>
			<Header title="Storage Area" addAction={this.gotoAddStorage} />
			{this.state.isLoading ? (
				<Loader />
			) : (
				<FlatList
				data={this.state.strageList}
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
			)}
			
		</SafeAreaView>
	);}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
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
		paddingLeft: 10
	},
	right: {
		flexDirection: "row",
		justifyContent: "flex-end",
		alignItems: "center",
	},
	image: {
		width: "100%",
		height: 40,
	},
	name: {
		fontSize: 18,
		color: Colors.textColor,
	},
	qtyContainer: {
		height: 25,
		width: 25,
		borderRadius: 100,
		backgroundColor: Colors.primary,
		justifyContent: "center",
		alignItems: "center",
		padding: 3,
	  },
	  qty: {
		fontSize: 14,
		color: Colors.white,
		textAlign: "center",
	  },
});
