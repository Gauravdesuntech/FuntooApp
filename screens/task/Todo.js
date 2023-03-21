import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TextInput
} from "react-native";
import { getDatewiseTasks, todoList, userList } from '../../utils/api';
import Config from "../../config/Configs";
// import Footer from "../../components/tasks/Footer";
import Header from "../../components/tasks/Header";
import TodoItem from '../../components/tasks/TodoItem'
import { showError } from "../../actions/Error";
import Spinner from "../../components/tasks/Spinner";
import AppContext from "../../context/AppContext";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import UserItem from "../../components/tasks/UserItem";
import  Colors  from "../../config/colors";
import CatItemCard from "../../components/tasks/CatItemCard";
import moment from "moment";


const individual = require('../../assets/tasks/manager.png')
const rotate = require('../../assets/tasks/Rotate.png')
const compete = require('../../assets/tasks/Compete.png')
const collaborate = require('../../assets/tasks/Collborate.png')
const critical = require('../../assets/tasks/Critical.png')
const danger = require('../../assets/tasks/Danger.png')
const low = require('../../assets/tasks/Low.png')
const moderate = require('../../assets/tasks/Moderate.png')
const high = require('../../assets/tasks/High.png')
const greentick = require('../../assets/tasks/greentick.png')

//import images for task icon here
const carrot = require("../../assets/tasks/carrot.png")

// sample data for todo
const Todos = [
    {
        id: '1',
        title: 'Groceries',
        qty: '5',
        img: carrot
    },
    {
        id: '2',
        title: 'At Home',
        qty: '2',
        img: carrot
    }
];


class Todo extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            status: 'loading....',
            categories: null,
            isFetching: false,
            switchStatus: false,
            switchCategoryStatus: false,
            users: [],
            searchValue: '',
            selectUserId: '',
            filterQuery: '',
            advance: '',
            taskData: [],
        }
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        // console.log(this.context.filterDetails);
        this.setState({
            isFetching: true,
            filterQuery: this.context.filterDetails != undefined ? (this.context.filterDetails.id == 'extra' ? '' : this.context.filterDetails.id) : '',
            // advance: this.context.filterDetails != undefined ? (this.context.filterDetails.id == 'extra' ? 'extra=advance' : '') : '',
        }, () => {
            this.getCategoryList();
            this.getUserList();
            this.getAllTaskDatewise();
        })
    }

    onRefresh = () => {
        this.setState({ isFetching: true, }, () => { this.getCategoryList();  this.getUserList();
            this.getAllTaskDatewise(); });
    }

    getUserList = () => {
        const user_id = "";
        userList(user_id)
            .then((response) => {
                // console.log("Users>>>>>>>",response.data);
                const sources = response.data;
                let users = sources.map((a, index) => {
                    return {
                        id: a.id,
                        title: a.name,
                        priority: a.cust_code,
                        // department: a.dept_name,
                        // designation: a.desg_name,
                    }
                })
                this.setState({
                    users: users,
                    isFetching: false
                })
                // console.log(".............user..........",users)
            }).catch(error => {
                this.setState({
                    users: [],
                    isFetching: false
                })
                showError(error)
            })
    }
    sort = (sortvalue) => {
        // console.log(sortvalue)
    }

    getAllTaskDatewise = () => {
        let userID = this.context.userData.id
        getDatewiseTasks(userID).then((response) => {
            const sources = response.data;
            // console.log("task response data", sources.data)
            let data = sources.data.map((value) => {
                let priority = moderate;
                if (value.priority === "Critical") {
                    priority = critical;
                } else if (value.priority === "Danger") {
                    priority = danger;
                } else if (value.priority === "Low") {
                    priority = low;
                } else if (value.priority === "Medium") {
                    priority = moderate;
                } else if (value.priority === "High") {
                    priority = high;
                }
                let task_type = compete;
                if (value.task_type === "Individual") {
                    task_type = individual;
                } else if (value.task_type === "Rotate") {
                    task_type = rotate;
                } else if (value.task_type === "Collaborate") {
                    task_type = collaborate;
                } else if (value.task_type === "Compete") {
                    task_type = compete;
                }
                return {
                    id: value.id,
                    title: value.name,
                    category_id: value.category_id,
                    date: moment(value.schedule_start).format("Do MMM YY, ddd") + " (" + moment(value.schedule_time, "HH:mm:ss").format("LT") + ")",
                    closed_date: moment(value.updated_at).format("Do MMM YY, ddd") == 'Invalid date' ? '' : moment(value.updated_at).format("Do MMM YY, ddd"),
                    members: value.assign_level_1.split('-')[0],
                    priority: priority,
                    incident_type: value.incident_type,
                    taskType: task_type,
                    coins: value.point,
                    status: value.status,
                    values: value,
                    isSelect: false,
                    selectedClass: styles.list,
                    created: value.created_by_name,
                    closed: value.updated_by_name
                }
            })
            this.setState({
                taskData: data,
                isFetching: false,
                status: data.length === 0 ? 'No Task List Found' : ""
            })
        })
            .catch(error => {
                console.log(error);
                this.setState({
                    data: [],
                    isFetching: false
                })
            })
    }

    getData = () => {
        let { searchValue } = this.state;
        let items = this.state.users || [];
        let data = items.filter((element) => {
            let name = element.title.toLowerCase();
            let index = name.indexOf(searchValue.toLowerCase());
            return index > -1;
        });
        return data;
    };


    onSwipePerformed = (action) => {
        /// action : 'left' for left swipe
        /// action : 'right' for right swipe
        /// action : 'up' for up swipe
        /// action : 'down' for down swipe
        alert("calling")
        switch (action) {
            case 'left': {
                console.log('left Swipe performed');
                break;
            }
            case 'right': {
                console.log('right Swipe performed');
                break;
            }
            case 'up': {
                console.log('up Swipe performed');
                break;
            }
            case 'down': {
                console.log('down Swipe performed');
                break;
            }
            default: {
                console.log('Undeteceted action');
            }
        }
    }
    toggleSwitch = () => {
        this.setState({
            switchStatus: !this.state.switchStatus,
            switchCategoryStatus: false
        },()=>setTimeout(() => {
			this.inputRef.current.focus();
		}, 500))
    }

    toogleSwitchCategory = () => {
        this.setState({
            switchStatus: false,
            switchCategoryStatus: !this.state.switchCategoryStatus
        },()=>{this.getAllTaskDatewise();})
    }

    clickUser = (id , name) => {
        this.setState({
            switchStatus: !this.state.switchStatus,
            selectUserId: id
        }, () => { this.getCategoryList(id); })
    }

    getCategoryList = (id) => {

        const user_id = id ? id : 1;
        const query = this.state.filterQuery;
        const adv = this.state.advance;
        todoList(user_id, query, adv)
            .then((response) => {
                // console.log("............",response.data)
                const sources = response.data;
                // console.log(sources.data[0]);
                let categories = sources.data.map((a, index) => {
                    return {
                        id: a.id,
                        title: a.name,
                        priority: a.priority,
                        description: a.description,
                        image: a.image,
                        all_task_count: a.all_task_count,
                        completed_task_count: a.completed_task_count,
                        pending_task_count : a. pending_task_count,
                    }
                })
                this.setState({
                    status: categories.length === 0 ? 'No Task List Available' : '',
                    categories: categories,
                    isFetching: false,
                })
            }).catch(error => {
                this.setState({
                    categories: [],
                    isFetching: false,
                })
                showError(error)
            })
    }
    advance = () => {
        this.setState({ advance: !this.state.advance }, () => {
            this.getCategoryList();
        })
    }

    filterQuery = (value) => {
        if (value == 'clear') {
            this.setState({ filterQuery: '', advance: '' }, () => { this.getCategoryList() })
        } else if (value == 'extra') {
            this.setState({ filterQuery: '', advance: 'extra=advance' }, () => { this.getCategoryList() })
        } else {
            this.setState({ filterQuery: value, advance: '' }, () => { this.getCategoryList() })
        }
    }

    sort = (sortvalue) => {
        // console.log(sortvalue)
    }

    rightAction = () => {
        return (
            <Text>{" "}</Text>
        )
    }

    getPendingTask = (id) => {
        this.props.navigation.navigate('PendingTask', { catId: id })
    }

    render() {
        // console.log(this.props);
        if (this.state.categories === null) {

            return (
                <SafeAreaView style={styles.container}>
                    <Header navigation={this.props.navigation}
                        // leftNavTo={'AddCategory'}
                        title={'TO DO LIST'}
                        leftIcon={'ios-add'}
                        rightIcon={'filter'}
                        sort={this.sort}
                    />
                    <View style={styles.body}>
                        <Spinner />
                    </View>
                    {/* <Footer /> */}
                </SafeAreaView>
            )
        }
        return (
            <SafeAreaView style={styles.container}>

                <Header
                    navigation={this.props.navigation}
                    // leftNavTo={'AddCategory'}
                    switchUserIcon={this.toggleSwitch}
                    switchUserStatus={this.state.switchStatus}
                    switchCategory={this.toogleSwitchCategory}
                    switchCategoryStatus={this.state.switchCategoryStatus}
                    // filterQuery={this.filterQuery}
                    title={'TO DO LIST'}
                    // title2={true}
                    // leftIcon={'ios-add'}
                    rightIcon={'filter'}
                // extra={this.advance}
                // adv={this.state.advance}
                />

                <View style={styles.body}>
                    {this.state.switchStatus ?
                        <View>
                            <View style={styles.searchBackground}>
                                <View style={styles.searchContainer}>
                                    <Ionicons name="search" size={20} color="#ddd" />
                                    <TextInput
                                        ref={this.inputRef}
                                        value={this.state.searchValue}
                                        onChangeText={(searchValue) =>
                                            this.setState({ searchValue })
                                        }
                                        // autoCompleteType="off"
                                        placeholder=" Search here..."
                                        style={styles.searchField}
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                {
                                    this.state.users.length > 0 ?
                                        <FlatList
                                            data={this.getData()}
                                            renderItem={({ item }) => {
                                                return (
                                                    <React.Fragment key={parseInt(item.id)}>
                                                        <UserItem clickUser={this.clickUser} 
                                                        navigation={this.props.navigation} 
                                                        id={item.id} 
                                                        // designation={item.designation} 
                                                        // department={item.department} 
                                                        title={item.title} />
                                                    </React.Fragment>
                                                )
                                            }}
                                            keyExtractor={item => item.id.toString()}
                                        // onRefresh={() => this.onRefresh()}
                                        // refreshing={this.state.isFetching}
                                        />
                                        :
                                        <Text style={{ paddingBottom: 2, fontSize: 16, fontWeight: 'bold', color: '#7f7f7f' }}>No Data</Text>
                                }
                            </View>

                            {/* <Footer /> */}



                        </View>

                        : this.state.switchCategoryStatus ?
                        <View style={styles.body}>
                                {
                                    this.state.taskData.length > 0 ?
                                        <FlatList
                                            data={this.state.taskData}
                                            renderItem={({ item }) => <CatItemCard
                                                navigation={this.props.navigation}
                                                category_id={item.category_id}
                                                id={item.id}
                                                coins={item.coins}
                                                taskType={item.taskType}
                                                incident_type={item.incident_type}
                                                members={item.members}
                                                priority={item.priority}
                                                date={item.date}
                                                closed_date={item.closed_date}
                                                title={item.title}
                                                status={item.status}
                                                closed={item.closed}
                                                created={item.created}
                                                item={item}
                                                selectItem={this.selectItem}
                                                extraData={this.state.taskData}
                                            />}
                                            keyExtractor={item => item.id.toString()}
                                            onRefresh={() => this.onRefresh()}
                                            refreshing={this.state.isFetching}
                                        />
                                        :
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: Colors.primary }}>No Records !!
                                                {/* <Ionicons
                                                    name="sad-outline"
                                                    style={{ fontSize: 20, color: Colors.danger }}
                                                /> */}
                                            </Text>
                                        </View>
                                }
                            </View>

                            :
                            <>
                                {
                                    this.state.categories.length > 0 ?
                                        <FlatList
                                            data={this.state.categories}
                                            renderItem={({ item }) => {
                                                // console.log("...this.props.navigation...............",this.props.navigation)
                                                return (

                                                    <React.Fragment
                                                        key={parseInt(item.id)}>
                                                        <TodoItem navigation={this.props.navigation} route={"CategoryItems"} catId={item.id} all_task_count={item.all_task_count} completed_task_count={item.completed_task_count} img={item.image} title={item.title} selectUserId={this.state.selectUserId} filter={this.state.filterQuery} extra={this.state.advance} pending_task_count={item.pending_task_count}/>
                                                    </React.Fragment>
                                                )
                                            }}
                                            keyExtractor={item => item.id.toString()}
                                            onRefresh={() => this.onRefresh()}
                                            refreshing={this.state.isFetching}
                                        />
                                        :
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: Colors.primary }}>No Records !!
                                                {/* <Ionicons
                                                    name="sad-outline"
                                                    style={{ fontSize: 20, color: Colors.danger }}
                                                /> */}
                                            </Text>
                                        </View>
                                }</>
                    }

                </View>

                {/* <Footer /> */}



            </SafeAreaView>
        );
    }
}
export default Todo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    body: {
        // flex: 9,
        flexGrow: 1,
        height: "80%"
    },
    searchBackground: {
        backgroundColor: Colors.primary,
    },
    searchContainer: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        borderRadius: 3,
        padding: 5,
        marginTop: -5,
        marginBottom: 5,
        marginHorizontal: 10,

    },
    searchField: {
        width: "90%",
        marginLeft: 5,
        color: Colors.textColor,
        fontSize: 18,
    },
    swipesGestureContainer: {
        width: '100%',
        backgroundColor: 'red'
    },
});
