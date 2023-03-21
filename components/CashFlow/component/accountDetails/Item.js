import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity ,Text,} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons';

export default Items = ({
  title,
  navigation,
  catData,
  userList,
  loggedInUser,
  balanceAcc,
  projects,
  subprojects,
  payMethod,
}) => {
  let route;
  {
    title.type_name.toLowerCase() == "expense"
      ? (route = 1)
      : title.type_name.toLowerCase() == "transfer"
      ? (route = 2)
      : (route = 0);
  }
  // console.log(`navigation===================>`, navigation)
  return (
    <>
      {title != null || title != undefined ? (
        <>
          {title.trans_type == "dr" && title.type_name == "Transfer" ? (
            <TouchableOpacity
              style={[styles.item, { height: 40 }]}
              // onPress={() => {
              //   navigation.push("TestScreen", {
              //     id: title.id,
              //     data: title,
              //     categoryData: catData,
              //     userList: userList,
              //     keyRoute: route,
              //     account: loggedInUser,
              //     balanceAcc: loggedInUser,
              //     receiverName: title.received_person_name,
              //     receiverUserID: title.received_on_account,
              //     transaction_id: title.transaction_id,
              //     projects: projects,
              //     payMethod: payMethod,
              //   });
              // }}
            >
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
                     <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
                      {`${title.amount}`}
                    </Text>
                  ) : title.type_name == "Transfer" ? (
                    <Text style={{ color: "#323edd" }}>
                     <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
                      {`${title.amount}`}
                    </Text>
                  ) : (
                    <Text style={{ color: "#00B386" }}>
                      <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
                      {`${title.amount}`}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ) : title.type_name.toLowerCase() == "income" ? (
            <TouchableOpacity
              // onPress={() => {
              //   navigation.navigate("IncomeEdit", {
              //     id: title.id,
              //     data: title,
              //     categoryData: catData,
              //     userList: userList,
              //     keyRoute: route,
              //     account: loggedInUser,
              //     balanceAcc: loggedInUser,
              //     transaction_id: title.transaction_id,
              //     projects: projects,
              //     subprojects: subprojects,
              //     payMethod: payMethod,
              //   });
              // }}
              style={[styles.item, { height: 40 }]}
            >
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
                      <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
                      {`${title.amount}`}
                    </Text>
                  ) : title.type_name == "Transfer" ? (
                    <Text style={{ color: "#323edd" }}>
                      <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
                      {`${title.amount}`}
                    </Text>
                  ) : (
                    <Text style={{ color: "#00B386" }}>
                      <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
                      {`${title.amount}`}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              // onPress={() => {
              //   navigation.navigate("ExpenseEdit", {
              //     id: title.id,
              //     data: title,
              //     categoryData: catData,
              //     userList: userList,
              //     keyRoute: route,
              //     account: loggedInUser,
              //     balanceAcc: loggedInUser,
              //     transaction_id: title.transaction_id,
              //     projects: projects,
              //     subprojects: subprojects,
              //     payMethod: payMethod,
              //   });
              // }}
              style={[styles.item, { height: 40 }]}
            >
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
                    <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
                      {`${title.amount}`}
                    </Text>
                  ) : title.type_name == "Transfer" ? (
                    <Text style={{ color: "#323edd" }}>
                      <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
                      {`${title.amount}`}
                    </Text>
                  ) : (
                    <Text style={{ color: "#00B386" }}>
                     <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
                      {`${title.amount}`}
                    </Text>
                  )}
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

const styles = StyleSheet.create({
  item: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: "100%",
  },
});
