import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Pressable,
    Dimensions,
    Modal
} from "react-native";
import { addTask, editTask, updateTask, userList, ListUsers, subcat, getgameascat } from '../../utils/api';
import Header from '../../components/tasks/Header'
// import Footer from '../../components/tasks/Footer'
import Coins from "../../components/tasks/AddTodo/Coins";
import Priority from "../../components/tasks/AddTodo/Priority";
// import TaskType from "../../components/tasks/AddTodo/TaskType";
// import Assign from "../../components/tasks/Assign";
import Schedule from "../../components/tasks/AddTodo/Schedule";
import Reminder from "../../components/tasks/AddTodo/Reminder";
// import PhotoProof from "../../components/tasks/AddTodo/PhotoProof";
// import Manage from "../../components/tasks/AddTodo/Manage";
// import Sublist from "../../components/tasks/AddTodo/Sublist";
import Upload from "../../components/tasks/AddTodo/Upload";
import DocumentUpload from "../../components/tasks/DocumentUpload";
// import Theme from "../../Theme";
import { showError } from "../../actions/Error";
import Spinner from "../../components/tasks/Spinner";
import AssignLevel1 from "../../components/tasks/AddTodo/AssignLevel1";
import moment from "moment";
import Config from "../../config/Configs";
import AppContext from "../../context/AppContext";
import InputDropdown from "../../components/InputDropdown";
import Colors from "../../config/colors";
import SelectBox from 'react-native-multi-selectbox';
import { xorBy } from 'lodash';
import { Ionicons } from "@expo/vector-icons";
import CustomCheckbox from "../../components/tasks/AddTodo/CustomCheckBox";
import { getAnimalSections, getAllEnclosures, getAllAnimals } from "../../services/APIServices";
import { getReportingManager, getAssignedReportingManager } from "../../services/UserManagementServices";
// import { capitalize } from './../../utils/Util';
import { todoList } from './../../utils/api';


const level1 = require('../../assets/tasks/level1.png')
const level2 = require('../../assets/tasks/level2.png')

class AddCategoryItem extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        // console.log("Add Task screen", props)
        super(props);
        let date = new Date();
        date.setDate(date.getDate() + 730);
        this.state = {
            name: '',
            editable: false,
            assign_level_1: [],
            assign_level_1_id: [],
            assign_level_2: [],
            document: [],
            schedule_start: moment(new Date()).add(1, 'days').format('YYYY-MM-DD'),
            schedule_end: moment(new Date()).add(10, 'years').add(2, 'days').format('YYYY-MM-DD'),
            schedule_time: moment(new Date()).format('HH:mm'),
            schedule_type: "daily",
            schedule_weekly: '',
            schedule_monthly: '',
            images: [],
            instructions: '',
            approval: false,
            allocationTypes: [
                { id: "1", value: "class", name: "Class" },
                { id: "2", value: "category", name: "Category" },
                { id: "3", value: "sub_category", name: "Sub Category" },
                { id: "4", value: "common_name", name: "Common Name" },
                { id: "5", value: "animal", name: "Animal" },
            ],
            allocatedTo: [],
            assigned_persons: [],
            selectedUsers: [],
            users: [],
            selectedApprovalUser: [],
            isFetching: true,
            taskType: "Individual",
            reminder: "-2 hours",
            is_photo_proof: false,
            sections: [],
            enclosures: [],
            enclosuress: [],
            isModalVisible: false,
            isapprovalUserModalVisible: false,
            isNotificationAfterTaskModalVisible: false,
            subcat_id: '',
            selectionTypes: [
                // {
                //     id: 1,
                //     name: 'Section',
                //     value: 'section'
                // },
                // {
                //     id: 2,
                //     name: 'Enclosure',
                //     value: 'enclosure'
                // },
                // {
                //     id: 3,
                //     name: 'Animal',
                //     value: 'animal'
                // },
                // {
                //     id: 4,
                //     name: 'Others',
                //     value: 'others'
                // },
            ],
            isSelectionTypeMenuOpen: false,
            selectionTypeName: "",
            selectionTypeId: '',
            ref_id: null,
            ref_name: '',
            // selectionTypeName: props.route.params.selectionType ? capitalize(props.route.params.selectionType) : "",
            // selectionTypeId: props.route.params.selectionType ? props.route.params.selectionType : undefined,
            // ref_id: props.route.params.ref_id ? props.route.params.ref_id : undefined,
            // ref_name: props.route.params.ref_name ? props.route.params.ref_name : undefined,
            isrefMenuOpen: false,
            isSectionMenuOpen: false,
            isEnclosureMenuOpen: false,
            section_id: "",
            section_name: "",
            // section_id: props.route.params?.parent_id ? props.route.params?.parent_id : "",
            // section_name: props.route.params?.parent_name ? props.route.params?.parent_name : "",
            enclosure_id: '',
            enclosure_name: '',
            id: 0,
            report_manager: [],
            approve_anyone: false,
            selectOneUser: '',
            Notificaiton_after_Task: false,
            animaleEdit: false,
            selectedCategory_id: "",
            selectedCategory_name: "",
            isCategoryMenuOpen: false,
            hasAssignValidationError: false,
            category: [],
            category_id: this.props.route.params?.category_id,
            sub_tasks: null,
            notofication: null,
        }
    }

    componentDidMount() {
        // console.log('................AddCategoryItem..................')
        // console.log("Params Task Add>>>>>>>>>>>>>", this.props.route.params);
        const { task_id } = this.props.route.params;
        // const { task_id } = '';
      
        this.getUserList();
        this.getuser_data();
        this.getSubCatid();
        this.getgameData();
        this.getCategoryList();
        if (task_id) {
            editTask(task_id)
                .then((response) => {
                    const data = response.data.data;
                    // console.log(data)
                    let schedule_start = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');
                    let schedule_time = moment(new Date()).format('HH:mm');
                    let schedule_end = moment(new Date()).add(2, 'days').format('YYYY-MM-DD');

                    let schedule_weekly = '';
                    let schedule_monthly = '';
                    if (data.schedule_type === 'one') {
                        schedule_start = moment(data.schedule_start).format('YYYY-MM-DD');
                        schedule_time = moment(data.schedule_time, 'HH:mm a').format('HH:mm');
                    } else if (data.schedule_type === 'daily') {
                        schedule_start = moment(data.schedule_start).format('YYYY-MM-DD');
                        schedule_time = moment(data.schedule_time, 'HH:mm a').format('HH:mm');
                        schedule_end = moment(data.schedule_end).format('YYYY-MM-DD');
                    } else if (data.schedule_type === 'weekly') {
                        schedule_start = moment(data.schedule_start).format('YYYY-MM-DD');
                        schedule_time = moment(data.schedule_time, 'HH:mm a').format('HH:mm');
                        schedule_end = moment(data.schedule_end).format('YYYY-MM-DD');
                        schedule_weekly = data.schedule_weekly;
                    } else if (data.schedule_type === 'monthly') {
                        schedule_start = moment(data.schedule_start).format('YYYY-MM-DD');
                        schedule_time = moment(data.schedule_time, 'HH:mm a').format('HH:mm');
                        schedule_end = moment(data.schedule_end).format('YYYY-MM-DD');
                        schedule_monthly = data.schedule_monthly;
                    }

                    let documents = data.documents && data.documents.length > 0 ? data.documents.map((a) => {
                        return { file: Config.DOCUMENT_URL + a, name: a, update: true }
                    }) : [];
                    let images = data.photos && data.photos.length > 0 ? data.photos.map((a) => {
                        return { image:  a, update: true }
                    }) : [];
                    let selectOneUser = ''
                    let selectedUsers = []
                    if (data.assign_users_data) {
                        if (data.task_type == 'Individual' && JSON.parse(data.assign_users_data).length == 1) {
                            selectOneUser = JSON.parse(data.assign_users_data)[0];
                        } else {
                            selectedUsers = JSON.parse(data.assign_users_data)
                        }

                    }
                    this.setState({
                        editable: true,
                        animaleEdit: true,
                        name: data.name,
                        category_id: data.category_id,
                        subcat_id: data.subcat_id,
                        description: data.description,
                        priority: data.priority,
                        taskType: data.task_type,
                        approve_anyone: Boolean(Number(data.approve_anyone)),
                        sub_tasks: data.sub_tasks,
                        instructions: data.instructions,
                        selectedUsers: selectedUsers,
                        selectOneUser: selectOneUser,
                        approval: Boolean(Number(data.approval)),
                        is_photo_proof: Boolean(Number(data.is_photo_proof)),
                        reminder: data.reminder,
                        notofication: data.notofication,
                        selectionTypeName: data.task_related_to,
                        selectionTypeId: data.task_related_id,
                        ref_id: data.task_related_to_id,
                        ref_name: data.task_related_to_name,
                        allocatedTo: data.notification_after_task ? JSON.parse(data.notification_after_task) : [],
                        selectedApprovalUser: data.approval_on_completition ? JSON.parse(data.approval_on_completition) : [],
                        schedule_type: data.schedule_type,
                        schedule_start: schedule_start,
                        schedule_end: schedule_end,
                        schedule_time: schedule_time,
                        schedule_weekly: schedule_weekly,
                        schedule_monthly: schedule_monthly,
                        coins: data.point,
                        document: documents,
                        images: images,
                    })

                })
                .catch(error => {
                    console.log("......edit task...err........", error)
                })
        }
        
    }


    // componentDidUpdate(){ 
    //     console.log("************** START ****************");
    //      console.log("STATE VALUE", this.state);
    //      console.log("************** END ****************")
    // }

    componentDidUpdate() {
        // console.log(this.state.allocatedTo)
    }


    getCategoryList = () => {
        const user_id = "";
        todoList(user_id).then((res) => {
            let data = res.data.data.filter((data) => data.id == this.props.route.params.category_id)
            // console.log("............data...............",data)
            this.setState({
                category: res.data.data.map((v, i) => ({
                    id: v.id,
                    name: v.name,
                    value: v,
                })),
                selectedCategory_id: data[0].id,
                category_id: data[0].id,
                selectedCategory_name: data[0].name,
            })
        }).catch((err) => console.log("......todolist...err........", err))
    };


    setCategoryData = (v) => {
        // console.log("closed_by********",v);return;
        this.setState({
            selectedCategory_id: v.id,
            category_id: v.id,
            selectedCategory_name: v.name,
            isCategoryMenuOpen: false,
            hasAssignValidationError: false,
        });
    };

    toggleCategoryMenu = () => this.setState({ isCategoryMenuOpen: !this.state.isCategoryMenuOpen });


    getSubCatid = () => {
        let userID = '';
        subcat(this.props.route.params.category_id, userID)
            // subcat(userID)
            .then((res) => {
                // console.log("res.data.data[0].id", res.data.data[0].id)
                this.setState({
                    subcat_id: res.data.data[0].id
                })
            }).catch((err) => console.log("......subcat...err........", err))
    }
    getgameData = () => {
        getgameascat(this.props.route.params.category_id)
            .then((res) => {
                // console.log(".............game data............",res.data.data)
                this.setState({
                    selectionTypes: res.data.data.map((v) => {
                        return {
                            id: v.id,
                            name: v.name,
                            value: v.name,
                        }
                    })
                })
            }).catch((err) => console.log("......subcat...err........", err))
    }

    getUserList = () => {
        // let cid = this.context.userDetails.cid;
        let cid = 1;
        let userID = "";
        // alert("CAlled 1")
        Promise.all([ListUsers()])
            .then((response) => {
                // alert("CAlled 2")
                // console.log(response[4][0].report_manager_id)
                // console.log("..............response[0].data...............",response[0])
                // console.log("............response[1].data.................",response[1].data)


                let usersList = response[0].data.map((a, index) => {
                    return {
                        id: a.id,
                        item: a.name,
                    }
                })
                // console.log("..............usersList...............",usersList)
                this.setState({
                    // status: usersList.length === 0 ? 'No Task List Available' : '',
                    // allocationTypes: users,
                    users: usersList,
                    isFetching: false,
                    // sections: response[2].map((v, i) => ({
                    //     id: v.id,
                    //     name: v.name,
                    //     value: v.id,
                    // })),
                    // enclosures: response[3].map((v, i) => ({
                    //     id: v.id,
                    //     name: v.enclosure_id,
                    //     value: v.id,
                    // })),
                    // allocatedTo: [{ "id": response[1][0].report_manager_id, "item": response[1][0].report_manager_name }]
                })
            }).catch(error => {
                // alert("CAlled 3")
                console.log("Axios error =====", error)
                this.setState({
                    isFetching: false,
                    // users: [],
                })

                // showError(error)
            })


        // ListUsers()
        //     .then((response) => {
        //         const sources = response.data;
        //         let users = sources.data.map((a, index) => {
        //             return {
        //                 id: a.id,
        //                 item: a.full_name,
        //             }
        //         })
        //         this.setState({
        //             status: users.length === 0 ? 'No Task List Available' : '',
        //             users: users,
        //             isFetching: false
        //         })
        //     }).catch(error => {
        //         this.setState({
        //             users: [],
        //             isFetching: false
        //         })
        //         showError(error)
        //     })

    }

    //Useing for assign users
    setSelectUser = (value) => {
        this.setState({ selectOneUser: value }, () => {
            //  console.log(this.state.selectOneUser);
             })
    }
    getuser_data = () => {
        userList().then(response => {
            // console.log("....................response................",response.data)
            const sources = response.data;
            let users = sources.map((a, index) => {
                return {
                    id: a.id,
                    // item: `${a.full_name} - ${a.dept_name}`,
                    item: `${a.name}`,
                }
            })
            this.setState({
                allocationTypes: users,
            })
        }).catch(err => { console.log("......userList...err........", err) })
    }
    setSelectedTeams = (value) => { this.setState({ selectedUsers: value }, () => {
        //  console.log(value); 
        }) }
    onMultiChange = () => {
        // if (this.state.taskType == "Individual") {
        //     if (this.state.selectedUsers.length >= 1) {
        //         this.setState({ selectedUsers: value })
        //         return;
        //     }
        // }
        return (item) => this.setSelectedTeams(xorBy(this.state.selectedUsers, [item], 'id'))
    }


    //Useing for approval user guys 
    setSelectedApprovalUser = (value) => { this.setState({ selectedApprovalUser: value }) }

    onMultiApprovalUserChange = () => {
        return (item) => this.setSelectedApprovalUser(xorBy(this.state.selectedApprovalUser, [item], 'id'))
    }

    //Useing for notificaton guys select
    setAllocatedTo = (value) => { this.setState({ allocatedTo: value }) }

    onAllocationChange = () => {
        return (item) => this.setAllocatedTo(xorBy(this.state.allocatedTo, [item], 'id'))
    }

    handleSubmit = () => {

        // if (this.state.is_photo_proof == true) {
        //     if (this.state.images.length <= 0) {
        //         alert("Please select image");
        //         return;
        //     }
        // }

        this.setState({
            loading: true
        }, () => {

            //Allocated to is used for notification data
            //assign_lvl_1 is for assigned users for the task
            //approval on completition is used for user who will be notified after task is complete

            const user_id = this.context.userData.id;
            const { category_id, task_id } = this.props.route.params;
            // const { category_id, task_id } = "";

            let arr = [];
            arr.push(this.state.selectOneUser)
            let obj = {
                "category_id": category_id ? category_id : this.state.category_id,
                "subcat_id": this.state.subcat_id,
                "name": this.state.name,
                "description": this.state.description,
                "priority": this.state.priority,
                "point": this.state.coins,
                "task_type": this.state.taskType,
                "assign_level_1": this.state.taskType == "Individual" ? arr : this.state.selectedUsers,
                //"schedule_type": this.state.schedule_time,
                "schedule_type": this.state.schedule_type,
                "reminder": this.state.reminder,
                "approve_anyone": Number(this.state.approve_anyone),
                "is_photo_proof": Number(this.state.is_photo_proof),
                "approval": Number(this.state.approval),
                "notofication": this.state.notofication,
                "allocated_to": this.state.allocatedTo,
                "instructions": this.state.instructions,
                "sub_tasks": this.state.sub_tasks,
                "approval_on_completition": this.state.selectedApprovalUser,
                "notification_after_task": this.state.allocatedTo,
                "status": "pending",
                "task_related_to": this.state.selectionTypeName,
                "task_related_to_id": null,
                "task_related_to_name": this.state.ref_name,
                "created_by": user_id,
                "images": this.state.images && this.state.images.length > 0 ? this.state.images.filter(a => { if (!a.update) { return a } }) : [],
                // "images": this.state.document && this.state.document.length > 0 ? this.state.document.filter(a => { if (!a.update) { return a } }) : [],
                "document": this.state.document && this.state.document.length > 0 ? this.state.document.filter(a => { if (!a.update) { return a } }) : [],
            }
            if (obj.name == '' || obj.name == undefined) {
                alert("Enter Name");
                this.setState({ loading: false })
                return
            } else if (obj.assign_level_1 == '' || obj.assign_level_1 == undefined) {
                alert("Choose Assign Person");
                this.setState({ loading: false })
                return
            } else if (obj.approval == true && obj.approval_on_completition.length <= 0) {
                alert("Choose Approval User");
                this.setState({ loading: false })
                return
            } 
            // else if (obj.task_related_to_name == '' || obj.task_related_to_name == undefined) {
            //     alert("Choose Task Related to");
            //     this.setState({ loading: false })
            //     return
            // } 
            else if (obj.priority == '' || obj.priority == undefined) {
                alert("Choose Priority");
                this.setState({ loading: false })
                return
            } else if (obj.point == '' || obj.point == undefined) {
                alert("Choose Rewards Points");
                this.setState({ loading: false })
                return
            } else if (this.state.editable && obj.is_photo_proof && this.state.images.length == 0) {
                alert("Choose Photo Proof");
                this.setState({ loading: false })
                return;
            } else {
            if (obj.schedule_type === 'one') {
                obj.schedule_start = this.state.schedule_start;
                obj.schedule_time = this.state.schedule_time;
            } else if (obj.schedule_type === 'daily') {
                obj.schedule_start = this.state.schedule_start;
                obj.schedule_time = this.state.schedule_time;
                obj.schedule_end = this.state.schedule_end;
            } else if (obj.schedule_type === 'weekly') {
                obj.schedule_start = this.state.schedule_start;
                obj.schedule_time = this.state.schedule_time;
                obj.schedule_end = this.state.schedule_end;
                obj.schedule_weekly = this.state.schedule_weekly;
            } else if (obj.schedule_type === 'monthly') {
                obj.schedule_start = this.state.schedule_start;
                obj.schedule_time = this.state.schedule_time;
                obj.schedule_end = this.state.schedule_end;
                obj.schedule_monthly = this.state.schedule_monthly;
            }
            // let 


            // if (images.length > 0) {
            //     obj.images = images
            // }
            // if (document.length > 0) {
            //     obj.document = document
            // }
            let task = '';
            let msg = '';
            // console.log("....................obj......................",obj)
            if (this.state.editable) {
                obj.updated_by = "";
                // console.log("Update data post", obj)
                task = updateTask(task_id, obj);
                msg = "Update Successfully Done !! "
            } else {
            task = addTask(obj);
            msg = "Add Successfully Done !! "
            // alert("CAlled 1")
            }
            task.then((response) => {
                // alert("CAlled 2")
                const sources = response.data;
                // console.log("After Add data???????????????", response);
                alert(msg)
                this.setState({
                    loading: false
                },()=>this.props.navigation.goBack())

            }).catch(error => {
                console.log("......add task...err........", error);
                // alert("CAlled 3")
                this.setState({
                    loading: false
                })
                // showError(error)
            })
        }
            }
        )
    }
    // gotoCategory = () => {
    //     this.props.navigation.navigate('Todo');
    // };

    getEnclosureBySection = (section_id) => {
        // let cid = this.context.userDetails.cid;
        let cid = 1;
        this.setState({isFetching:true});
        getAllEnclosures(cid, section_id)
            .then((res) => {
                this.setState({
                    enclosuress: res.map((v, i) => ({
                        id: v.id,
                        name: v.enclosure_id,
                        value: v.id,
                     
                    })),
                    isFetching:false
                })
            })
            .catch((err) => { console.log("......allenclosures...err........", err);
            this.setState({isFetching:false});
        })
    }

    getAnimalByEnclosure = (enclosure_id) => {
        // let cid = this.context.userDetails.cid;
        let cid = 1;
        this.setState({isFetching:true});
        getAllAnimals(cid, enclosure_id)
            .then((res) => {
                this.setState({
                    animals: res.map((v, i) => ({
                        id: v.id,
                        name: `${v.animal_id} | ${v.animal_name} | ${v.enclosure_name} | ${v.section_name}`,
                        value: v.id,
                    })),
                    isFetching:false
                })
            })
            .catch((err) => { console.log("......allanimals...err........", err) 
            this.setState({isFetching:false});
        })
    }

    handleModal = () => {
        this.setState({
            isModalVisible: true,
        })
    }

    closeModal = () => {
        this.setState({
            isModalVisible: false,
        })
    }

    doneModal = () => {
        this.setState({
            isModalVisible: false,
        })
    }



    handleApprovalUserModal = () => {
        this.setState({
            isapprovalUserModalVisible: true,
        })
    }

    closeApprovalUserModal = () => {
        this.setState({
            isapprovalUserModalVisible: false,
        })
    }

    doneApprovalUserModal = () => {
        this.setState({
            isapprovalUserModalVisible: false,
        })
    }


    handleNotificationAfterTaskModal = () => {
        this.setState({
            isNotificationAfterTaskModalVisible: true,
        })
    }

    closeNotificationAfterTaskModal = () => {
        this.setState({
            isNotificationAfterTaskModalVisible: false,
        })
    }

    doneNotificationAfterTaskModal = () => {
        this.setState({
            isNotificationAfterTaskModalVisible: false,
        })
    }

    toggleSelectionTypeMenu = () =>
        this.setState({ isSelectionTypeMenuOpen: !this.state.isSelectionTypeMenuOpen });

    togglerefMenu = () =>
        this.setState({ isrefMenuOpen: !this.state.isrefMenuOpen });

    toggleSectionMenu = () =>
        this.setState({ isSectionMenuOpen: !this.state.isSectionMenuOpen });
    toggleEnclosureMenu = () =>
        this.setState({ isEnclosureMenuOpen: !this.state.isEnclosureMenuOpen });

    setSelectionTypeData = (v) =>
        this.setState({
            selectionTypeId: v.value,
            selectionTypeName: v.name,
            ref_id: undefined,
            ref_name: '',
            isSelectionTypeMenuOpen: false,
            animaleEdit: false,
        });

    setref = (v) => {
        this.setState({
            ref_id: v.id,
            ref_name: v.name,
            isrefMenuOpen: false,
        });
    };

    setSection = (v) => {
        this.setState({
            section_id: v.id,
            section_name: v.name,
            enclosure_id: '',
            enclosure_name: '',
            ref_id: '',
            ref_name: '',
            isSectionMenuOpen: false
        }, () => { this.getEnclosureBySection(v.id) });
    }

    setEnclosure = (v) => {
        this.setState({
            enclosure_id: v.id,
            enclosure_name: v.name,
            ref_id: '',
            ref_name: '',
            isEnclosureMenuOpen: false
        }, () => { this.getAnimalByEnclosure(v.id) });
    };

    render() {
        // console.log(".........this.props.route.params............",this.props.route.params.category_id)
        const { category_id, title } = this.props.route.params;
        // console.log("Route Params>>>>>",this.props.route.params.title);
        if (this.state.isFetching) {
            <SafeAreaView style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    leftNavTo={'CategoryItems'}
                    params={{ id: category_id }}
                    title={this.state.name ? this.state.name : title}
                    // leftIcon={'ios-arrow-back'}
                    rightIcon={null}
                />
                <View style={styles.body}>
                    <Spinner />
                </View>
                {/* <Footer /> */}
            </SafeAreaView>
        }

        return (
            <SafeAreaView style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    leftNavTo={'CategoryItems'}
                    params={{ id: category_id }}
                    title={this.state.name ? this.state.name : title}
                    // leftIcon={'ios-arrow-back'}
                    rightIcon={null}
                />
                <View style={styles.body}>
                    <ScrollView style={{ paddingHorizontal: 5, paddingBottom: 20, paddingTop: 2, marginBottom: 20 }}>
                        <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 3 }}>
                            {/* title here */}
                            <View
                                style={[
                                    styles.fieldBox,
                                    this.state.titleValidationFailed
                                        ? styles.errorFieldBox
                                        : null,
                                ]}
                            >
                                <Text style={styles.labelName}>Title:</Text>
                                <TextInput
                                    value={this.state.name}
                                    onChangeText={text => this.setState({ name: text })}
                                    style={[styles.textfield, { width: "60%", }]}
                                    autoCompleteType="off"
                                    maxLength={20}
                                    placeholder=""
                                />
                            </View>
                            {/* {this.props.route.params.selectionType ?  */}
                            <InputDropdown
                                label={"Category"}
                                value={this.state.selectedCategory_name}
                                isOpen={this.state.isCategoryMenuOpen}
                                items={this.state.category}
                                openAction={this.toggleCategoryMenu}
                                closeAction={this.toggleCategoryMenu}
                                setValue={this.setCategoryData}
                                placeholder=" "
                                labelStyle={styles.labelName}
                                textFieldStyle={[styles.textfield, { width: "60%", }]}
                                style={[
                                    styles.fieldBox,
                                    this.state.hasAssignValidationError
                                        ? styles.errorFieldBox
                                        : null,
                                ]}
                            />
                            {/* : null } */}

                            {/* desc here */}

                            <View
                                style={[
                                    styles.fieldBox
                                ]}
                            >
                                <Text style={styles.labelName}>Description:</Text>
                                <TextInput
                                    multiline={true}
                                    value={this.state.description}
                                    onChangeText={text => this.setState({ description: text })}
                                    style={[styles.textfield, { width: "60%", }]}
                                    autoCompleteType="off"
                                    placeholder=""
                                />
                            </View>
                            {/* task related to here */}
                            <View style={styles.inputContainer}>
                                <InputDropdown
                                    label={"Related To"}
                                    value={this.state.selectionTypeName}
                                    isOpen={this.state.isSelectionTypeMenuOpen}
                                    items={this.state.selectionTypes}
                                    openAction={this.toggleSelectionTypeMenu}
                                    closeAction={this.toggleSelectionTypeMenu}
                                    setValue={this.setSelectionTypeData}
                                    placeholder=" "
                                    labelStyle={styles.labelName}
                                    textFieldStyle={[styles.textfield, { width: "60%", }]}
                                    style={[
                                        styles.fieldBox,
                                        this.state.departmentValidationFailed
                                            ? styles.errorFieldBox
                                            : null,
                                    ]}
                                />
                                {this.state.hasTypeValidationError ? (
                                    <Text style={styles.errorText}>Choose type</Text>
                                ) : null}
                            </View>
                            {this.state.selectionTypeId == 'section' ? (
                                <View style={styles.inputContainer}>
                                    <InputDropdown
                                        label={"Select Section"}
                                        value={this.state.ref_name}
                                        isOpen={this.state.isrefMenuOpen}
                                        items={this.state.sections}
                                        openAction={this.togglerefMenu}
                                        closeAction={this.togglerefMenu}
                                        setValue={this.setref}
                                        placeholder=" "
                                        labelStyle={styles.labelName}
                                         textFieldStyle={[styles.textfield, { width: "60%", }]}
                                        style={[
                                            styles.fieldBox,
                                            this.state.departmentValidationFailed
                                                ? styles.errorFieldBox
                                                : null,
                                        ]}
                                    />
                                </View>
                            ) : null}


                            {this.state.selectionTypeId == 'enclosure' ? this.state.id == 0 ? (
                                <>
                                    <View style={styles.inputContainer}>
                                        <InputDropdown
                                            label={"Select Section"}
                                            value={this.state.section_name}
                                            isOpen={this.state.isSectionMenuOpen}
                                            items={this.state.sections}
                                            openAction={this.toggleSectionMenu}
                                            closeAction={this.toggleSectionMenu}
                                            setValue={this.setSection}
                                            placeholder=" "
                                            labelStyle={styles.labelName}
                                             textFieldStyle={[styles.textfield, { width: "60%", }]}
                                            style={[
                                                styles.fieldBox,
                                                this.state.departmentValidationFailed
                                                    ? styles.errorFieldBox
                                                    : null,
                                            ]}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <InputDropdown
                                            label={"Select Enclosures"}
                                            value={this.state.ref_name}
                                            isOpen={this.state.isrefMenuOpen}
                                            items={this.state.enclosuress}
                                            openAction={this.togglerefMenu}
                                            closeAction={this.togglerefMenu}
                                            setValue={this.setref}
                                            placeholder=" "
                                            labelStyle={styles.labelName}
                                             textFieldStyle={[styles.textfield, { width: "60%", }]}
                                            style={[
                                                styles.fieldBox,
                                                this.state.departmentValidationFailed
                                                    ? styles.errorFieldBox
                                                    : null,
                                            ]}
                                        />
                                    </View>
                                </>
                            ) : null : null}

                            {this.state.animaleEdit ? null :
                                <>
                                    {this.state.selectionTypeId == 'animal' ? this.state.id == 0 ? (
                                        <>
                                            <View style={styles.inputContainer}>
                                                <InputDropdown
                                                    label={"Select Section"}
                                                    value={this.state.section_name}
                                                    isOpen={this.state.isSectionMenuOpen}
                                                    items={this.state.sections}
                                                    openAction={this.toggleSectionMenu}
                                                    closeAction={this.toggleSectionMenu}
                                                    setValue={this.setSection}
                                                    placeholder=" "
                                                    labelStyle={styles.labelName}
                                                     textFieldStyle={[styles.textfield, { width: "60%", }]}
                                                    style={[
                                                        styles.fieldBox,
                                                        this.state.departmentValidationFailed
                                                            ? styles.errorFieldBox
                                                            : null,
                                                    ]}
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <InputDropdown
                                                    label={"Select Enclosures"}
                                                    value={this.state.enclosure_name}
                                                    isOpen={this.state.isEnclosureMenuOpen}
                                                    items={this.state.enclosuress}
                                                    openAction={this.toggleEnclosureMenu}
                                                    closeAction={this.toggleEnclosureMenu}
                                                    setValue={this.setEnclosure}
                                                    placeholder=" "
                                                    labelStyle={styles.labelName}
                                                     textFieldStyle={[styles.textfield, { width: "60%", }]}
                                                    style={[
                                                        styles.fieldBox,
                                                        this.state.departmentValidationFailed
                                                            ? styles.errorFieldBox
                                                            : null,
                                                    ]}
                                                />
                                            </View>
                                        </>
                                    ) : null : null}
                                </>
                            }

                            {this.state.selectionTypeId == 'animal' ? (
                                <View style={styles.inputContainer}>
                                    <InputDropdown
                                        label={"Select Animals"}
                                        value={this.state.ref_name}
                                        isOpen={this.state.isrefMenuOpen}
                                        items={this.state.animals}
                                        openAction={this.togglerefMenu}
                                        closeAction={this.togglerefMenu}
                                        setValue={this.setref}
                                        placeholder=" "
                                        labelStyle={styles.labelName}
                                        textFieldStyle={[styles.textfield, { flexWrap: 'wrap', width: '60%' }]}
                                        style={[
                                            styles.fieldBox,
                                            this.state.departmentValidationFailed
                                                ? styles.errorFieldBox
                                                : null,
                                        ]}
                                    />
                                </View>
                            ) : null}

                            {/* schedule */}
                            <Text style={[styles.labelName, { marginLeft: 8, paddingBottom: 0 }]}>Schedule</Text>
                            <Schedule
                                selected_schedule_start={this.state.schedule_start}
                                selected_schedule_end={this.state.schedule_end}
                                selected_schedule_time={this.state.schedule_time}
                                selected_schedule_weekly={this.state.schedule_weekly}
                                selected_schedule_monthly={this.state.schedule_monthly}
                                selected_schedule_type={this.state.schedule_type}
                                onPressStartDate={(schedule_start) => {
                                    this.setState({
                                        schedule_start: schedule_start
                                    })
                                }}
                                onPressEndDate={(schedule_end) => {
                                    this.setState({
                                        schedule_end: schedule_end
                                    })
                                }}
                                onPressTime={(schedule_time) => {
                                    this.setState({
                                        schedule_time: schedule_time
                                    })
                                }}
                                onScheduleWeek={(schedule_weekly) => {
                                    this.setState({
                                        schedule_weekly: schedule_weekly
                                    })
                                }}
                                onScheduleMonthly={(schedule_monthly) => {
                                    this.setState({
                                        schedule_monthly: schedule_monthly
                                    })
                                }}
                                onPress={(text) => {
                                    this.setState({ schedule_type: text })
                                }}
                            />
                            {/* reminder */}
                            <Text style={[styles.labelName, { marginLeft: 8, paddingBottom: 0 }]}>Reminder</Text>
                            <Reminder
                                reminder={this.state.reminder}
                                onPress={(text) => {
                                    this.setState({ reminder: text })
                                }
                                }
                            />

                            {/* task type */}
                            <Text style={[styles.labelName, { marginLeft: 8, paddingBottom: 0 }]}>Task Type</Text>
                            <AssignLevel1
                                assigned_persons={this.state.allocatedTo}
                                editable={this.state.editable}
                                icon={level1}
                                taskType={this.state.taskType}
                                selected={this.state.assign_level_1}
                                onAssignChange={(assign1, assign1_id) => { }}
                                onTaskChange={(taskType) => {
                                    this.setState({
                                        taskType: taskType,
                                        selectedUsers: [],
                                        selectOneUser: ''
                                    })
                                }}
                            />

                            {/* assign to */}
                            <View style={[styles.wrapperForAssign]}>
                                <View style={[styles.wrapper, { borderWidth: 0, paddingHorizontal: 8, }]}>
                                    <View>
                                        <TouchableOpacity onPress={this.handleModal}>
                                            <Text style={[styles.labelName]}>Assign To</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {this.state.taskType === 'Individual' && this.state.selectOneUser != '' ? (
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            <Text
                                                style={{
                                                    padding: 10,
                                                    borderWidth: 1,
                                                    borderColor: Colors.primary,
                                                    borderRadius: 3,
                                                    marginRight: 3,
                                                    marginBottom: 3,
                                                    color: Colors.primary
                                                }}>
                                                {this.state.selectOneUser.item}
                                            </Text>
                                        </View>
                                    ) : (
                                        null
                                    )}
                                    <View style={{ alignSelf: 'center' }}>
                                        <TouchableOpacity onPress={this.handleModal}><Ionicons name="caret-down-outline" style={{ fontSize: 20, color: Colors.primary }} /></TouchableOpacity>
                                    </View>
                                </View>

                                <Modal style={styles.modal} visible={this.state.isModalVisible} animationType='slide' >
                                    <SafeAreaView style={{ marginLeft: 30, marginRight: 30 }}>
                                        {this.state.taskType == "Individual" ?
                                            <SelectBox
                                                label="Select User"
                                                options={this.state.users}
                                                multiOptionContainerStyle={{ backgroundColor: Colors.primary }}
                                                toggleIconColor={Colors.primary}
                                                searchIconColor={Colors.primary}
                                                // inputPlaceholder={" Search"}
                                                selectedItemStyle={{ backgroundColor: "#fff", height: 'auto', fontSize: 12, color: Colors.textColor, padding: 5, }}
                                                arrowIconColor={Colors.primary}
                                                labelStyle={{ height: 1, fontSize: 20 }}
                                                containerStyle={{ borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderColor: Colors.primary }}
                                                value={this.state.selectOneUser}
                                                onChange={(value) => this.setSelectUser(value)}
                                                onTapClose={this.onMultiChange()}
                                                hideInputFilter={false}
                                            />
                                            :
                                            <SelectBox
                                                label=""
                                                options={this.state.users}
                                                multiOptionContainerStyle={{ backgroundColor: Colors.primary }}
                                                toggleIconColor={Colors.primary}
                                                searchIconColor={Colors.primary}
                                                inputPlaceholder={" Search"}
                                                arrowIconColor={Colors.primary}
                                                labelStyle={{ height: 1, fontSize: 20 }}
                                                containerStyle={{ borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderColor: Colors.primary }}
                                                selectedValues={this.state.selectedUsers}
                                                onMultiSelect={this.onMultiChange()}
                                                onTapClose={this.onMultiChange()}
                                                isMulti
                                            />
                                        }

                                        <View style={styles.modalButton}>
                                            <TouchableOpacity style={styles.modalDone} onPress={this.doneModal}><Text style={{ color: Colors.white, top: 10 }}>Done</Text></TouchableOpacity>
                                            <TouchableOpacity style={styles.modalCancel} onPress={this.closeModal}><Text style={{ color: Colors.white, top: 10 }}>Cancel</Text></TouchableOpacity>
                                        </View>
                                    </SafeAreaView>
                                </Modal>
                                {this.state.selectedUsers?.length > 0 ? (
                                    <View style={[styles.wrapper, { borderWidth: 0, flexWrap: 'wrap' }]}>
                                        {this.state.selectedUsers.map((item) => {
                                            return (<Text key={item.id}
                                                style={{
                                                    padding: 10,
                                                    borderWidth: 1,
                                                    borderColor: Colors.primary,
                                                    borderRadius: 3,
                                                    marginRight: 3,
                                                    marginBottom: 3,
                                                    color: Colors.primary
                                                }}>
                                                {item.item}
                                            </Text>)
                                        })}
                                    </View>
                                ) : null}
                            </View>
                            {/* assign level 2  */}
                            {/* <Text style={styles.name}>Assign Level -2</Text>
                        <Assign icon={level2}
                                editable={this.state.editable}
                                selected={this.state.assign_level_2}
                                type={2}
                                onPress={(text)=>this.setState({assign_level_2:text})} /> */}



                            {/* photo prof */}
                            <View style={[styles.wrapperForAssign]}>
                                <CustomCheckbox
                                    handler={() => { this.setState({ is_photo_proof: !this.state.is_photo_proof }) }}
                                    value={this.state.is_photo_proof}
                                    label={"Photo Proof"}
                                />
                                {/* Upload */}
                                {this.state.editable == true && this.state.is_photo_proof == true ? (<>
                                    <Text style={styles.name}>Photo Proof</Text>
                                    <Upload
                                        uploadable={true}
                                        type={"image"}
                                        items={this.state.images}
                                        onChange={(value) => {
                                            this.setState({
                                                images: value
                                            })
                                        }}
                                    /></>) : null}
                            </View>
                            {/* <Text style={styles.name}>Add Photo Proof</Text>
                        <PhotoProof
                            is_photo_proof={this.state.is_photo_proof}
                            onPress={(text) => {
                                this.setState({ is_photo_proof: text })
                            }
                            }
                        /> */}
                            {/* approval */}
                            <View style={[styles.wrapperForAssign]}>
                                <CustomCheckbox
                                    handler={() => { this.setState({ approval: !this.state.approval }); 
                                    // console.log(this.state.approval)
                                 }}
                                    value={this.state.approval}
                                    label={"Approval on completion"}
                                />

                                {/* notific */}
                                {this.state.approval == true ? (
                                    <View style={[styles.wrapperForAssign, { borderWidth: 0 }]}>
                                        <View style={[styles.wrapper, { borderWidth: 0 }]}>
                                            <TouchableOpacity onPress={this.handleApprovalUserModal}>
                                                <Text style={[styles.name, { marginTop: 0 }]}>Select Users</Text>
                                            </TouchableOpacity>
                                            <View style={{ alignSelf: 'center' }}>
                                                <TouchableOpacity onPress={this.handleApprovalUserModal}><Ionicons name="caret-down-outline" style={{ fontSize: 20, color: Colors.primary }} /></TouchableOpacity>
                                            </View>
                                        </View>

                                        <Modal style={styles.modal} visible={this.state.isapprovalUserModalVisible} animationType='slide' >
                                            <View style={{ marginLeft: 30, marginRight: 30, marginTop: 30 }}>
                                                <SelectBox
                                                    label=""
                                                    options={this.state.users}
                                                    multiOptionContainerStyle={{ backgroundColor: Colors.primary }}
                                                    toggleIconColor={Colors.primary}
                                                    searchIconColor={Colors.primary}
                                                    inputPlaceholder={" Search"}
                                                    arrowIconColor={Colors.primary}
                                                    labelStyle={{ height: 1, fontSize: 20 }}
                                                    containerStyle={{ borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderColor: Colors.primary }}
                                                    selectedValues={this.state.selectedApprovalUser}
                                                    onMultiSelect={this.onMultiApprovalUserChange()}
                                                    onTapClose={this.onMultiApprovalUserChange()}
                                                    isMulti
                                                />
                                                <View style={styles.modalButton}>
                                                    <TouchableOpacity style={styles.modalDone} onPress={this.doneApprovalUserModal}><Text style={{ color: Colors.white, top: 10 }}>Done</Text></TouchableOpacity>
                                                    <TouchableOpacity style={styles.modalCancel} onPress={this.closeApprovalUserModal}><Text style={{ color: Colors.white, top: 10 }}>Cancel</Text></TouchableOpacity>
                                                </View>
                                            </View>
                                        </Modal>
                                    </View>
                                ) : null}
                                {this.state.selectedApprovalUser.length > 0 ? (
                                    <View style={[styles.wrapper, { borderWidth: 0, flexWrap: 'wrap' }]}>
                                        {this.state.selectedApprovalUser.map((item) => {
                                            return (<Text key={item.id}
                                                style={{
                                                    padding: 10,
                                                    borderWidth: 1,
                                                    borderColor: Colors.primary,
                                                    borderRadius: 3,
                                                    marginRight: 3,
                                                    marginBottom: 3,
                                                    color: Colors.primary
                                                }}>
                                                {item.item}
                                            </Text>)
                                        })}
                                    </View>
                                ) : null}
                            </View>
                            <View style={[styles.wrapperForAssign]}>
                                <CustomCheckbox
                                    handler={() => { this.setState({ approve_anyone: !this.state.approve_anyone });
                                    //  console.log(this.state.approve_anyone)
                                     }}
                                    value={this.state.approve_anyone}
                                    label={"Fulfilment by anyone"}
                                />
                            </View>


                            {/* <Text style={styles.name}>Approval on Completion</Text>
                        
                            <PhotoProof
                            is_photo_proof={this.state.approval}
                            onPress={(text) => {
                                this.setState({ approval: text })
                            }
                            }
                        /> */}



                            <View style={[styles.wrapperForAssign]}>
                                <CustomCheckbox
                                    handler={() => { this.setState({ Notificaiton_after_Task: !this.state.Notificaiton_after_Task }) }}
                                    value={this.state.Notificaiton_after_Task}
                                    label={"Notificaition"}
                                />
                                {this.state.Notificaiton_after_Task ?
                                    <View style={[styles.wrapperForAssign, { borderWidth: 0 }]}>
                                        <View style={[styles.wrapper, { borderWidth: 0 }]}>
                                            <View>
                                                <Text style={[styles.name, { marginTop: 0 }]}>Select User</Text>
                                            </View>
                                            <View style={{ alignSelf: 'center' }}>
                                                <TouchableOpacity onPress={this.handleNotificationAfterTaskModal}><Ionicons name="caret-down-outline" style={{ fontSize: 20, color: Colors.primary }} /></TouchableOpacity>
                                            </View>
                                        </View>
                                        <Modal style={styles.modal} visible={this.state.isNotificationAfterTaskModalVisible} animationType='slide' >
                                            <View style={{ marginLeft: 30, marginRight: 30, marginTop: 30 }}>
                                                <SelectBox
                                                    label=""
                                                    options={this.state.users}
                                                    multiOptionContainerStyle={{ backgroundColor: Colors.primary }}
                                                    toggleIconColor={Colors.primary}
                                                    searchIconColor={Colors.primary}
                                                    inputPlaceholder={" Search"}
                                                    arrowIconColor={Colors.primary}
                                                    labelStyle={{ height: 1, fontSize: 20 }}
                                                    containerStyle={{ borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderColor: Colors.primary }}
                                                    selectedValues={this.state.allocatedTo}
                                                    onMultiSelect={this.onAllocationChange()}
                                                    onTapClose={this.onAllocationChange()}
                                                    isMulti
                                                />
                                                <View style={styles.modalButton}>
                                                    <TouchableOpacity style={styles.modalDone} onPress={this.doneNotificationAfterTaskModal}><Text style={{ color: Colors.white, top: 10 }}>Done</Text></TouchableOpacity>
                                                    <TouchableOpacity style={styles.modalCancel} onPress={this.closeNotificationAfterTaskModal}><Text style={{ color: Colors.white, top: 10 }}>Cancel</Text></TouchableOpacity>
                                                </View>
                                            </View>
                                        </Modal>
                                        {this.state.allocatedTo.length > 0 ? (
                                            <View style={[styles.wrapper, { borderWidth: 0, flexWrap: 'wrap' }]}>
                                                {this.state.allocatedTo.map((item) => {
                                                    return (<Text key={item.id}
                                                        style={{
                                                            padding: 10,
                                                            borderWidth: 1,
                                                            borderColor: Colors.primary,
                                                            borderRadius: 3,
                                                            marginRight: 3,
                                                            marginBottom: 3,
                                                            color: Colors.primary
                                                        }}>
                                                        {item.item}
                                                    </Text>)
                                                })}
                                            </View>
                                        ) : null}
                                    </View>
                                    : null}

                            </View>
                            {/* sublist */}

                            {/* <Sublist
                            editable={true}
                            sub_tasks={this.state.sub_tasks}
                            onPress={(sub_tasks)=>{
                                this.setState({
                                    sub_tasks:sub_tasks
                                })
                            }}
                        /> */}
                            {/* instructions */}

                            {/* Upload */}
                            <Text style={[styles.labelName, { marginLeft: 10 }]}>Attachment </Text>
                            <DocumentUpload uploadable={true}
                                type={"document"}
                                items={this.state.document}
                                onChange={(value) => {
                                    this.setState({
                                        document: value
                                    })
                                }}
                            />



                            {/* priority */}
                            <Text style={[styles.labelName, { marginLeft: 8 }]}>Priority</Text>
                            <Priority
                                priority={this.state.priority}
                                onPress={(text) => this.setState({ priority: text })} />


                            {/* coins */}
                            <Text style={[styles.labelName, { marginLeft: 8 }]}>Reward Points</Text>
                            <Coins
                                selected={this.state.coins}
                                onPress={(text) => this.setState({ coins: text })} />
                        </View>
                        <View style={{ height: 50 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                            {
                                this.state.loading === true ?
                                    <TouchableOpacity>
                                        <Spinner />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={styles.btnCover}
                                        onPress={this.handleSubmit}>
                                        <Text style={styles.btns}>{this.state.editable ? "UPDATE" : "SAVE"} </Text>
                                    </TouchableOpacity>
                            }

                            <TouchableOpacity
                                style={styles.btnCover}
                                onPress={() => this.props.navigation.goBack()}>
                                <Text style={styles.btns}>EXIT </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: 25 }} />
                    </ScrollView>
                </View >
                {/* <Footer /> */}
            </SafeAreaView >
        );
    }
}
export default AddCategoryItem;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    body: {
        flex: 9,
    },
    placeholder: { fontSize: 17 - 1, marginTop: 5, color: '#7f7f7f' },
    uncheckedCheckBoxColor: { color: '#7f7f7f' },
    wrapper: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 3,
        width: '100%',
        // marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    wrapperForAssign: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        // paddingHorizontal: 10,
        // paddingVertical: 10,
        borderRadius: 3,
        width: '100%',
        // marginTop: 10,
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'space-between'
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
        padding: 2,
        borderRadius: 3,
        borderColor: "#ddd",
        borderBottomWidth: 1,
        backgroundColor: "#fff",
        height: 'auto',
        justifyContent: "space-between",
    },
    labelName: {
        color: Colors.textColor,
        // lineHeight: 40,
        fontSize: 15,
        paddingLeft: 4,
        height: 'auto',
        paddingVertical: 10
    },
    textfield: {
        backgroundColor: "#fff",
        height: 'auto',
        flexWrap: 'wrap',
        fontSize: 15,
        color: Colors.textColor,
        textAlign: "left",
        padding: 5,
    },

    arrow: {
        zIndex: 100
    },

    arrowDown: {
        bottom: 28,
        fontSize: 30,
        left: windowWidth - 70,
        height: 28,
        color: Colors.primary
    },

    modalDone: {
        backgroundColor: Colors.primary,
        alignItems: 'center',
        height: 40,
        width: "49%",
        marginTop: 15
    },

    modalCancel: {
        backgroundColor: Colors.primary,
        alignItems: 'center',
        height: 40,
        width: 60,
        marginTop: 15,
        width: "49%",
    },

    modal: {
        height: 300,
        backgroundColor: '#FFF',
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalButton: {
        flexDirection: 'row',
        width: "100%",
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    name: {
        color: Colors.black,
        // lineHeight: 40,
        fontSize: 15,
        paddingLeft: 4,
        height: 'auto',
        paddingVertical: 10
    },
    inputText: {
        height: 50,
        borderColor: "#dfdfdf",
        borderWidth: 1,
        fontSize: 16,
        backgroundColor: "#fff",
        color: Colors.textColor,
        borderRadius: 3,

    },
    btnCover: {
        width: 100,
        paddingVertical: 5,
        backgroundColor: Colors.primary,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
