/*
 *
 *create wishlist suggestion for users
 *created by - Rahul Saha
 *created on -29.11.22
 *
 */

 import React, { useEffect, useState, useRef, useContext } from "react";
 import {
   SafeAreaView,
   View,
   Text,
   Modal,
   StyleSheet,
   Dimensions,
   TouchableOpacity,
   TextInput,
   ActivityIndicator,
   TouchableHighlight,
   FlatList,
   ScrollView,
   Alert,
 } from "react-native";
 import { Header } from "../components";
 import Colors from "../config/colors";
 import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
 import { SearchAllType } from "../services/GameApiService";
 import Configs from "../config/Configs";
 import CachedImage from "expo-cached-image";
 import {
   WishlistCategory,
   addWishList,
   WishlistCategoryCreate,
   WishlistCategoryDelete,
   send_wishlist_to_user,
 } from "../services/WishlistService";
 import AppContext from "../context/AppContext";
 import { useFocusEffect } from "@react-navigation/native";
 import EmptyScreen from "../components/EmptyScreen";
 import { GetSortCustomers } from "../services/OrderService";
 import Loader from "../components/Loader";
 
 export default function Wishlist_Suggestion(props) {
   const context = useContext(AppContext);
   const searchInput = useRef();
   const [loading, setLoading] = useState(false);
   const [isModalShow, setIsModalShow] = useState(false);
   const [cat_name, setCat_name] = useState("");
   const [counter, setCounter] = useState();
   const [query, setQuery] = useState("");
   const [selectedGameId, setSelectedGameId] = useState("");
   const [list, setList] = useState([]);
   const [categoryList, setCategoryList] = useState([]);
   const [userList, setUserList] = useState([]);
   const [isSearching, setIsSearching] = useState(false);
   const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);
   const [searchValue, setSearchValue] = useState("");
   const [wishList, setWishList] = useState([]);
   const [shareWishlist_id, setShareWishlist_id] = useState("");
   const [search_user, setSearch_user] = useState("");
   const [search_Data, setSearch_Data] = useState("");
 
   /*
    *
    *useFocusEffect for focus listene
    *created by - Rahul Saha
    *created on -29.11.22
    *
    */
 
   useFocusEffect(
     React.useCallback(() => {
       setTimeout(() => {
         if (searchInput.current) {
           searchInput.current.focus();
         }
         setCounter(counter + 2);
       }, 500);
       Wishlist_Category();
       SortCustomers();
       setIsOpenCategoryModal(false);
       return () => {};
     }, [])
   );
 
   /*
    *
    *get all user
    *created by - Rahul Saha
    *created on -29.11.22
    *
    */
   const SortCustomers = () => {
     setLoading(true);
     GetSortCustomers()
       .then((response) => {
         setUserList(response);
         setSearch_Data(response);
         setLoading(false);
       })
       .catch((err) => {
         Alert.alert("Warning", "Network error");
         setLoading(false);
       });
   };
 
   /*
    *
    *open wishlist list modal and save to wishlist
    *created by - Rahul Saha
    *created on -29.11.22
    *
    */
 
   const AddWishlist = (item) => {
     // console.log('...................',item.id);
     setSelectedGameId(item.id);
     // setIsOpenCategoryModal(true);
     setIsModalShow(true);
   };
 
   /*
    *
    *delete wishlist
    *
    *created by - Rahul Saha
    *created on -30.11.22
    *
    */
 
   const Delete = (id) => {
     Alert.alert(
       "Are your sure?",
       "Are you sure you want to remove this category?",
       [
         {
           text: "Yes",
           onPress: () => {
             WishlistCategoryDelete({ id: id })
               .then((res) => {
                 if (res.is_success) {
                   Wishlist_Category();
                 }
               })
               .catch((error) => {
                 Alert.alert("Server Error", error.message);
               });
           },
         },
         {
           text: "No",
         },
       ]
     );
   };
 
   const Wishlist_Category = () => {
     setLoading(true);
     WishlistCategory(context.userData.id)
       .then((response) => {
         setCategoryList(response.data);
         // console.log('..........................', response);
         setLoading(false);
       })
       .catch((err) => {
         Alert.alert("Warning", "Network error");
         setLoading(false);
       });
   };
 
   const WishlistCategoryCreateAdmin = () => {
     let model = {
       name: cat_name,
       admin_id: context.userData.id,
       game_id: selectedGameId,
     };
     setLoading(true);
     WishlistCategoryCreate(model)
       .then((res) => {
         setWishList(res.data);
         setLoading(false);
         console.log("...........res........", res);
         if (res.is_success) {
           Wishlist_Category();
           setIsModalShow(false);
           setCat_name("");
         } else {
           setLoading(false);
           console.log("......error..........");
         }
       })
       .catch((error) => {
         Alert.alert("Server Error", error.message);
       });
   };
 
   const sendToUser = (customer_id, customer_name) => {
     // console.log('.........customer_id..........',customer_id);
     // console.log('.........wishlist_id..........',shareWishlist_id);
     let data = {
       id: shareWishlist_id,
       customer_id: customer_id,
     };
     send_wishlist_to_user(data)
       .then((res) => {
         console.log("..........res...........", typeof res);
         console.log("..........res...........", res);
         alert(`wishlist send to ${customer_name} `);
       })
       .catch((err) => {});
   };
 
   const searchAlluser = (name) => {
     setSearch_user(name);
     if (name != "") {
       let data = search_Data.filter((value) =>
         value.name.toLowerCase().includes(name.toLowerCase())
       );
       setUserList(data);
     } else {
       setUserList(search_Data);
     }
   };
 
   const renderEmptyContainer = () => {
     return (
       <View style={{ height: windowHeight }}>
         <EmptyScreen />
       </View>
     );
   };
 
   const renderListItem = ({ item }) => {
     let url = "";
     if (item.game_image != "") {
       url = Configs.NEW_COLLECTION_URL + item.game_image;
     } else {
       url = "https://www.osgtool.com/images/thumbs/default-image_450.png";
     }
 
     return (
       <TouchableOpacity
         underlayColor={Colors.textInputBg}
         onPress={() =>
           props.navigation.navigate("Wishlist_Details", { data: item })
         }
         onLongPress={() => Delete(item.id)}
       >
         <View style={styles.listItem}>
           <View>
             {/* <CustomImage
                             style={styles.image}
                             // source={{ uri: url }}
                         // resizeMode="cover"
                         /> */}
           </View>
           <View style={styles.middle}>
             <Text style={styles.name}>{item.name}</Text>
           </View>
           <TouchableOpacity
             style={styles.right}
             onPress={() => {
               setIsOpenCategoryModal(true);
               setShareWishlist_id(item.id);
             }}
           >
             {/* <View style={styles.qtyContainer}>
                             <Text style={styles.qty}>{item.total}</Text>
                         </View> */}
             <SimpleLineIcons
               name="share-alt"
               size={20}
               color={Colors.black}
               style={{ opacity: 0.6 }}
             />
           </TouchableOpacity>
         </View>
       </TouchableOpacity>
     );
   };
 
   return (
     <SafeAreaView style={{ flex: 1 }}>
       <Header
         title={"Wishlist Suggestion"}
         addAction={AddWishlist}
         search={false}
       />
       {loading ? (
         <Loader />
       ) : (
         <View>
           <FlatList
             data={categoryList}
             keyExtractor={(item, index) => item.id}
             renderItem={renderListItem}
             ListEmptyComponent={renderEmptyContainer()}
           />
 
           <Modal
             animationType="none"
             transparent={true}
             statusBarTranslucent={true}
             visible={isOpenCategoryModal}
           >
             <View style={styles.categoryModalOverlay}>
               <View style={styles.categoryModalContainer}>
                 <View style={styles.categoryModalHeader}>
                   <TouchableOpacity
                     style={styles.categoryCloseButton}
                     onPress={() => setIsOpenCategoryModal(false)}
                   >
                     <Ionicons
                       name="close-outline"
                       style={styles.categoryCloseButtonText}
                     />
                   </TouchableOpacity>
                   <View
                     style={{
                       backgroundColor: "lightgray",
                       marginLeft: "3%",
                       width: "87%",
                       padding: 2,
                       paddingHorizontal: 5,
                       borderRadius: 6,
                       flexDirection: "row",
                       alignItems: "center",
                       opacity: 0.6,
                     }}
                   >
                     <Ionicons
                       name="search"
                       size={20}
                       style={{}}
                       color={Colors.textColor}
                     />
                     <TextInput
                       value={search_user}
                       autoCompleteType="off"
                       autoCapitalize="words"
                       placeholder="Enter Wishlist Name"
                       style={{ width: "80%", marginLeft: "3%" }}
                       onChangeText={(name) => searchAlluser(name)}
                     />
                   </View>
                 </View>
                 <View style={styles.categoryModalBody}>
                   {/* <ScrollView> */}
                   <FlatList
                     data={userList}
                     keyExtractor={(item) => item.id}
                     renderItem={({ item }) => (
                       <View
                         style={[styles.radioItem, { alignItems: "center" }]}
                         // key={index}
                       >
                         <Text>{item.name}</Text>
                         <TouchableOpacity
                           onPress={() => sendToUser(item.id, item.name)}
                           style={{
                             width: 60,
                             height: 30,
                             backgroundColor: Colors.primary,
                             borderRadius: 10,
                           }}
                         >
                           <Text
                             style={{
                               alignSelf: "center",
                               color: Colors.white,
                               marginTop: 5,
                             }}
                           >
                             Send
                           </Text>
                         </TouchableOpacity>
                       </View>
                     )}
                     ListEmptyComponent={renderEmptyContainer()}
                   />
                 </View>
               </View>
             </View>
           </Modal>
 
           <Modal
             animationType="fade"
             transparent={true}
             statusBarTranslucent={true}
             visible={isModalShow}
             onRequestClose={() => setIsModalShow(false)}
           >
             <View style={styles.modalContainer}>
               <View style={styles.modalBody}>
                 <TouchableOpacity
                   style={styles.closeButton}
                   onPress={() => setIsModalShow(false)}
                 >
                   <Ionicons
                     name="close-outline"
                     style={styles.closeButtonText}
                   />
                 </TouchableOpacity>
 
                 <TextInput
                   value={cat_name}
                   autoCompleteType="off"
                   autoCapitalize="words"
                   placeholder="Enter Wishlist Name"
                   style={styles.textInput}
                   onChangeText={(cat_name) => setCat_name(cat_name)}
                 />
 
                 <TouchableOpacity
                   onPress={() => WishlistCategoryCreateAdmin()}
                   style={[
                     styles.btn,
                     { backgroundColor: Colors.primary, marginTop: 10 },
                   ]}
                 >
                   <Ionicons name="add" size={20} color={Colors.white} />
                   <Text style={{ fontSize: 14, color: Colors.white }}>Add</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </Modal>
         </View>
       )}
     </SafeAreaView>
   );
 }
 
 const windowWidth = Dimensions.get("screen").width;
 const windowHeight = Dimensions.get("screen").height;
 const styles = StyleSheet.create({
   modalContainer: {
     flex: 1,
     justifyContent: "center",
     alignItems: "center",
     backgroundColor: "rgba(0, 0, 0, 0.5)",
   },
   modalBody: {
     alignItems: "center",
     justifyContent: "center",
     backgroundColor: Colors.white,
     width: windowWidth - 30,
     minHeight: Math.floor(windowHeight / 5),
     padding: 15,
     borderRadius: 5,
     elevation: 8,
   },
 
   closeButton: {
     position: "absolute",
     zIndex: 11,
     top: 5,
     right: 5,
     backgroundColor: "#ddd",
     width: 25,
     height: 25,
     borderRadius: 40 / 2,
     alignItems: "center",
     justifyContent: "center",
     elevation: 0,
   },
   closeButtonText: {
     color: "#444",
     fontSize: 22,
   },
   textInput: {
     padding: 9,
     fontSize: 14,
     alignSelf: "center",
     width: "100%",
     borderWidth: 1,
     borderRadius: 10,
     borderColor: Colors.textInputBorder,
     backgroundColor: Colors.white,
   },
   btn: {
     flexDirection: "row",
     width: 150,
     height: 45,
     borderRadius: 4,
     alignItems: "center",
     justifyContent: "center",
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
   categoryModalOverlay: {
     height: windowHeight,
     backgroundColor: "rgba(0,0,0,0.2)",
     justifyContent: "flex-end",
   },
 
   categoryModalContainer: {
     backgroundColor: Colors.white,
     minHeight: Math.floor(windowHeight * 0.5),
     elevation: 5,
   },
 
   categoryModalHeader: {
     height: 50,
     flexDirection: "row",
     borderBottomWidth: StyleSheet.hairlineWidth,
     borderColor: Colors.textInputBorder,
     backgroundColor: Colors.white,
     //elevation: 1,
     alignItems: "center",
     // justifyContent: "space-between",
     paddingHorizontal: 10,
   },
 
   categoryCloseButton: {
     backgroundColor: "#ddd",
     width: 25,
     height: 25,
     borderRadius: 40 / 2,
     alignItems: "center",
     justifyContent: "center",
     elevation: 0,
   },
   categoryCloseButtonText: {
     color: Colors.textColor,
     fontSize: 22,
   },
 
   categoryModalBody: {
     flex: 1,
     paddingHorizontal: 10,
     paddingVertical: 5,
   },
   radioItem: {
     width: "100%",
     flexDirection: "row",
     justifyContent: "space-between",
     alignItems: "center",
     paddingVertical: 5,
     borderBottomWidth: 1,
     borderColor: "#eee",
     padding: 10,
   },
 });
 