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

const OrderDaily = React.memo(
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


    const DATA = data;
    // console.log("Data for daily list==========>", DATA);

    const windowwidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("screen").height;
    const renderEmptyContainer = () => {
      return (
        <View style={{ height: windowHeight }}>
          <EmptyScreen />
        </View>
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
    //    console.log(`===========item========>`, item)

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
                        <View style={{ alignContent: "space-around", }}>
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
                          : null}
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
                        <View
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

                        </View>
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
                          <View style={{ alignContent: "space-around", }}>
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
                            : null}
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
                          <View
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

                          </View>
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
                          <View style={{ alignContent: "space-around", }}>
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
                            : null}
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
                          <View
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

                          </View>
                        </View>

                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingHorizontal: 10, }}>
                          <View style={{ alignContent: "space-around", }}>
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
                            : null}
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
                          <View
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

                          </View>
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
      <View style={[style.scene]}>
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

          <View style={{ marginBottom: '10%',width:windowwidth,backgroundColor: '#f5f5f5',height:windowHeight/1.35, }}>
       
            <SectionList
              sections={DATA}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={renderEmptyContainer()}
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
            />
          </View>
   

      </View>
    );
  },

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
export default OrderDaily;