import React, { useState,useEffect } from "react";
import { View, StyleSheet, TouchableOpacity,Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../../Header";
const MainHeader = React.memo(
  ({
    style,
    navigation,
    account,
    balanceAcc,
    workingDate = new Date(),
    setWorkingDate,
  }) => {
    // if (account == null) {
    //   return null;
    // }

    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === "ios");
      setWorkingDate(currentDate);
    };

    const showDatepicker = () => {
      setShow(true);
    };

    const d = new Date(workingDate);
    const fullYear = d.getFullYear();
    const shortYear = fullYear.toString().substr(-2);
    const date = ("0" + d.getDate()).slice(-2);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    const month_names_short = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = month_names_short[d.getMonth()];
    const dayName = days[d.getDay()];

    const account_name = account.name;
    const finalName =
      account_name[0].toUpperCase() + account_name.substring(1).toLowerCase();

      useEffect(()=>{
alert('home...')
      },[])

    return (
      <View>
        {console.log(workingDate)}
        <View androidStatusBarColor="#00B386" style={style.mainHeader}>
          <View style={style.headerButton}>
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={() => {
                navigation.navigate("ChangePayMethod", {
                  account: account,
                  balanceAcc: balanceAcc,
                });
              }}
            >
              <View style={{ alignSelf: "flex-start" }}>
                {/* <Icon name="ios-menu" style={style.whiteColor} /> */}
              </View>
              {/* <AccountPicker /> */}
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                paddingBottom: 5,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignSelf: "center",
                  flex: 1,
                  paddingLeft: 10,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}
                >{`${finalName}`}</Text>
                <Text style={{ color: "#fff", paddingLeft: 15 }}>
                  ({`${account.amount}`})
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={showDatepicker}>
                  <Text style={{ color: "#fff", paddingLeft: 15, fontSize: 14 }}>
                    {`${date}-${monthName}-${shortYear} (${dayName})`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={workingDate}
            mode={"date"}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
      // <Header 
      //  title={"CashFlow Home"}
      // search={false}/>
    );
  }
);

export default MainHeader;
