import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "native-base";
import AnimatedLoader from "react-native-animated-loader";

const Empty = ({ onRequestClose }) => {
  return (
    <View style={itemstyles.container}>
      <View style={itemstyles.detailsContainer}>
        <AnimatedLoader
          visible={true}
          overlayColor="rgba(255,255,255,1)"
          source={require("../../loaders/empty-and-lost.json")}
          animationStyle={lottieStyles.lottie}
          speed={2}
          style={{ height: 100 }}
          onRequestClose={onRequestClose}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              borderRadius: 40,
              backgroundColor: "#E6E6E6",
              paddingHorizontal: 10,
              height: 30,
            }}
          >
            <Text style={{ fontSize: 12 }}>
              {"Nothing Found"}
            </Text>
          </View>
        </AnimatedLoader>
      </View>
    </View>
  );
};

const itemstyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    flex: 1,
  },
  detailsContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  title: {
    fontWeight: "500",
    fontSize: 18,
    paddingVertical: 5,
  },
  subTitle: {
    color: "#6e6969",
    fontSize: 12,
  },
});

const lottieStyles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 200,
  },
});

export default Empty;
