import React, { memo, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Alert,
  SectionList,
  FlatList,
  Text,

} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EmptyScreen from "../../../EmptyScreen";
import Colors from "../../../../config/colors";
import moment from "moment";
// import { debounce } from 'debounce';

const Daily = React.memo(
  ({
    style,
    data,
    totalIncome,
    totalExpense,
    totalTransfer,
    total,
    ob,
    navigation,
    catData,
    userList,
    loggedinUser,
    loggedinUserBalance,
    deleteTransData,
    deleteTransCount,
    isDeleteDatatAvailable,
    projects,
    subprojects,
    payMethod,
    transferdebounce,
    workingDate,
    count,
    userAcc,
    Order_CashFlow
  }) => {
    // if (loggedinUser == null) {
    //   return null;
    // }

    const DATA = data;
    // console.log("Data for daily list==========>", DATA);

    const windowwidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("screen").height;
    const DeletedTransItem = ({ content }) => {
      return (
        <View style={[styles.item, { height: 40 }]}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "space-around",
              }}
            >
              <Text
                style={{ fontSize: 15, color: "#3a3535" }}
              >{`${content.cat_name}`}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingRight: 4,
              }}
            >
              {content.trans_type_id == "4" ? (
                <Text style={{ color: "#3a3535" }}>
                  <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                  {`${content.amount}`}
                </Text>
              ) : content.trans_type_id == "5" ? (
                <Text style={{ color: "#323edd" }}>
                  <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                  {`${content.amount}`}
                </Text>
              ) : (
                <Text style={{ color: "#00B386" }}>
                  <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                  {`${content.amount}`}
                </Text>
              )}
            </View>
          </View>
        </View>
      );
    };
    const renderEmptyContainer = () => {
      return (
        <View style={{ height: windowHeight }}>
          <EmptyScreen />
        </View>
      );
    };

    // const DataDebounce = debounce(()=>{transferdebounce},200)

    const Item = ({ title }) => {
      // console.log("Title====================>", title);
      let route;
      {
        title.type_name == "Expense"
          ? (route = 1)
          : title.type_name == "Transfer"
            ? (route = 2)
            : (route = 0);
      }
      //  console.log(`${title.type_name}===================>`, title)
      return (
        <>
          {title != null || title != undefined ? (
            <>
              {
                title.trans_type == "dr" && title.type_name == "Transfer" ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push("TransferEdit", {
                        id: title.id,
                        data: title,
                        categoryData: catData,
                        userList: userList,
                        keyRoute: route,
                        account: loggedinUser,
                        balanceAcc: loggedinUserBalance,
                        receiverName: title.received_person_name,
                        receiverUserID: title.received_on_account,
                        transaction_id: title.transaction_id,
                        projects: projects,
                        subprojects: subprojects,
                        payMethod: payMethod,
                      });
                    }}
                  >
                    <View style={[styles.item, { height: 40 }]}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: 10,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignContent: "space-around",
                          }}
                        >
                          <Text
                            style={{ fontSize: 15, color: "#3a3535" }}
                          >{`${title.cat_name}`}</Text>
                        </View>
                        {/* <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                              <Text style={{ color: '#00B386', fontSize: 8 }}>{`${title.type_name}`}</Text>
                                              <Text>{`${title.pay_method}`}</Text>
                                          </View> */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingRight: 4,
                          }}
                        >
                          {title.type_name == "Expense" ? (
                            <Text style={{ color: "#3a3535" }}>
                              <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                              {`${title.amount}`}
                            </Text>
                          ) : title.type_name == "Transfer" ? (
                            <Text style={{ color: "#323edd" }}>
                              <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                              {`${title.amount}`}
                            </Text>
                          ) : (
                            <Text style={{ color: "#00B386" }}>
                              <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                              {`${title.amount}`}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) :
                  title.type_name.toLowerCase() == "income" ? (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push("IncomeEdit", {
                          id: title.id,
                          data: title,
                          categoryData: catData,
                          userList: userList,
                          keyRoute: route,
                          account: loggedinUser,
                          balanceAcc: loggedinUserBalance,
                          transaction_id: title.transaction_id,
                          projects: projects,
                          subprojects: subprojects,
                          payMethod: payMethod,
                        });
                      }}
                    >
                      <View style={[styles.item, { height: 40 }]}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: 10,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignContent: "space-around",
                            }}
                          >
                            <Text
                              style={{ fontSize: 15, color: "#3a3535" }}
                            >{`${title.cat_name}`}</Text>
                          </View>
                          {/* <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                              <Text style={{ color: '#00B386', fontSize: 8 }}>{`${title.type_name}`}</Text>
                                              <Text>{`${title.pay_method}`}</Text>
                                          </View> */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingRight: 4,
                            }}
                          >
                            {title.type_name == "Expense" ? (
                              <Text style={{ color: "#3a3535" }}>
                                <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                                {`${title.amount}`}
                              </Text>
                            ) : title.type_name == "Transfer" ? (
                              <Text style={{ color: "#323edd" }}>
                                <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                                {`${title.amount}`}
                              </Text>
                            ) : (
                              <Text style={{ color: "#00B386" }}>
                                <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                                {`${title.amount}`}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : title.type_name.toLowerCase() == "expense" ? (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push("ExpenseEdit", {
                          id: title.id,
                          data: title,
                          categoryData: catData,
                          userList: userList,
                          keyRoute: route,
                          account: loggedinUser,
                          balanceAcc: loggedinUserBalance,
                          transaction_id: title.transaction_id,
                          projects: projects,
                          subprojects: subprojects,
                          payMethod: payMethod,
                        });
                      }}
                    >
                      <View style={[styles.item, { height: 40 }]}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: 10,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignContent: "space-around",
                            }}
                          >
                            <Text
                              style={{ fontSize: 15, color: "#3a3535" }}
                            >{`${title.cat_name}`}</Text>
                          </View>
                          {/* <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                          <Text style={{ color: '#00B386', fontSize: 8 }}>{`${title.type_name}`}</Text>
                                          <Text>{`${title.pay_method}`}</Text>
                                      </View> */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingRight: 4,
                            }}
                          >
                            {title.type_name == "Expense" ? (
                              <Text style={{ color: "#3a3535" }}>
                                <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                                {`${title.amount}`}
                              </Text>
                            ) : title.type_name == "Transfer" ? (
                              <Text style={{ color: "#323edd" }}>
                                <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                                {`${title.amount}`}
                              </Text>
                            ) : (
                              <Text style={{ color: "#00B386" }}>
                                <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                                {`${title.amount}`}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity>
                      <View style={[styles.item, { height: 40 }]}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: 10,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignContent: "space-around",
                            }}
                          >
                            <Text
                              style={{ fontSize: 15, color: "#3a3535" }}
                            >{`${title.cat_name}`}</Text>
                            <Text
                              style={{ fontSize: 15, color: "#3a3535" }}
                            >{`${title.cat_name}`}</Text>
                          </View>
                          {/* <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                            <Text style={{ color: '#00B386', fontSize: 8 }}>{`${title.type_name}`}</Text>
                                            <Text>{`${title.pay_method}`}</Text>
                                        </View> */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingRight: 4,
                            }}
                          >
                            {title.type_name == "Expense" ? (
                              <Text style={{ color: "#3a3535" }}>
                                <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                                {`${title.amount}`}
                              </Text>
                            ) : title.type_name == "Transfer" ? (
                              <Text style={{ color: "#323edd" }}>
                                <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                                {`${title.amount}`}
                              </Text>
                            ) : (
                              <Text style={{ color: "#00B386" }}>
                                <MaterialCommunityIcons name="currency-inr" size={14} color="black" />
                                {`${title.amount}`}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
            </>
          ) : (
            <View style={style.moneyDataSection}>
              <Text style={{ color: "#ccc" }}>No Data Available</Text>
            </View>
          )}
        </>
      );
    };

    const renderItem = ({ item }) => {
      let route;
      {
        item.type_name == "Expense"
          ? (route = 1)
          : item.type_name == "Transfer"
            ? (route = 2)
            : (route = 0);
      }
      //  console.log(`===========item========>`, (item.event_details))
      return (
        <>
          {item != null || item != undefined ? (
            <View style={styles.card}>
              {
               
                item.trans_type == "dr" && item.type_name == "Transfer" ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push("TransferEdit", {
                        id: item.id,
                        data: item,
                        categoryData: catData,
                        userList: userList,
                        keyRoute: route,
                        account: loggedinUser,
                        balanceAcc: loggedinUserBalance,
                        receiverName: item.received_person_name,
                        receiverUserID: item.received_on_account,
                        transaction_id: item.transaction_id,
                        projects: projects,
                        subprojects: subprojects,
                        payMethod: payMethod,
                      });
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1, paddingHorizontal: 10, }}>
                        {/* <View style={{ alignContent: "space-around", }}>
                            <Text style={{ fontSize: 15, color: "#3a3535" }}>
                              {`${item.project}`}</Text>
                          </View>
                          {item.event_details != null ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${item.event_details}`}</Text>
                            </View>
                            : null}
                          <View style={{ alignContent: "space-around", }}>
                            <Text style={{ fontSize: 15, color: "#3a3535" }}>
                              {`${item.cat_name}`}</Text>
                          </View>
                          {item.remarks != null && item.remarks != '' ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${item.remarks}`}</Text>
                            </View>
                            : null} */}
                              {item.event_details != null ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${item.event_details}`}</Text>
                            </View>
                            : null}
                         {/* {item.event_details != null ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${JSON.parse(item.event_details).customer_name}`}</Text>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${JSON.parse(item.event_details).venue}`}</Text>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${moment(JSON.parse(item.event_details).event_start_timestamp).format("DD/MM/YY")}`}</Text>
                            </View>
                            : null} */}
                      </View>
                      <View >
                        <View
                          style={{
                            flexDirection: "row",
                            alignSelf: "center",
                            paddingRight: 4,
                          }}
                        >
                          <Text style={{ fontSize: 16 }}>
                            {item.type_name == "Expense" ? (
                              <Text style={{ color: "#3a3535" }}>
                                <MaterialCommunityIcons name="currency-inr" size={16} color="#3a3535" />
                                {`${item.amount}`}
                              </Text>
                            ) : item.type_name == "Transfer" ? (
                              <Text style={{ color: "#323edd" }}>
                                <MaterialCommunityIcons name="currency-inr" size={16} color="#323edd" />
                                {`${item.amount}`}
                              </Text>
                            ) : (
                              <Text style={{ color: "#00B386" }}>
                                <MaterialCommunityIcons name="currency-inr" size={16} color="#00B386" />
                                {`${item.amount}`}
                              </Text>
                            )}
                          </Text>
                        </View>
                        {/* <View
                            style={{
                              position: 'absolute', right: 5, bottom: 0
                            }}
                          >

                            {item.type_name == "Expense" ? (
                              <Text style={{ color: "#3a3535", fontSize: 14 }}>
                                E
                              </Text>
                            ) : item.type_name == "Transfer" ? (
                              <Text style={{ color: "#323edd", fontSize: 14 }}>
                                T
                              </Text>
                            ) : (
                              <Text style={{ color: "#00B386", fontSize: 14 }}>
                                I
                              </Text>
                            )}

                          </View> */}
                      </View>

                    </View>
                  </TouchableOpacity>
                ) :
                  item.type_name.toLowerCase() == "income" ? (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push("IncomeEdit", {
                          id: item.id,
                          data: item,
                          categoryData: catData,
                          userList: userList,
                          keyRoute: route,
                          account: loggedinUser,
                          balanceAcc: loggedinUserBalance,
                          transaction_id: item.transaction_id,
                          projects: projects,
                          subprojects: subprojects,
                          payMethod: payMethod,
                        });
                      }}
                    >
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingHorizontal: 10, }}>
                          {/* <View style={{ alignContent: "space-around", }}>
                            <Text style={{ fontSize: 15, color: "#3a3535" }}>
                              {`${item.project}`}</Text>
                          </View>
                          {item.event_details != null ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${item.event_details}`}</Text>
                            </View>
                            : null}
                          <View style={{ alignContent: "space-around", }}>
                            <Text style={{ fontSize: 15, color: "#3a3535" }}>
                              {`${item.cat_name}`}</Text>
                          </View>
                          {item.remarks != null && item.remarks != '' ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${item.remarks}`}</Text>
                            </View>
                            : null} */}
                              {item.event_details != null ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${item.event_details}`}</Text>
                            </View>
                            : null}
                          {/* {item.event_details != null ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${JSON.parse(item.event_details).customer_name}`}</Text>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${JSON.parse(item.event_details).venue}`}</Text>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${moment(JSON.parse(item.event_details).event_start_timestamp).format("DD/MM/YY")}`}</Text>
                            </View>
                            : null} */}
                        </View>
                        <View >
                          <View
                            style={{
                              flexDirection: "row",
                              alignSelf: "center",
                              paddingRight: 4,
                            }}
                          >
                            <Text style={{ fontSize: 16 }}>
                              {item.type_name == "Expense" ? (
                                <Text style={{ color: "#3a3535" }}>
                                  <MaterialCommunityIcons name="currency-inr" size={16} color="#3a3535" />
                                  {`${item.amount}`}
                                </Text>
                              ) : item.type_name == "Transfer" ? (
                                <Text style={{ color: "#323edd" }}>
                                  <MaterialCommunityIcons name="currency-inr" size={16} color="#323edd" />
                                  {`${item.amount}`}
                                </Text>
                              ) : (
                                <Text style={{ color: "#00B386" }}>
                                  <MaterialCommunityIcons name="currency-inr" size={16} color="#00B386" />
                                  {`${item.amount}`}
                                </Text>
                              )}
                            </Text>
                          </View>
                          {/* <View
                            style={{
                              position: 'absolute', right: 5, bottom: 0
                            }}
                          >

                            {item.type_name == "Expense" ? (
                              <Text style={{ color: "#3a3535", fontSize: 14 }}>
                                E
                              </Text>
                            ) : item.type_name == "Transfer" ? (
                              <Text style={{ color: "#323edd", fontSize: 14 }}>
                                T
                              </Text>
                            ) : (
                              <Text style={{ color: "#00B386", fontSize: 14 }}>
                                I
                              </Text>
                            )}

                          </View> */}
                        </View>

                      </View>
                    </TouchableOpacity>
                  ) : item.type_name.toLowerCase() == "expense" ? (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push("ExpenseEdit", {
                          id: item.id,
                          data: item,
                          categoryData: catData,
                          userList: userList,
                          keyRoute: route,
                          account: loggedinUser,
                          balanceAcc: loggedinUserBalance,
                          transaction_id: item.transaction_id,
                          projects: projects,
                          subprojects: subprojects,
                          payMethod: payMethod,
                        });
                      }}
                    >
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingHorizontal: 10, }}>
                          {/* <View style={{ alignContent: "space-around", }}>
                            <Text style={{ fontSize: 15, color: "#3a3535" }}>
                              {`${item.project}`}</Text>
                          </View>
                          {item.event_details != null ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${item.event_details}`}</Text>
                            </View>
                            : null}
                          <View style={{ alignContent: "space-around", }}>
                            <Text style={{ fontSize: 15, color: "#3a3535" }}>
                              {`${item.cat_name}`}</Text>
                          </View>
                          {item.remarks != null && item.remarks != '' ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${item.remarks}`}</Text>
                            </View>
                            : null} */}
                              {item.event_details != null ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${item.event_details}`}</Text>
                            </View>
                            : null}
                          {/* {item.event_details != null ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${JSON.parse(item.event_details).customer_name}`}</Text>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${JSON.parse(item.event_details).venue}`}</Text>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${moment(JSON.parse(item.event_details).event_start_timestamp).format("DD/MM/YY")}`}</Text>
                            </View>
                            : null} */}
                        </View>
                        <View >
                          <View
                            style={{
                              flexDirection: "row",
                              alignSelf: "center",
                              paddingRight: 4,
                            }}
                          >
                            <Text style={{ fontSize: 16 }}>
                              {item.type_name == "Expense" ? (
                                <Text style={{ color: "#3a3535" }}>
                                  <MaterialCommunityIcons name="currency-inr" size={16} color="#3a3535" />
                                  {`${item.amount}`}
                                </Text>
                              ) : item.type_name == "Transfer" ? (
                                <Text style={{ color: "#323edd" }}>
                                  <MaterialCommunityIcons name="currency-inr" size={16} color="#323edd" />
                                  {`${item.amount}`}
                                </Text>
                              ) : (
                                <Text style={{ color: "#00B386" }}>
                                  <MaterialCommunityIcons name="currency-inr" size={16} color="#00B386" />
                                  {`${item.amount}`}
                                </Text>
                              )}
                            </Text>
                          </View>
                          {/* <View
                            style={{
                              position: 'absolute', right: 5, bottom: 0
                            }}
                          >

                            {item.type_name == "Expense" ? (
                              <Text style={{ color: "#3a3535", fontSize: 14 }}>
                                E
                              </Text>
                            ) : item.type_name == "Transfer" ? (
                              <Text style={{ color: "#323edd", fontSize: 14 }}>
                                T
                              </Text>
                            ) : (
                              <Text style={{ color: "#00B386", fontSize: 14 }}>
                                I
                              </Text>
                            )}

                          </View> */}
                        </View>

                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingHorizontal: 10, }}>
                          {/* <View style={{ alignContent: "space-around", }}>
                            <Text style={{ fontSize: 15, color: "#3a3535" }}>
                              {`${item.project}`}</Text>
                          </View>
                          {item.event_details != null ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${item.event_details}`}</Text>
                            </View>
                            : null}
                          <View style={{ alignContent: "space-around", }}>
                            <Text style={{ fontSize: 15, color: "#3a3535" }}>
                              {`${item.cat_name}`}</Text>
                          </View>
                          {item.remarks != null && item.remarks != '' ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${item.remarks}`}</Text>
                            </View>
                            : null} */}
                              {item.event_details != null ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${item.event_details}`}</Text>
                            </View>
                            : null}
                          {/* {item.event_details != null ?
                            <View style={{ alignContent: "space-around", }}>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${JSON.parse(item.event_details).customer_name}`}</Text>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${JSON.parse(item.event_details).venue}`}</Text>
                              <Text style={{ fontSize: 15, color: "#3a3535" }}>
                                {`${moment(JSON.parse(item.event_details).event_start_timestamp).format("DD/MM/YY")}`}</Text>
                            </View>
                            : null} */}
                        </View>
                        <View >
                          <View
                            style={{
                              flexDirection: "row",
                              alignSelf: "center",
                              paddingRight: 4,
                            }}
                          >
                            <Text style={{ fontSize: 16 }}>
                              {item.type_name == "Expense" ? (
                                <Text style={{ color: "#3a3535" }}>
                                  <MaterialCommunityIcons name="currency-inr" size={16} color="#3a3535" />
                                  {`${item.amount}`}
                                </Text>
                              ) : item.type_name == "Transfer" ? (
                                <Text style={{ color: "#323edd" }}>
                                  <MaterialCommunityIcons name="currency-inr" size={16} color="#323edd" />
                                  {`${item.amount}`}
                                </Text>
                              ) : (
                                <Text style={{ color: "#00B386" }}>
                                  <MaterialCommunityIcons name="currency-inr" size={16} color="#00B386" />
                                  {`${item.amount}`}
                                </Text>
                              )}
                            </Text>
                          </View>
                          {/* <View
                            style={{
                              position: 'absolute', right: 5, bottom: 0
                            }}
                          >

                            {item.type_name == "Expense" ? (
                              <Text style={{ color: "#3a3535", fontSize: 14 }}>
                                E
                              </Text>
                            ) : item.type_name == "Transfer" ? (
                              <Text style={{ color: "#323edd", fontSize: 14 }}>
                                T
                              </Text>
                            ) : (
                              <Text style={{ color: "#00B386", fontSize: 14 }}>
                                I
                              </Text>
                            )}

                          </View> */}
                        </View>

                      </View>
                    </TouchableOpacity>
                  )}
            </View>
          ) : (
            <View style={style.moneyDataSection}>
              <Text style={{ color: "#ccc" }}>No Data Available</Text>
            </View>
          )}
        </>
      );
    }

    return (
      <View style={[style.scene,]}>
        <View style={[style.moneySectionTop,]}>
          {Order_CashFlow == true ? null :
            <View style={{ justifyContent: "center" }}>
              <Text style={styles.moneySectionTopLabel}>OB</Text>
              <Text style={style.moneySectionTopText}>{`${ob}`}</Text>
            </View>
          }
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.moneySectionTopLabel}>IN</Text>
            <Text style={style.moneySectionTopText}>{`${totalIncome}`}</Text>
          </View>
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.moneySectionTopLabel}>TR</Text>
            <Text style={style.moneySectionTopText}>{`${totalTransfer}`}</Text>
          </View>
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.moneySectionTopLabel}>OUT</Text>
            <Text style={style.moneySectionTopText}>{`${totalExpense}`}</Text>
          </View>
          {Order_CashFlow == true ? null :
            <View style={{ justifyContent: "flex-end" }}>
              <Text style={styles.moneySectionTopLabel}>CB</Text>
              <Text style={style.moneySectionTopText}>{`${total}`}</Text>
            </View>
          }
        </View>
        {isDeleteDatatAvailable ? (
          <View style={styles.container}>
            {/* <SectionList
              sections={DATA}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => <Item title={item} />}
              removeClippedSubviews={true} // Unmount components when outside of window
              initialNumToRender={10} // Reduce initial render amount
              maxToRenderPerBatch={10} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
            // extraData={data[0].data.length}
            /> */}
            <SectionList
              sections={DATA}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={renderEmptyContainer()}
              onScrollEndDrag={() => transferdebounce(userAcc, workingDate, count + 15)}
              renderSectionHeader={({ section: { title } }) => {
                return (
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionHeaderLeft}>
                      <Text style={{ fontSize: 26, color: Colors.white }}>
                        {moment(title, "YYYY-MM-DD").format("DD")}
                      </Text>
                    </View>
                    <View style={styles.sectionHeaderRight}>
                      <Text style={{ fontSize: 16, color: Colors.white }}>
                        {moment(title, "YYYY-MM-DD").format("dddd")}
                      </Text>
                      <Text style={{ fontSize: 14, color: Colors.white }}>
                        {moment(title, "YYYY-MM-DD").format("MMMM YYYY")}
                      </Text>
                    </View>
                  </View>
                );
              }}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={this.state.refreshing}
            //     onRefresh={this.onRefresh}
            //   />
            // }
            />
          </View>
        ) : (
          <View style={{ marginBottom: '10%' }}>
            {/* <SectionList
              sections={DATA}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => {
                return <Item title={item} />;
              }}
              removeClippedSubviews={true} // Unmount components when outside of window
              initialNumToRender={10} // Reduce initial render amount
              maxToRenderPerBatch={10} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
            /> */}
            <SectionList
              sections={DATA}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={renderEmptyContainer()}
              onScrollEndDrag={() => transferdebounce(userAcc, workingDate, count + 15)}
              renderSectionHeader={({ section: { title } }) => {
                return (
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionHeaderLeft}>
                      <Text style={{ fontSize: 26, color: Colors.white }}>
                        {moment(title, "YYYY-MM-DD").format("DD")}
                      </Text>
                    </View>
                    <View style={styles.sectionHeaderRight}>
                      <Text style={{ fontSize: 16, color: Colors.white }}>
                        {moment(title, "YYYY-MM-DD").format("dddd")}
                      </Text>
                      <Text style={{ fontSize: 14, color: Colors.white }}>
                        {moment(title, "YYYY-MM-DD").format("MMMM YYYY")}
                      </Text>
                    </View>
                  </View>
                );
              }}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={this.state.refreshing}
            //     onRefresh={this.onRefresh}
            //   />
            // }
            />
          </View>
        )}

        {isDeleteDatatAvailable ? (
          <View
            style={{
              flex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: "#d92027",
                paddingVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                borderTopWidth: 2,
                borderTopColor: "#d92027",
              }}
            >
              <Text
                style={{
                  alignSelf: "flex-start",
                  paddingLeft: 10,
                  color: "#fff",
                }}
              >
                {"Deleted Transaction"}
              </Text>
              <Text
                style={{ paddingRight: 10, color: "#fff" }}
              >{`${deleteTransCount}`}</Text>
            </View>
            <FlatList
              data={deleteTransData}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => <DeletedTransItem content={item} />}
            />
          </View>
        ) : null}
      </View>
    );
  },
  // (prevProps, nextProps) => {
  //   if (prevProps.data.length > 0) {
  //     if (prevProps.data[0].data.length == nextProps.data[0].data.length) {
  //       return true; // props are equal
  //     }}
  //   return false; // props are not equal -> update the component
  // }
);
const styles = StyleSheet.create({
  container: {
    height: "60%",
    borderColor: "#ccc",
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  item: {
    paddingTop: 10,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  header: {
    borderColor: "#ccc",
    borderTopWidth: 1,
    height: 50,
  },
  headerDate: {
    fontSize: 32,
    fontWeight: "900",
  },
  headerDateYear: {
    fontSize: 8,
  },
  title: {
    fontSize: 24,
  },
  moneySectionTopLabel: {
    fontSize: 13,
    alignSelf: "center",
    color: "#7f7f7f",
  },
  listContainer: {
    padding: 8,
  },
  sectionHeader: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    backgroundColor: Colors.primary,
    marginBottom: 10,
    borderRadius: 3,
  },
  sectionHeaderLeft: {
    width: "14%",
    alignItems: "flex-end",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: Colors.white,
    paddingRight: 10,
  },
  sectionHeaderRight: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 10,
  },
  card: {
    //width: "100%",
    paddingHorizontal: 2,
    paddingVertical: 3,
    backgroundColor: Colors.white,
    borderRadius: 4,
    marginBottom: 10,
  },

});
export default Daily;