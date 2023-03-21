import React, { memo, useContext, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Alert,
  SafeAreaView,
  TextInput,
  ToastAndroid,
  Text
} from "react-native";
import { MaterialCommunityIcons, Entypo, SimpleLineIcons } from '@expo/vector-icons';
import AppContext from "../../context/AppContext";
import { Header } from "../../components";
import AuthService from "../../services/CashFlow/Auth";
import { get_wallet_permission } from "../../services/APIServices";

const ChangePayMethod = ({ navigation, route }) => {
  //console.log("Props Value===================>", navigation.getParam('accountChange'))
  // const onT = route.params.accountChange;
  // const acc = route.params.account;
  // const balanceAll = route.params.balanceAcc;
  const context = useContext(AppContext)
  const acc = context.userData;
  const [balanceAcc, setBalanceAcc] = useState([]);
  const [wallet_Permission, setWallet_Permission] = useState([]);
  // console.log("Account=========================>>", context.userData.id);

  useEffect(() => {
    let userAcc = context.userData;
    getBalanceAcc(userAcc);
    walletPermission();
  }, [balanceAcc, wallet_Permission])

  const getBalanceAcc = async (user) => {
    let acdata = await AuthService.fetchDetailsAccounts(
      user.type,
      user.cust_code
    );
    // console.log('........acdata.account........',acdata.account)
    if (acdata != "failed") {
      if (acdata.status != 0) {
        setBalanceAcc(acdata.account)
      }
    }
  };
  const walletPermission = async () => {
    await get_wallet_permission(context.userData.id).then(res => {
      if (res.is_success == true) {
        setWallet_Permission(res.data[0].ids)
      }
    }).catch(err => { })
  }

  const totalBalance = () => {
    let total = 0;
    balanceAcc.map((item) => {
      total = Number(total) + Number(item.amount);
    });
    return total;
  };

  const itemPressed = (val, logedin) => {
    // console.log("Item Pressed=============>", val)
    // console.log("Logged In person is an===========>", logedin.type)
    navigation.push("AccountDetailsScreen", { data: val, account: logedin });
  };

  const Head = ({ total }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log("View");
        }}
      >
        <View
          style={{
            padding: 15,
            flexDirection: "row",
            backgroundColor: "#fff",
          }}
        >
          <View style={{ marginRight: 15 }}>
            <SimpleLineIcons name="globe" size={20} color="black" />
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text>{"Company"}</Text>
            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
              }}
            >
              <Text>
                <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
                {`${total}`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const Item = ({ item, onTouch, account, identifier }) => {
    return (
      <TouchableOpacity
        key={identifier.toString()}
        onPress={() => {
          onTouch(item, account);
        }}
      >
        <View
          style={{
            padding: 15,
            flexDirection: "row",
            backgroundColor: "#fff",
            marginBottom: 5,
          }}
        >
          <View style={{ marginRight: 15 }}>
            <Entypo name="wallet" size={20} color="black" />
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text>{item.name}</Text>

            <View
              style={{
                flex: 1,
                alignItems: "flex-end",
              }}
            >
              <Text>
                <MaterialCommunityIcons name="currency-inr" size={20} color="black" />
                {item.amount == null ? 0 : `${item.amount}`}
              </Text>
            </View>

          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <View
        androidStatusBarColor="#00B386"
        style={{ backgroundColor: "#00B386" }}
      >
        <View>
          <TouchableOpacity
            transparent
            onPress={() => {
              navigation.goBack();
            }}
          >
           <Entypo name="cross" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          <Text>Select Account</Text>
        </View>
        <View></View>
      </View> */}
      <Header title={"Select Account"} />
      <View>
        {/* {acc.type == "admin" || acc.type == "mgmt" ? ( */}
        <>
          <Head total={totalBalance()} />
          <View style={styles.border}>
            <Text style={{ fontSize: 14, height: 30 }}>Included in Total</Text>
          </View>
        </>
        {/*  ) : null} */}
        {context.userData.type == 'admin' ?
          <>
            {balanceAcc.map((item, i) => {
              // console.log("Item==================>", i)
              return (
                <Item
                  item={item}
                  onTouch={(item, ac) => {
                    itemPressed(item, ac);
                  }}
                  account={acc}
                  identifier={i}
                  key={i.toString()}
                />
              );
            })}
          </>
          :
          <>
            {balanceAcc.filter((element) =>
              (wallet_Permission || []).includes(element.cust_code)).map((item, i) => {
                // console.log("Item==================>", item)
                return (
                  <Item
                    item={item}
                    onTouch={(item, ac) => {
                      itemPressed(item, ac);
                    }}
                    account={acc}
                    identifier={i}
                    key={i.toString()}
                  />
                );
              })}
          </>
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    // marginTop: StatusBar.currentHeight
  },
  border: {
    marginHorizontal: 20,
    marginTop: 5
  }
});

export default memo(ChangePayMethod);
