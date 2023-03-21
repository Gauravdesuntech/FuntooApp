import React, { Component } from "react";
import { StyleSheet, View ,Text,} from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons';

const dateToTimeStamp = (date) => {
  const myDate = date.split("-");
  const newDate = myDate[1] + "/" + myDate[0] + "/" + myDate[2];
  const tStamp = new Date(newDate).getTime();
  return tStamp;
};

export default HeaderSection = ({ title, incomeSum, expenseSum, transferSum }) => {
  const timeStamp = dateToTimeStamp(title);
  const d = new Date(timeStamp);
  const fullYear = d.getFullYear();
  const shortYear = fullYear.toString().substr(-2);
  const date = ("0" + d.getDate()).slice(-2);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = days[d.getDay()];
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
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
  return (
    <View style={styles.header}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 5,
        }}
      >
        <View style={{ flexDirection: "column", width: 80 }}>
          <Text style={{fontSize: 14}}>{`${date}/${monthName}/${shortYear}`}</Text>
          <Text style={styles.headerDateYear}>{`${dayName}`}</Text>
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            width: 80,
          }}
        >
          <Text style={{ color: "#00B386" }}>
          <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
            {`${incomeSum}`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            width: 80,
          }}
        >
          <Text style={{ color: "#323edd" }}>
          <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
            {`${transferSum}`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            width: 80,
          }}
        >
          <Text style={{ color: "#3a3535" }}>
          <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
            {`${expenseSum}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 50,
    borderColor: "#ccc",
    borderBottomWidth: 1,
  },
  headerDate: {
    fontSize: 32,
    fontWeight: "900",
  },
  headerDateYear: {
    color: "#fff",
    backgroundColor: "tomato",
    fontSize: 10,
    padding: 2,
    borderRadius: 5,
    width: 75,
    textAlign: "center",
  },
});
