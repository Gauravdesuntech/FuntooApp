import React, { Component } from "react";
import { StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Picker,
  Icon,
  Button,
  Label,
  Spinner,
  Left,
  Body,
  Right,
  Title,
} from "native-base";
import AuthService from "../../services/CashFlow/Auth";
import Loader from "../../components/Loader";
import DateTimePicker from "@react-native-community/datetimepicker";

class AddProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parentProjectId: "",
      projectType: "1",
      isParent: 1,
      projectStatus: "1",
      projectName: null,
      projectDescription: null,
      projectStartDate: new Date().toDateString(),
      projectEndDate: new Date().toDateString(),
      date: new Date(),
      parentProject: null,
      userAccount: [],
      visible: true,
      spinner: false,
      mode: "date",
      show1: false,
      show2: false,
    };
  }

  componentDidMount() {
    this.getParentProject();
    this.getLoggedinUser();
  }

  async getParentProject() {
    let result = await AuthService.getParentProjects();
    if (result.status == "1") {
      this.setState({ visible: false, parentProject: result.parentProject });
    }
  }

  async getLoggedinUser() {
    let result = await AuthService.getAccount();
    this.setState({ userAccount: result });
  }

  onProjectTypeChange(value) {
    this.setState({
      projectType: value,
    });
  }

  onProjectStatusChange(value) {
    this.setState({
      projectStatus: value,
    });
  }

  onParentProjectIdChange(value) {
    this.setState({
      parentProjectId: value,
    });
  }

  //Project Start Date
  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    this.setState({ show1: Platform.OS === "ios" });
    this.setState({ projectStartDate: currentDate.toDateString() });
  };

  showMode = (currentMode) => {
    this.setState({ show1: true, mode: currentMode });
  };

  showDatepicker = () => {
    this.showMode("date");
  };

  //Project End Date
  onChange1 = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    this.setState({ show2: Platform.OS === "ios" });
    this.setState({ projectEndDate: currentDate.toDateString() });
  };

  showMode1 = (currentMode) => {
    this.setState({ show2: true, mode: currentMode });
  };

  showDatepicker1 = () => {
    this.showMode1("date");
  };

  addProject = async () => {
    this.setState({
      spinner: true,
    });
    const str = this.state.projectStartDate;
    const projectStartDate = str.replace(/ /g, "-");

    const str2 = this.state.projectEndDate;
    const projectEndDate = str2.replace(/ /g, "-");
    if (this.state.projectName == "" || this.state.projectName == null) {
      alert("Project name required");
      this.setState({
        spinner: false,
      });
      return null;
    }
    let result = await AuthService.createProject(
      this.state.projectName,
      this.state.projectDescription,
      projectStartDate,
      projectEndDate,
      this.state.projectStatus,
      this.state.projectType,
      this.state.parentProjectId,
      this.state.userAccount.user_code
    );
    if (result.status == 1) {
      this.setState({
        spinner: false,
      });
      Alert.alert(
        "Successfully",
        "Project Created Successfully",
        [
          {
            text: "OK",
            onPress: () => {
              this.refreshState();
            },
          },
        ],
        { cancelable: false }
      );
    } else if (result.status == 2) {
      this.setState({
        spinner: false,
      });
      alert("Project with same name already exhist");
    } else {
      this.setState({
        spinner: false,
      });
      alert("Failed to create project");
    }
  };

  refreshState() {
    this.setState({
      projectName: null,
      projectDescription: null,
      projectStartDate: new Date().toDateString(),
      projectEndDate: new Date().toDateString(),
      projectStatus: "1",
      projectType: "1",
      parentProjectId: "",
      visible: true,
      spinner: false,
    });
    this.getParentProject();
  }

  render() {
    const {
      visible,
      spinner,
      projectName,
      projectDescription,
      projectStartDate,
      projectEndDate,
      parentProject,
      parentProjectId,
      projectStatus,
      show1,
      show2,
      mode,
      date,
    } = this.state;
    //console.log("projectStartDate------------>", projectStartDate)
    return (
      <Container>
        <Header
          androidStatusBarColor="#00B386"
          style={{ backgroundColor: "#00B386" }}
        >
          <Left>
            <Button
              transparent
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            {/* <Title>Add Projects</Title> */}
          </Body>
          <Right></Right>
        </Header>
        {visible ? (
          <Loader visibility={true} />
        ) : (
          <Content contentContainerStyle={styles.container}>
            <Form style={{ margin: 0, padding: 0 }}>
              <Item stackedLabel style={{ margin: 0, padding: 0 }}>
                <Label>Project Name</Label>
                <Input
                  onChangeText={(val) => {
                    this.setState({ projectName: val });
                  }}
                  value={projectName ? projectName : null}
                />
              </Item>
              <Item stackedLabel style={{ margin: 0, padding: 0 }}>
                <Label>Project Description</Label>
                <Input
                  placeholder="Project Description"
                  onChangeText={(val) => {
                    this.setState({ projectDescription: val });
                  }}
                  value={projectDescription ? projectDescription : null}
                />
              </Item>
              <Item stackedLabel style={{ margin: 0, padding: 0 }}>
                <Label>Start Date</Label>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ show1: true });
                  }}
                  style={{
                    width: "100%",
                    paddingTop: 10,
                    justifyContent: "flex-end",
                  }}
                >
                  <Text style={{ fontSize: 18 }}>
                    {projectStartDate ? projectStartDate : projectStartDate}
                  </Text>
                </TouchableOpacity>
              </Item>

              <Item stackedLabel style={{ margin: 0, padding: 0 }}>
                <Label>End Date</Label>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ show2: true });
                  }}
                  style={{
                    width: "100%",
                    paddingTop: 10,
                    justifyContent: "flex-end",
                  }}
                >
                  <Text style={{ fontSize: 18 }}>
                    {projectEndDate ? projectEndDate : null}
                  </Text>
                </TouchableOpacity>
              </Item>
              <Item stackedLabel>
                <Label>Is it a sub-project?</Label>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: "100%" }}
                  placeholder="Project Type"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.projectType}
                  onValueChange={this.onProjectTypeChange.bind(this)}
                >
                  <Picker.Item label="No" value="1" />
                  <Picker.Item label="Yes" value="0" />
                </Picker>
              </Item>
              {this.state.projectType == "0" ? (
                <Item stackedLabel>
                  <Label>Select Main Project</Label>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: "100%" }}
                    placeholder="Select Category"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={this.state.parentProjectId}
                    onValueChange={this.onParentProjectIdChange.bind(this)}
                  >
                    {parentProject.map((item, i) => {
                      return (
                        <Picker.Item
                          label={`${item.name}`}
                          key={`${item.id}`}
                          value={`${item.id}`}
                        />
                      );
                    })}
                  </Picker>
                </Item>
              ) : null}
              <Item stackedLabel>
                <Label>Status</Label>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: "100%" }}
                  placeholder="Sub Category?"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.projectStatus}
                  onValueChange={this.onProjectStatusChange.bind(this)}
                >
                  <Picker.Item label="Inactive" value="0" />
                  <Picker.Item label="Active" value="1" />
                  <Picker.Item label="Complete" value="2" />
                </Picker>
              </Item>

              <Button style={styles.button} onPress={this.addProject}>
                {spinner ? (
                  <Spinner />
                ) : (
                  <Text style={styles.buttonText}> Submit </Text>
                )}
              </Button>
            </Form>

            {show1 && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={this.onChange.bind(this)}
              />
            )}

            {show2 && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={this.onChange1.bind(this)}
              />
            )}
          </Content>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#00B386",
    padding: 10,
    marginBottom: 10,
    marginTop: 30,
    justifyContent: "center",
    width: "90%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddProjects;
