import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import OverlayLoader from "../components/OverlayLoader";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import firebase from "../config/firebase";
import AppContext from "../context/AppContext";
import Constants from "expo-constants";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import { authenticateAdmin } from "../services/APIServices";
import AwesomeAlert from "react-native-awesome-alerts";
import { writeUserData } from "../utils/Util";
import { SetDeviceToken } from "../services/CustomerApiService";
import { getDeviceToken } from "../utils/Util";

const windowheight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("window").width;
const CELL_COUNT = 6;
const CELL_SIZE = 35;

const styles = StyleSheet.create({
  container: {
    height: windowheight + Constants.statusBarHeight,
    backgroundColor: Colors.white,
  },
  section: {
    marginTop: 60,
    paddingHorizontal: 25,
  },
  codeFiledRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: "auto",
    marginRight: "auto",
  },
  cellRoot: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: 18,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
  },
  title: {
    marginTop: 30,
    color: "#000",
    fontSize: 25,
    fontWeight: "600",
    paddingBottom: 5,
  },
  subTitle: {
    color: "#000",
    marginBottom: 30,
  },
  backImageContainer: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    width: windowwidth,
  },
  resendOtp: {
    width: 120,
    flexDirection: "row",
    marginTop: 30,
    padding: 5,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 3,
  },
  resentOtpText: {
    color: Colors.danger,
    fontWeight: "bold",
    fontSize: 16,
  },
  borderDanger: {
    borderWidth: 1,
    borderColor: Colors.danger,
  },
});

const OtpVerification = ({ route }) => {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const phoneNumber =
    typeof route.params !== "undefined" ? route.params.phoneNumber : undefined;
  const recaptchaVerifier = useRef(null);
  const [verificationToken, setVerificationToken] = useState(
    route.params.verification_token
  );
  const [value, setValue] = useState("");
  const [timerValue, setTimerValue] = useState(Configs.TIMER_VALUE);
  const [timerExpired, setTimerExpired] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertType, setAlertType] = useState("Error");
  const [alertMessage, setAlertMessage] = useState("No admin account found");
  const [otpValidationFailed, setOTPValidation] = useState(false);
  const [message, setMessage] = useState(
    "Please enter the verification code\nwe send to " +
      Configs.PHONE_NUMBER_COUNTRY_CODE +
      phoneNumber
  );

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  showAlert = () => {
    setShowAlertModal(true);
  };

  hideAlert = () => {
    setShowAlertModal(false);
  };

  const finishHandler = (value) => {
    if (value != null) {
      setValue(value);
      if (value.length === CELL_COUNT) {
        setOTPValidation(false);
        setLoaderVisible(true);
        const credential = firebase.auth.PhoneAuthProvider.credential(
          verificationToken,
          value
        );
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((result) => {
            let obj = { mobile: phoneNumber };
            authenticateAdmin(obj)
              .then((response) => {
                let data = response.data;
                // console.log(
                //   ".......response.....................",
                //   response.data
                // );
                getDeviceToken()
                  .then((token) => {
                    console.log(
                      ".............token data...called.....",
                      token.data
                    );
                    SetDeviceToken({
                      id: data.id,
                      device_token: token.data,
                    }).then((set) => {});
                  })
                  .catch((err) => {
                    console.log("..........token catch.........", err);
                  });
                if (response.check == "success") {
                  setLoaderVisible(false);
                  navigation.navigate("UserForgotPassword", {
                    id: data.id,
                  });
                } else {
                  setLoaderVisible(false);
                  setShowAlertModal(true);
                }
              })
              .catch((error) => console.log(error));
          })
          .catch((error) => {
            setLoaderVisible(false);
            setMessage("Invalid SMS code or the SMS code has been expired");
          });
      }
    }
  };

  const resendOTP = () => {
    setValue("");
    setOTPValidation(false);
    setMessage(
      "Please enter the verification code\nwe send to " +
        Configs.PHONE_NUMBER_COUNTRY_CODE +
        phoneNumber
    );
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber(
        Configs.PHONE_NUMBER_COUNTRY_CODE + phoneNumber,
        recaptchaVerifier.current
      )
      .then((token) => {
        setTimerExpired(false);
        setTimerValue(Configs.TIMER_VALUE);
        setVerificationToken(token);
      });
    setTimerExpired(false);
    setTimerValue(Configs.TIMER_VALUE);
  };

  const updateTimer = () => {
    const x = setInterval(() => {
      if (timerValue <= 1) {
        setTimerExpired(true);
      } else {
        setTimerValue(timerValue - 1);
      }
    }, 1000);
    return x;
  };

  const renderCell = ({ index, symbol, isFocused }) => {
    return (
      <View
        key={index}
        style={[
          styles.cellRoot,
          isFocused && styles.focusCell,
          otpValidationFailed ? styles.borderDanger : null,
        ]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        <Text style={styles.cellText}>
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    const timer = updateTimer();
    return () => clearInterval(timer);
  }, [timerValue]);

  return (
    <SafeAreaView style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options}
        attemptInvisibleVerification={true}
      />
      <View style={styles.section}>
        <Text style={styles.title}>Verify phone number</Text>
        <Text style={styles.subTitle}>{message}</Text>

        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={finishHandler}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFiledRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={renderCell}
        />

        {timerExpired ? (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.resendOtp}
            onPress={resendOTP}
          >
            <FontAwesome name="repeat" size={14} color={Colors.danger} />
            <Text style={styles.resentOtpText}>{" Resend OTP"}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ marginTop: 25, textAlign: "center" }}>
            {"Resend OTP in "}
            <Text style={{ color: Colors.danger }}>{timerValue + " Secs"}</Text>
          </Text>
        )}
      </View>
      <OverlayLoader visible={loaderVisible} />
      <AwesomeAlert
        show={showAlertModal}
        showProgress={false}
        title={alertType}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        cancelText="cancel"
        confirmText="Ok"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          hideAlert();
        }}
        onConfirmPressed={() => {
          hideAlert();
        }}
      />
    </SafeAreaView>
  );
};

export default OtpVerification;
