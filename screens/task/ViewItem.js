import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity, FlatList, Image,
    Alert,
} from "react-native";
import moment from "moment";

import Header from '../../components/tasks/Header'
// import Footer from '../../components/tasks/Footer'
import Priority from "../../components/tasks/AddTodo/Priority";
import Sublist from "../../components/tasks/AddTodo/Sublist";
import Upload from "../../components/tasks/AddTodo/Upload";
import DocumentUpload from "../../components/tasks/DocumentUpload";
import Theme from "../../Theme";
import { showError } from "../../actions/Error";
import { getAssignLevel, editTask, updateTaskStatus, updateTask } from '../../utils/api';
import Config from "../../config/Configs";
import AppContext from "../../context/AppContext";
import Spinner from "../../components/tasks/Spinner";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OverlayLoader from "../../components/OverlayLoader";


const individual = require('../../assets/tasks/manager.png')
const rotate = require('../../assets/tasks/Rotate.png')
const compete = require('../../assets/tasks/Compete.png')
const collaborate = require('../../assets/tasks/Collborate.png')
const critical = require('../../assets/tasks/Critical.png')
const danger = require('../../assets/tasks/Danger.png')
const low = require('../../assets/tasks/Low.png')
const moderate = require('../../assets/tasks/Moderate.png')
const high = require('../../assets/tasks/High.png')
const coins = require('../../assets/tasks/coin_1.png')
const assign = require('../../assets/tasks/management.png')
const tick = require('../../assets/tasks/greentick.png')
const wrong = require('../../assets/tasks/wrong.png')
const time = require('../../assets/tasks/Time.png')
const level1 = require('../../assets/tasks/level1.png')


let documents = []
let images = []
const preview = [
    {
        id: '1',
        title: 'Critical',
        ico: critical
    },
    {
        id: '2',
        title: '50',
        ico: coins
    },
    {
        id: '1',
        title: 'Collaborate',
        ico: collaborate
    },
    {
        id: '1',
        title: 'Level 2',
        ico: assign
    },
];

const assignees = [
    {
        id: '1',
        title: 'Ramesh',
        ico: assign
    },
    {
        id: '2',
        title: 'Suresh',
        ico: assign
    },
    {
        id: '1',
        title: 'Sherchand',
        ico: assign
    },
    {
        id: '1',
        title: 'Roshan 2',
        ico: assign
    },
];

class ViewItem extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            document: [],
            assign_level_1: [],
            assign_lvl_1_user_id: [],
            images: [],
            requirements: [],
            name: "Task Name",
            instructions: '',
            task_data: [],
            showFields: false,
            learning: '',
            loading:false,
        }
    }

    componentDidMount() {
        // console.log('...........this.props.route.params............',this.props.route.params)
       this.getViewData();
       this.focusListner = this.props.navigation.addListener("focus", () => { this.getViewData() })
	};

	componentWillUnmount() {
		this.focusListner(); 
	}
    getViewData=()=>{
        this.setState({loading:true});
        const { id } = this.props.route.params;
        editTask(id)
            .then((response) => {
                const data = response.data.data;
                // console.log("data*******", data)
                this.setState({loading:false});
                if (data) {

                    let datetime = moment(data.schedule_start + ' ' + data.schedule_time).format('ddd hh:mm A')
                    let schedule_end = '';
                    let schedule_type = '';
                    if (data.schedule_end) {
                        schedule_end = moment(data.schedule_end).format('ddd MMM')
                    }
                    if (data.schedule_weekly) {
                        schedule_type = data.schedule_weekly
                    } else if (data.schedule_monthly) {
                        schedule_type = data.schedule_monthly
                    }

                    let is_photo_proof = 'Photo Proof not requested';
                    if (data.is_photo_proof === '1') {
                        is_photo_proof = 'Photo Proof requested';
                    }

                    data.documents && data.documents.length > 0 ? documents = data.documents.map((a,i) => { return { file: Config.DOCUMENT_URL + a, name: a } }) : documents = data.documents;
                    data.photos && data.photos.length > 0 ? images = data.photos.map((a,i) => { return { image:  a, update: true } }) : [];

                    this.setState({
                        task_data: data,
                        name: data.name,
                        description: data.description,
                        priority: data.priority,
                        taskType: data.task_type,
                        sub_tasks: data.sub_tasks,
                        instructions: data.instructions,
                        assign_level_1: data.assign_level_1.split(','),
                        assign_lvl_1_user_id: data.assign_lvl_1_user_id.split(','),
                        // assign_level_2: data.assign_level_2.split(','),
                        approval: data.approval,
                        document: documents,
                        images: images,
                        learning: data?.learning ?? '',
                        task_related_to: data.task_related_to,
                        task_related_to_id: data.task_related_to_id,
                        task_related_to_name: data.task_related_to_name,
                        requirements: [
                            {
                                id: '2',
                                title: is_photo_proof,
                                ico: data.is_photo_proof === '1' ? tick : wrong
                            },
                        ]
                    })
                }
            })
            .catch(error => {showError(error)
            this.setState({loading:false});
            })
    }

    handleMarkasComplete = () => {
        const { is_photo_proof, id, learning } = this.state.task_data;
        // console.log(images);
        this.setState({loading:true});
        let newStatus = 'pending';
        if (is_photo_proof == '1') {
            // console.log(this.state.images.length, typeof is_photo_proof);
            // return
            if (this.state.images.length <= 0) {
                alert("You need to add photo proof");
                return;
            } else {
                let data = {
                    'id': id,
                    'status': newStatus,
                    'learning': this.state.learning,
                    'images': this.state.images && this.state.images.length > 0 ? this.state.images.filter(a => { if (!a.update) { return a } }) : [],
                }
                updateTaskStatus(id, data)
                    .then((response) => {
                        this.setState({loading:false});
                        // console.log("Response ", response.data, response.data.type)
                        if (response.data.type == "success") {
                            Alert.alert(
                                "Success",
                                "Photo Upload Successfully Done!!",
                                [
                                    { text: "OK" }
                                ]
                            )
                            this.setState({ showFields: true })
                        } else {
                            Alert.alert(
                                "Failed",
                                "Failed to upload photo",
                                [
                                    { text: "OK" }
                                ]
                            )
                        }
                    })
                    .catch((error) => { console.log("Error----", error.response.data) 
                    this.setState({loading:false});
                })
            }
        }
    }

    handleSubmit = () => {
        let currentUser = "";
        let newStatus;
        const { is_photo_proof, id, status, created_by, approval, learning } = this.state.task_data;
        approval == '1' ? newStatus = 'waiting' : newStatus = 'completed';
        let data = {
            'id': id,
            'status': newStatus,
            'learning': this.state.learning,
            'images': this.state.images && this.state.images.length > 0 ? this.state.images.filter(a => { if (!a.update) { return a } }) : [],
        }
        this.setState({loading:true});
        updateTaskStatus(id, data)
            .then((response) => {
                this.setState({loading:false});
                // console.log("Response ", response.data, response.data.type)
                if (response.data.type == "success") {
                    Alert.alert(
                        "Success",
                        "Task updated",
                        [
                            { text: "OK", onPress: () => this.props.navigation.goBack() }
                        ]
                    )
                } else {
                    Alert.alert(
                        "Failed",
                        "Failed to update task",
                        [
                            { text: "OK", onPress: () => this.props.navigation.goBack() }
                        ]
                    )
                }
            })
            .catch((error) => { console.log("Error----", error.response.data) 
            this.setState({loading:false});
        })
    }

    handleSubmit2 = () => {
        let newStatus = "waiting";
        const { id, learning } = this.state.task_data;
        let data = {
            'id': id,
            'status': newStatus,
            'learning': this.state.learning,
            'images': this.state.images && this.state.images.length > 0 ? this.state.images.filter(a => { if (!a.update) { return a } }) : [],
        }
        this.setState({loading:true});
        updateTaskStatus(id, data)
            .then((response) => {
                this.setState({loading:false});
                // console.log("Response ", response.data, response.data.type)
                if (response.data.type == "success") {
                    Alert.alert(
                        "Success",
                        "Task updated",
                        [
                            { text: "OK", onPress: () => this.props.navigation.goBack() }
                        ]
                    )
                } else {
                    Alert.alert(
                        "Failed",
                        "Failed to update task",
                        [
                            { text: "OK", onPress: () => this.props.navigation.goBack() }
                        ]
                    )
                }
            })
            .catch((error) => { console.log("Error----", error.response.data) 
            this.setState({loading:false});
        })
    }

    handleApprove = (status) => {
        const { id } = this.state.task_data;
        let data = {
            'id': id,
            'status': status,
        }
        this.setState({loading:true});
        updateTaskStatus(id, data)
            .then((response) => {
                // console.log("Response ", response.data, response.data.type)
                this.setState({loading:false});
                if (response.data.type == "success") {
                    Alert.alert(
                        "Success",
                        "Task updated",
                        [
                            { text: "OK", onPress: () => this.props.navigation.goBack() }
                        ]
                    )
                } else {
                    Alert.alert(
                        "Failed",
                        "Failed to update task",
                        [
                            { text: "OK", onPress: () => this.props.navigation.goBack() }
                        ]
                    )
                }
            })
            .catch((error) => { console.log(error) 
                this.setState({loading:false});
            })
    }

    render() {

        if (this.state.task_data.length <= 0) {
            return (
                <SafeAreaView style={styles.container}>
                    <Header
                        navigation={this.props.navigation}
                        // leftNavTo={'CategoryItems'}
                        params={{ id: category_id }}
                        title={this.state.name ? this.state.name : 'VIEW TASK'}
                        // leftIcon={'ios-arrow-back'}
                        rightIcon={null}
                    />
                    <View style={styles.body}>
                        <Spinner />
                    </View>
                    {/* <Footer /> */}
                </SafeAreaView>
            )
        }
        const { id, category_id } = this.props.route.params;
        const { created_by, is_photo_proof,approval_id } = this.state.task_data;
        const { assign_lvl_1_user_id } = this.state;

//    console.log("...........this.context..............", this.context.userData.id)

        return (
            <SafeAreaView style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    leftNavTo={'CategoryItems'}
                    params={{ id: category_id }}
                    title={this.state.name ? this.state.name : 'VIEW TASK'}
                    // leftIcon={'ios-arrow-back'}
                    route={this.props.route.name}
                    task_id={id}
                    assign={assign_lvl_1_user_id}
                    created_by={created_by}
                />
                 <View style={styles.body}>
                 {this.state.loading ? (
          <OverlayLoader />
        ) : (
               
                    <KeyboardAwareScrollView style={{ marginBottom: 0 }}>
                        <View style={{ marginBottom: 20 }}>
                            {/* title here */}
                            <View
                                style={[
                                    styles.fieldBox
                                ]}
                            >
                                <Text style={styles.labelName}>Task Name:</Text>
                                <TextInput
                                    value={this.state.name}
                                    style={[styles.textfield, { width: "60%", }]}
                                    editable={false}
                                    selectTextOnFocus={false}
                                />
                            </View>

                            {/* Description here */}
                            <View
                                style={[
                                    styles.fieldBox
                                ]}
                            >
                                <Text style={styles.labelName}>Task Description:</Text>
                                <TextInput
                                    multiline={true}
                                    value={this.state.description}
                                    style={[styles.textfield, { width: "60%", }]}
                                    editable={false}
                                    selectTextOnFocus={false}
                                />
                            </View>

                                {/* Schedule date here */}
                            <View
                                style={[
                                    styles.fieldBox
                                ]}
                            >
                                <Text style={styles.labelName}>Schedule :</Text>
                                <TextInput
                                    value={moment(this.state.task_data.schedule_start).format("Do MMM YY, ddd")+" ("+moment(this.state.task_data.schedule_time,"HH:mm:ss").format("LT")+")"}
                                    style={[styles.textfield, { width: "60%", }]}
                                    editable={false}
                                    selectTextOnFocus={false}
                                />
                            </View>

                            {/* Assigned by here */}
                            {this.state.task_data.created_by_name==null || this.state.task_data.created_by_name=="" ? null :
                            <View
                                style={[
                                    styles.fieldBox
                                ]}
                            >
                                <Text style={styles.labelName}>Assigned By:</Text>
                                <TextInput
                                    value={this.state.task_data.created_by_name}
                                    style={[styles.textfield, { width: "60%", }]}
                                    editable={false}
                                    selectTextOnFocus={false}
                                />
                            </View>
                            }

                            {/* Assigned To here */}
                            <View
                                style={[
                                    styles.fieldBox
                                ]}
                            >
                                <Text style={styles.labelName}>Assigned To:</Text>
                                <TextInput
                                    value={this.state.task_data.assign_level_1.split('-')[0]}
                                    style={[styles.textfield, { width: "60%", }]}
                                    editable={false}
                                    selectTextOnFocus={false}
                                />
                            </View>

                            {/* Status here */}
                            <View
                                style={[
                                    styles.fieldBox
                                ]}
                            >
                                <Text style={styles.labelName}>Status:</Text>
                                <TextInput
                                    value={Configs.TASK_STATUS[this.state.task_data.status]}
                                    style={[styles.textfield, { width: "60%", }]}
                                    editable={false}
                                    selectTextOnFocus={false}
                                />
                            </View>


                            {this.state.task_data.updated_by_name==null || this.state.task_data.updated_by_name=="" ? null :
                            <>
                            {/* Close here */}
                            <View
                                style={[
                                    styles.fieldBox
                                ]}
                            >
                                <Text style={styles.labelName}>Closed :</Text>
                                <TextInput
                                    value={moment(this.state.task_data.updated_at).format("Do MMM YY, ddd")}
                                    style={[styles.textfield, { width: "60%", }]}
                                    editable={false}
                                    selectTextOnFocus={false}
                                />
                            </View>

                            {/* Closed By here */}
                            <View
                                style={[
                                    styles.fieldBox
                                ]}
                            >
                                <Text style={styles.labelName}>Closed By:</Text>
                                <TextInput
                                    value={this.state.task_data.updated_by_name}
                                    style={[styles.textfield, { width: "60%", }]}
                                    editable={false}
                                    selectTextOnFocus={false}
                                />
                            </View>
                            </>
                            }
                            
                            {/* Upload */}
                            {is_photo_proof == 1 ? (
                                <>
                                    <Text style={styles.placeholder}>Photo Proof</Text>
                                    <Upload
                                        uploadable={true}
                                        type={"image"}
                                        items={this.state.images}
                                        onChange={(value) => {
                                            this.setState({
                                                images: value
                                            })
                                        }}
                                    />
                                </>
                            ) : null}

                            {this.state.document?.length > 0 ? (
                                <>
                                    <Text style={styles.placeholder}>Attachment</Text>
                                    <DocumentUpload
                                        uploadable={false}
                                        type={"document"}
                                        items={this.state.document}
                                        onChange={(value) => {
                                            this.setState({
                                                document: value
                                            })
                                        }}
                                    />
                                </>
                            ) : null}


                            {/* Comments here */}
                            <View
                                style={[
                                    styles.fieldBox
                                ]}
                            >
                                <Text style={styles.labelName}>Comments:</Text>
                                <TextInput
                                    value={this.state.learning}
                                    style={[styles.textfield, { width: "60%", }]}
                                    multiline={true}
                                    onChangeText={text => this.setState({ learning: text })}
                                    placeholder={'Type here'}
                                />
                            </View>

                            <Text style={styles.placeholder}>Assigned</Text>
                            <View style={styles.wrapper}>
                                <FlatList
                                    horizontal={true}
                                    data={this.state.assign_level_1}
                                    renderItem={({ item }) => {
                                        return (
                                            <View style={{ alignItems: 'center', marginLeft: 25 }}>
                                                <Image source={level1}
                                                    style={{ marginBottom: 5, height: 50, width: 50, resizeMode: 'contain' }}
                                                />
                                                <Text>{item.split('-')[0]}</Text>
                                            </View>
                                        )
                                    }}
                                    keyExtractor={item => item.id}
                                />

                            </View>

                            <View style={{ height: 30 }} />


                            {this.context.userData.id == created_by || assign_lvl_1_user_id.indexOf("") > - 1 || this.context.filterDetails?.id == 'extra' ? (
//use approval_id instead of created_by for approval by the approval  
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>

                                    {this.state.task_data.status == 'pending' || this.state.task_data.status == 'rejected' ? (
                                        <>
                                            {/* {this.state.showFields == true ? (
                                                <> */}
                                            {is_photo_proof == 1 && !this.state.showFields ? (
                                                <>
                                                    <TouchableOpacity
                                                        style={{
                                                            paddingVertical: 10,
                                                            width: 150,
                                                            backgroundColor: Colors.primary,
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            borderRadius: 3
                                                        }}
                                                        onPress={() => {
                                                            this.handleMarkasComplete()
                                                        }}>
                                                        <Text style={styles.btns}>Upload Photo</Text>
                                                    </TouchableOpacity>

                                                    {this.state.showFields ? this.state.task_data.approval == "1" ? (
                                                        <TouchableOpacity
                                                            style={{
                                                                paddingVertical: 10,
                                                                width: 150,
                                                                backgroundColor: Colors.primary,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderRadius: 3
                                                            }}
                                                            onPress={this.handleSubmit2}
                                                        >
                                                            <Text style={styles.btns}>Request for Approval </Text>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity
                                                            style={{
                                                                paddingVertical: 10,
                                                                width: 150,
                                                                backgroundColor: Colors.primary,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderRadius: 3
                                                            }}
                                                            onPress={this.handleSubmit}
                                                        >
                                                            <Text style={styles.btns}>Mark as Closed </Text>
                                                        </TouchableOpacity>
                                                    ) : null}
                                                </>
                                            ) : this.state.task_data.approval == "1" ? (
                                                <TouchableOpacity
                                                    style={{
                                                        paddingVertical: 10,
                                                        width: 150,
                                                        backgroundColor: Colors.primary,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: 3
                                                    }}
                                                    onPress={this.handleSubmit2}
                                                >
                                                    <Text style={styles.btns}>Request for Approval </Text>
                                                </TouchableOpacity>
                                            ) : (
                                                <TouchableOpacity
                                                    style={{
                                                        paddingVertical: 10,
                                                        width: 150,
                                                        backgroundColor: Colors.primary,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: 3
                                                    }}
                                                    onPress={this.handleSubmit}
                                                >
                                                    <Text style={styles.btns}>Mark as Closed </Text>
                                                </TouchableOpacity>
                                            )
                                            }
                                            {/* </>
                                            ) : (
                                                <TouchableOpacity
                                                    style={{
                                                        paddingVertical: 10,
                                                        width: 150,
                                                        backgroundColor: Colors.primary,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: 3
                                                    }}
                                                    onPress={this.handleMarkasComplete}
                                                >
                                                    <Text style={styles.btns}> Submit </Text>
                                                </TouchableOpacity>
                                            )} */}

                                            {/* <TouchableOpacity>
                                            <Text style={styles.btns}>DELETE </Text>
                                        </TouchableOpacity> */}
                                        </>
                                    ) :  null }
                                   {this.state.task_data.status == 'waiting' ? (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                                            <TouchableOpacity
                                                style={{
                                                    paddingVertical: 10,
                                                    width: 150,
                                                    backgroundColor: Colors.primary,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 3
                                                }}
                                                onPress={this.handleApprove.bind(this, 'rejected')}>
                                                <Text style={[styles.btns, { color: Colors.danger }]}> REJECT </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={{
                                                    paddingVertical: 10,
                                                    width: 150,
                                                    backgroundColor: Colors.primary,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 3
                                                }}
                                                onPress={this.handleApprove.bind(this, 'approved')}
                                            >
                                                <Text style={[styles.btns, { color: Colors.white }]}>APPROVE </Text>
                                            </TouchableOpacity>

                                        </View>
                                    ) : 

null}
                                </View>
                            ) : (
                                null
                            )}


                            <View style={{ height: 30 }} />

                            {/* preview of selections */}

                            <View>
                                {/* <Priority priority={this.state.priority}
                                onPress={(text) => this.setState({ priority: text })}
                            /> */}
                            </View>



                            <View style={{ height: 20 }} />

                            {/* sublist */}
                            {/* <Sublist
                            editable={false}
                            sub_tasks={this.state.sub_tasks}
                            onPress={(sub_tasks)=>{
                                this.setState({
                                    sub_tasks:sub_tasks
                                })
                            }}
                        /> */}
                            {/* <View style={{ height: 25 }} />
                        <FlatList
                            data={this.state.requirements}
                            renderItem={({ item }) =>
                                <View style={{ marginBottom: 20, flex: 1, marginTop: 15, alignItems: 'center', marginLeft: 5, flexDirection: 'row' }}>
                                    <Image source={item.ico} style={{ height: 30, width: 30, resizeMode: 'contain' }} />
                                    <View>
                                        <Text style={{ paddingHorizontal: 10 }}>{item.title}</Text>
                                    </View>

                                </View>}
                            keyExtractor={item => item.id}
                        />

                        <View style={{ height: 15 }} /> */}


                            {/* instructions */}
                            {/* <Text style={styles.placeholder}>Instructions</Text>
                        <View style={styles.wrapper}>
                            <Text>{this.state.instructions}</Text>
                        </View> */}

                            {/* Upload */}
                        </View>
                    </KeyboardAwareScrollView>
              
        )}
  </View>
                {/* <Footer /> */}
            </SafeAreaView>
        );
    }
}
export default ViewItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    body: {
        flex: 9,
        marginHorizontal: 5
    },
    placeholder: { fontSize: 17 - 1, marginTop: 15, color: '#7f7f7f' },//SUBHASH: Change title color here
    wrapper: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 3,
        width: '100%',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    btns: {
        fontSize: 18,
        color: Colors.white
    },
    fieldBox: {
        alignItems: 'center',
        width: "100%",
        overflow: "hidden",
        flexDirection: "row",
        padding: 5,
        borderRadius: 3,
        borderColor: "#ddd",
        borderWidth: 1,
        backgroundColor: "#fff",
        height: 'auto',
        justifyContent: "space-between",
        marginBottom: 5,
        marginTop: 5,
        // shadowColor: "#999",
        // shadowOffset: {
        // 	width: 0,
        // 	height: 1,
        // },
        // shadowOpacity: 0.22,
        // shadowRadius: 2.22,
        // elevation: 3,
    },
    labelName: {
        color: Colors.textColor,
        lineHeight: 40,
        fontSize: 14,
        paddingLeft: 4,
        height: 'auto',
    },
    textfield: {
        backgroundColor: "#fff",
        height: 'auto',
        
        fontSize: 12,
        color: Colors.textColor,
        textAlign: "right",
        padding: 5,
    },
});




// : assign_lvl_1_user_id.indexOf("") > - 1 ? (
//     <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>

//         {this.state.task_data.status == 'pending' || this.state.task_data.status == 'waiting' ? (
//             <>
//                 {is_photo_proof == 1 ? (
//                     <TouchableOpacity
//                         style={{
//                             paddingVertical: 10,
//                             width: 150,
//                             backgroundColor: Colors.primary,
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             borderRadius: 3
//                         }}
//                         onPress={() => {
//                             this.props.navigation.push('EditPhotoCatItem', { task_id: id })
//                         }}>
//                         <Text style={styles.btns}>  Upload Photo </Text>
//                     </TouchableOpacity>
//                 ) : null}

//                 <TouchableOpacity
//                     style={{
//                         paddingVertical: 10,
//                         width: 150,
//                         backgroundColor: Colors.primary,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         borderRadius: 3
//                     }}
//                     onPress={this.handleSubmit}
//                 >
//                     <Text style={styles.btns}>Mark as Complete </Text>
//                 </TouchableOpacity>
//             </>
//         ) : null}

//     </View>
// )
