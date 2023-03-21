import React, { Component } from "react";
import {
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Text,
} from "native-base";
import Colors from "../../config/colors";

export default class SalaryHeader extends Component {
  constructor(props) {
    super();
  }

  render() {
    const {
      onPress,
      title,
      secondOnpressShow = true,
      secondOnpress,
      secondTitle,
    } = this.props;

    return (
      <Header
        style={{ backgroundColor: Colors.primary }}
        androidStatusBarColor={Colors.primary}
      >
        <Left>
          <Button transparent onPress={onPress}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>{title}</Title>
        </Body>
        {secondOnpressShow && (
          <Right>
            <Button transparent onPress={secondOnpress}>
              <Text>{secondTitle}</Text>
            </Button>
          </Right>
        )}
      </Header>
    );
  }
}
