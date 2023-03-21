import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import HeaderSection from "./Header";
import Items from "./Item";

export default class ExpandableItemComponent extends Component {
  //Custom Component for the Expandable List
  constructor(props) {
    //console.log("Expendable Component ---------->", props)
    super();
    this.state = {
      layoutHeight: 0,
      navigation: props.navigation,
      projects: props.projects,
      subprojects: props.subprojects,
      payMethod: props.payMethod,
      catContent: props.catContent,
      loggedInUser: props.loggedInUser,
      userList: props.userList,
    };
  }

  async componentDidMount() {
    const { navigation } = this.state;
  }

 
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }

  render() {
    const {
      navigation,
      projects,
      subprojects,
      payMethod,
      catContent,
      userList,
      loggedInUser,
    } = this.state;

    return (
      <View>
        {/*Header of the Expandable List Item*/}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={styles.header}
        >
          <HeaderSection
            title={this.props.title}
            incomeSum={this.props.totalIncome}
            expenseSum={this.props.totalExpense}
            transferSum={this.props.totalTransfer}
          />
        </TouchableOpacity>
        <View
          style={{
            height: this.state.layoutHeight,
            overflow: "hidden",
          }}
        >
          {/*Content under the header of the Expandable List Item*/}
          {this.props.item.data.map((item, key) => {
            //console.log("Item------------>", item)
            
            return (
            <View key={key} style={styles.content}>
              <Items
                title={item}
                navigation={navigation}
                catData={catContent}
                userList={userList}
                loggedInUser={loggedInUser}
                balanceAcc={loggedInUser}
                projects={projects}
                subprojects={subprojects}
                payMethod={payMethod}
              />
              <View style={styles.separator} />
            </View>
          )})}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F5FCFF",
    paddingVertical: 16,
    paddingHorizontal: 4
  },
  separator: {
    height: 1,
    backgroundColor: "#fff",
    width: "95%",
    marginLeft: 16,
    marginRight: 16,
  },
  content: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
});
