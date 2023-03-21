/*
 *
 *search game for wishlist
 *created by - Rahul Saha
 *created on -29.11.22
 *
 */

 import React from "react";
 import {
   View,
   StyleSheet,
   Text,
   TouchableHighlight,
   SafeAreaView,
   Dimensions,
   TouchableOpacity,
   Image,
   ScrollView,
   Alert,
   TextInput,
   FlatList,
   ActivityIndicator,
 } from "react-native";
 import Colors from "../config/colors";
 import Header from "../components/Header";
 import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
 import Configs from "../config/Configs";
 import Autocomplete from "react-native-autocomplete-input";
 import { SearchAllType } from "../services/GameApiService";
 import GamesForTagAndSubCat from "../components/GamesForTagAndSubCat";
 import CachedImage from "expo-cached-image";
 import { addWishList } from "../services/WishlistService";
 import Loader from "../components/Loader";
 import AppContext from "../context/AppContext";
 import AwesomeAlert from "react-native-awesome-alerts";
 
 export default class Wishlist_GameSearch extends React.Component {
   static contextType = AppContext;
   constructor(props) {
     super(props);
     this.searchInput = React.createRef();
     this.state = {
       list: [],
       query: "",
       searchValue: "",
       isSearching: false,
       wishlist_id: this.props?.route?.params?.data.id,
       loading: false,
       showAlertModal: false,
       alertMessage: "",
       alertType: "",
       selectedGameIds: [],
       selectedGames: [],
     };
   }
 
   componentDidMount = () => {
     setTimeout(() => {
       // console.log(this.searchInput.current, this.props.route.params.autofocus)
       if (this.searchInput.current) {
         this.searchInput.current.focus();
       }
       this.setState({
         counter: this.state.counter + 2,
       });
     }, 500);
   };
 
   renderSearchItem = ({ item }) => {
    console.log('.....item.......',item)
     let url =
       item.search_type == "game"
         ?  item.image
         :  item.image;
     if (item.search_type == "tag") {
       url = Configs.UPLOAD_PATH + item.image;
     }
     return (
       <TouchableHighlight
         // onPress={() => this.addToWishlist(item.id)}
         onPress={() => this.onPressGameItem(item.id,item)}
         underlayColor={Colors.textInputBg}
       >
         <View style={styles.listItem}>
           <View style={styles.left}>
             <CachedImage
               style={styles.image}
               source={{ uri: url }}
               resizeMode="contain"
               cacheKey={`${item.image}+${item.name}`}
               placeholderContent={
                 <ActivityIndicator
                   color={Colors.primary}
                   size="small"
                   style={{
                     flex: 1,
                     justifyContent: "center",
                   }}
                 />
               }
             />
           </View>
           <View style={styles.middle}>
             <Text style={{ fontFamily: "serif" }}>
               {item.name}
               {/* {item.name} ({item.search_type.toString().replace("_", " ")}) */}
             </Text>
           </View>
           <View style={styles.right}>
             {/* <Ionicons
               name="chevron-forward"
               size={20}
               color={Colors.textInputBorder}
             /> */}
 
             <MaterialCommunityIcons
               name={
                 this.isElementPresentInArray(
                   this.state.selectedGameIds,
                   item.id
                 )
                   ? "checkbox-marked"
                   : "checkbox-blank-outline"
               }
               size={26}
               color={Colors.primary}
             />
           </View>
         </View>
       </TouchableHighlight>
     );
   };
 
   liveSearch = (value) => {
     this.setState({ query: value });
     SearchAllType(value)
       .then((res) => {
         if (res.is_success) {
           this.setState({ list: res.data, isSearching: false });
         } else {
           this.setState({ list: [], isSearching: false });
         }
       })
       .catch((error) => {
         this.setState({ list: [], isSearching: false });
         Alert.alert("Server Error", error.message);
       });
   };
 
   hideAlert = () => {
     this.setState({
       showAlertModal: false,
     });
   };
 
   isElementPresentInArray(arr = [], searchElement = "") {
     return arr.findIndex((element) => element === searchElement) > -1;
   }
 
   onPressGameItem = (game_id,games) => {
     let tempSelectedGameIds = this.state.selectedGameIds;
     let tempSelectedGames = this.state.selectedGames;
     if (this.isElementPresentInArray(this.state.selectedGameIds, game_id)) {
       tempSelectedGameIds = tempSelectedGameIds.filter((id) => id != game_id);
       tempSelectedGames = tempSelectedGames.filter((game) => game != games);
     } else {
       tempSelectedGameIds.push(game_id);
       tempSelectedGames.push(games);
     }
 
     this.setState({ selectedGameIds: tempSelectedGameIds ,selectedGames:tempSelectedGames});
   };
 
   // addToWishlist = (game_id) => {
   addToWishlist = () => {
     let wishlist_id = this.state.wishlist_id;
     let admin_id = this.context.userData.id;
     let game_id = this.state.selectedGameIds.join(",");
 
     this.setState({ loading: true });
     addWishList({ game_id, wishlist_id, admin_id })
       .then((response) => {
         console.log('...........response..............', response);
         this.setState({ loading: false });
         if (response.is_success) {
           // this.props.navigation.navigate("Wishlist_Details", { data: this.props?.route?.params?.data })
           this.setState({
             showAlertModal: true,
             alertType: "Success",
             alertMessage: response.message,
           });
         }
         // else {
         //   this.setState({
         //     showAlertModal: true,
         //     alertType: "Success",
         //     alertMessage: response.message,
         //   });
         // }
       })
       .catch((err) => {
         console.log(err);
         this.setState({
           loading: false,
           showAlertModal: true,
           alertType: "Failed",
           alertMessage: "Something went wrong",
         });
       });
   };
 
   render = () => {
     return (
       <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
         <Header
           title="Add Game"
           search={false}
           onSave={
             this.state.selectedGameIds.length !== 0
               ? () => {
                   this.addToWishlist();
                 }
               : undefined
           }
         />
         {this.state.loading ? (
           <Loader />
         ) : (
           <View style={styles.searchModalBody}>
            {this.state.selectedGames.length > 0 ?
            <View>
              <FlatList
                   data={this.state.selectedGames}
                   keyExtractor={(item, index) => item.id.toString()}
                   renderItem={this.renderSearchItem}
                   initialNumToRender={this.state.selectedGames.length}
                   keyboardShouldPersistTaps="handled"
                   ListEmptyComponent={() => (
                     <Text style={styles.searchingText}>No Result Found</Text>
                   )}
                 />
              </View>
              :null}
             <View style={styles.searchFieldBox}>
               <Ionicons
                 name="search"
                 size={24}
                 style={{}}
                 color={Colors.textColor}
               />
               <TextInput
                 ref={this.searchInput}
                 value={this.state.searchValue}
                 onChangeText={(searchValue) =>
                   this.setState(
                     {
                       searchValue: searchValue,
                       isSearching: true,
                     },
                     () => {
                       this.liveSearch(searchValue);
                     }
                   )
                 }
                 autoCompleteType="off"
                 autoCapitalize="none"
                 placeholder={"Search"}
                 style={styles.searchField}
               />
             </View>
             {this.state.searchValue.trim().length > 0 ? (
               this.state.isSearching ? (
                 <Text style={styles.searchingText}>Searching...</Text>
               ) : (
                 <FlatList
                   data={this.state.list}
                   keyExtractor={(item, index) => item.id.toString()}
                   renderItem={this.renderSearchItem}
                   initialNumToRender={this.state.list.length}
                   keyboardShouldPersistTaps="handled"
                   ListEmptyComponent={() => (
                     <Text style={styles.searchingText}>No Result Found</Text>
                   )}
                 />
               )
             ) : null}
           </View>
         )}
 
         <AwesomeAlert
           show={this.state.showAlertModal}
           showProgress={false}
           title={this.state.alertType}
           message={this.state.alertMessage}
           closeOnTouchOutside={true}
           closeOnHardwareBackPress={false}
           showCancelButton={false}
           showConfirmButton={true}
           cancelText="cancel"
           confirmText="Ok"
           confirmButtonColor="#DD6B55"
           onCancelPressed={() => {
             this.hideAlert();
           }}
           onConfirmPressed={() => {
             this.hideAlert();
             this.props.navigation.goBack();
           }}
         />
       </SafeAreaView>
     );
   };
 }
 
 const windowWidth = Dimensions.get("screen").width;
 const windowHeight = Dimensions.get("screen").height;
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: Colors.white,
   },
 
   searchModalBody: {
     flex: 1,
     height: windowHeight - 50,
     padding: 8,
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
 
   autocompleteContainer: {
     height: 45,
     padding: 10,
     color: Colors.textColor,
   },
 
   searchFieldBox: {
     width: "100%",
     height: 40,
     marginTop: 8,
     paddingLeft: 10,
     flexDirection: "row",
     alignItems: "center",
     justifyContent: "space-between",
     borderWidth: 1,
     borderColor: "#ccc",
     borderRadius: 2,
   },
   searchField: {
     padding: 5,
     width: "90%",
     color: Colors.textColor,
     fontSize: 15,
   },
   searchingText: {
     fontSize: 12,
     color: Colors.textColor,
     opacity: 0.8,
     alignSelf: "center",
     marginTop: 20,
   },
   listItemContainer: {
     flexDirection: "row",
     paddingHorizontal: 6,
     paddingVertical: 5,
     borderBottomColor: "#ddd",
     borderBottomWidth: 1,
   },
   titleText: {
     fontSize: 14,
     fontWeight: "bold",
     color: Colors.textColor,
   },
   angelIconContainer: {
     width: "15%",
     flexDirection: "row",
     justifyContent: "flex-end",
     alignItems: "center",
   },
   rightAngelIcon: {
     fontSize: 18,
     color: "#ddd",
   },
 });
 