import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import { Dropdown } from 'react-native-element-dropdown';
import AppContext from "../../context/AppContext";
import Colors from "../../config/colors";
import Header from "../../components/Header";
import { addDefaultManager, getDefaultManager, Getemployee } from '../../services/APIServices';
import OverlayLoader from '../../components/OverlayLoader';


export default class AddDefaultManager extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
    this.state = {
      employee: [],
      empl_name: null,
      empl_id: null,
      empl_number: null,
      loader: false
    }
  }

  componentDidMount() {
    this.getEmployee();
    this.GetDefaultManager();
  }

  getEmployee = () => {
    this.setState({ loader: true })
    Getemployee()
      .then((response) => {
        let Data = response.map((item) => {
          return {
            id: item.id,
            name: item.name,
            phone: item.phone,
          };
        });
        this.setState({ employee: Data });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => { this.setState({ loader: false }) })
      ;
  };

  GetDefaultManager = () => {
    this.setState({ loader: true })
    getDefaultManager()
      .then((response) => {
        this.setState({
          empl_name: JSON.parse(response[0].value).manager_name,
          empl_id: JSON.parse(response[0].value).manager_id,
          empl_number: JSON.parse(response[0].value).manager_number,
        })
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => { this.setState({ loader: false }) })
      ;
  };


  gotoBack = () => this.props.navigation.goBack();

  SetManager = (empl) => {
    this.setState({
      empl_name: empl.name,
      empl_id: empl.id,
      empl_number: empl.phone,
    });
  };

  AddManager = () => {
    if (this.state.empl_name == null && this.state.empl_id == null) {
      alert('select any manager')
    }
    else{
      let data = {
        manager_name: this.state.empl_name,
        manager_id: this.state.empl_id,
        manager_number: this.state.empl_number,
      }
      this.setState({ loader: true })
      addDefaultManager(data)
        .then((res) => {
          this.gotoBack()
        })
        .catch(() => { })
        .finally(() => {
          this.setState({ loader: false })
        })
    }
  }


  render() {
    return (
      <View >
        <Header title={'Manager Settings'} />
        {this.state.loader ? <OverlayLoader /> :
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLable}>Default Manager :</Text>
              <Dropdown
                value={this.state.empl_name}
                data={this.state.employee}
                onChange={(empl) => this.SetManager(empl)}
                style={styles.textInput}
                inputSearchStyle={styles.inputSearchStyle}
                // placeholderStyle={styles.textInput}
                // selectedTextStyle={styles.textInput}
                search
                labelField="name"
                valueField="id"
                placeholder={
                  !this.state.empl_name
                    ? "Select Manager"
                    : this.state.empl_name
                }
                searchPlaceholder="Search..."
              />

              {this.state.ModulePermissionsValidationFailed ? (
                <Text style={{ color: "red" }}>
                  Choose atleast one Module Permissions
                </Text>
              ) : null}
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={() => this.AddManager()}>


              <Text style={{ fontSize: 18, color: Colors.white }}> Save </Text>

            </TouchableOpacity>
          </>
        }
      </View>
    )
  };
}



const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginTop: "5%"
  },
  form: {
    flex: 1,
    padding: 8,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
    padding: 8,
  },
  inputLable: {
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 10,
    // opacity: 0.8,
  },
  textInput: {
    padding: 9,
    fontSize: 14,
    width: "100%",
    borderRadius: 4,
    borderColor: Colors.textInputBorder,
    backgroundColor: Colors.textInputBg,
  },
  submitBtn: {
    marginTop: 15,
    height: 50,
    width: "95%",
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginHorizontal: "3%"

  },

})
