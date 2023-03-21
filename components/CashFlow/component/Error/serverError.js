import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
// import { Icon } from "native-base";
import AnimatedLoader from "react-native-animated-loader";

const ServerError = ({ onPress, onRequestClose }) => {
  return (
    <View style={itemstyles.container}>
      <View style={itemstyles.detailsContainer}>
        <AnimatedLoader
          visible={true}
          overlayColor="rgba(255,255,255,1)"
          // source={require("../../loaders/server_error.json")}
          animationStyle={lottieStyles.lottie}
          speed={2}
          style={{height: 100}}
          onRequestClose={onRequestClose}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              borderRadius: 40,
              width: 80,
              backgroundColor: "#E6E6E6",
              paddingHorizontal: 5,
              height: 30,
            }}
            onPress={onPress}
          >
            {/* <Icon type="MaterialIcons" style={{ fontSize: 16 }} name="error" /> */}
            <Text style={{ fontSize: 12, marginVertical: 10 }}>
              {"Refresh"}
            </Text>
          </TouchableOpacity>
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

export default ServerError;
