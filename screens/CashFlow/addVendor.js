import React, { Component } from "react";
import { StyleSheet, Text, Alert  } from "react-native";
import {
  Container,
  Header,
  Content,
  Item,
  Input,
  Picker,
  Icon,
  Button,
  Label,
  Spinner,
  Left,
  Right,
  Toast
} from "native-base";
import AuthService from "../app/Service/Auth";
import Loader from "../component/loader";

class AddVendor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentCatId: '',
      catType: 1,
      isParent: 1,
      vendorName: "",
      parentCats: [],
      userAccount: [],
      visible: true,
      spinner: false,
      vendorStatus: '1'
    };
  }

  componentDidMount() {
    this.getCategory();
    this.getLoggedinUser();
  }

  async getCategory() {
    let result = await AuthService.getCatExpense();
    if (result.status == "1") {
      this.setState({ visible: false, parentCats: result.parentCat });
    }
  }

  async getLoggedinUser() {
    let result = await AuthService.getAccount();
    this.setState({ userAccount: result });
  }

  onParentCatIdChange(value) {
    this.setState({
      parentCatId: value,
    });
  }

  onVendorStausChange(value) {
      //console.log("Vendor Status---------->", this.state.vendorStatus)
    this.setState({
      vendorStatus: value,
    });
  }

  addVendor = async () => {

    if(this.state.vendorName == ''){
        Toast.show({
          text: "Name is required",
          textStyle: { fontSize: 14 },
          duration: 700,
          position: "bottom",
          type: "danger",
        });
    }else if(this.state.vendorStatus == ''){
        Toast.show({
          text: "Status is required",
          textStyle: { fontSize: 14 },
          duration: 700,
          position: "bottom",
          type: "danger",
        });
    }else if(this.state.parentCatId == ''){
        Toast.show({
          text: "Category is required",
          textStyle: { fontSize: 14 },
          duration: 700,
          position: "bottom",
          type: "danger",
        });
    }else{


        let result = await AuthService.createVendor(
            this.state.vendorName,
            this.state.vendorStatus,
            this.state.parentCatId,
            this.state.userAccount.user_code
          );
          if (result.status == 1) {
            Toast.show({
              text: "Vendor Created Successfully",
              textStyle: { fontSize: 14 },
              duration: 3000,
              position: "bottom",
              type: "success",
            });
          } else {
            Toast.show({
              text: "Failed to create Vendor",
              textStyle: { fontSize: 14 },
              duration: 2000,
              position: "bottom",
              type: "danger",
            });
          }

    }

    
  };

  refreshState(){
    this.setState({
      parentCatId: '',
      catType: 1,
      isParent: 1,
      vendorStatus: '1',
      vendorName: "",
      parentCats: [],
      visible: true,
      spinner: false,
    })
    this.getCategory();
  }

  render() {
    const { visible, parentCats, spinner, vendorName, vendorStatus } = this.state;

    return (
      <Container>
        <Header
          androidStatusBarColor="#00B386"
          style={{ backgroundColor: "#00B386" }}
        >
          <Left>
            <Button transparent onPress={()=>{this.props.navigation.goBack()}}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          {/* <Body><Title>Add Vendor</Title></Body> */}
          <Right></Right>
          </Header>
        {visible ? (
          <Loader visibility={true} />
        ) : (
          <Content contentContainerStyle={styles.container}>
              <Item stackedLabel style={{ margin: 0, padding: 0 }}>
                <Label>Vendor Name</Label>
                <Input
                  onChangeText={(val) => {
                    this.setState({ vendorName: val });
                  }}
                  value={vendorName ? vendorName : ''}
                />
              </Item>
              

              <Item stackedLabel>
                  <Label>Select Category</Label>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: "100%" }}
                    placeholder="Select Category"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.parentCatId}
                    onValueChange={this.onParentCatIdChange.bind(this)}
                  >
                      <Picker.Item label="select category" value="" />
                  {parentCats.map((item, i) => {
                        return (
                          <Picker.Item
                            label={`${item.cat_name}`}
                            key={`${item.id}`}
                            value={`${item.id}`}
                          />
                        );
                      })}    
                    
                  </Picker>
                </Item>

              <Item stackedLabel>
                <Label>Vendor Status</Label>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: "100%" }}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.vendorStatus}
                  onValueChange={this.onVendorStausChange.bind(this)}
                >
                  <Picker.Item label="Active" value="1" />
                  <Picker.Item label="Inactive" value="0" />
                </Picker>
              </Item>
              <Button style={styles.button} onPress={this.addVendor}>
                {spinner ? (
                  <Spinner />
                ) : (
                  <Text style={styles.buttonText}> Submit </Text>
                )}
              </Button>
          </Content>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#00B386",
    padding: 10,
    marginVertical: 10,
    justifyContent: "center",
    width: '100%'
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddVendor;
