import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity
} from "react-native";
import {getPendingTasks} from '../../utils/api';
import Header from '../../components/tasks/Header'
import Footer from '../../components/tasks/Footer'
import CatItemCard from '../../components/tasks/CatItemCard'
import {showError} from "../../actions/Error";
import Spinner from "../../components/tasks/Spinner";
import { formatdate } from "../../utils/helper";
import { Icon } from "react-native-elements";
import AppContext from "../../context/AppContext";



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

class PendingTasks extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state={
            data:null,
            status:"loading...."
        }
    }

    componentDidMount() {
        getPendingTasks(this.props.route.params.catId, "")
            .then((response)=>{
                const sources = response.data;
                console.log(sources)
                let data = sources.data.map((value)=>{
                    let priority=moderate;
                    if (value.priority==="Critical"){
                        priority=critical;
                    }else if (value.priority==="Danger"){
                        priority=danger;
                    }else if (value.priority==="Low"){
                        priority=low;
                    }else if (value.priority==="Medium"){
                        priority=moderate;
                    }else if (value.priority==="High"){
                        priority=high;
                    }
                    let task_type=compete;
                    if (value.task_type==="Individual"){
                        task_type=individual;
                    }else if (value.task_type==="Rotate"){
                        task_type=rotate;
                    }else if (value.task_type==="Collaborate"){
                        task_type=collaborate;
                    }else if (value.task_type==="Compete"){
                        task_type=compete;
                    }

                    return{
                        id: value.id,
                        title: value.name,
                        category_id: value.category_id,
                        date: formatdate(value.schedule_start, 'true'),
                        members: value.assign_level_1,
                        priority: priority,
                        taskType: task_type,
                        coins: value.point,
                        status: value.status,
                        values:value,
                        isSelect : false,
                        selectedClass : styles.list,
                    }
                })
                this.setState({
                    data:data,
                    status:data.length===0?'No Task List Found':""
                })
            })
            .catch(error=> {
                showError(error);
                this.setState({
                    data:[]
                })
            })
    }

    selectItem = data => {
        let priority = compete;
                    if (data.values.priority==="Critical"){
                        priority=critical;
                    }else if (data.values.priority==="Danger"){
                        priority=danger;
                    }else if (data.values.priority==="Low"){
                        priority=low;
                    }else if (data.values.priority==="Medium"){
                        priority=moderate;
                    }else if (data.values.priority==="High"){
                        priority=high;
                    }

        data.isSelect = !data.isSelect;
        data.selectedClass = data.isSelect ? styles.selected : styles.list;
        data.priority = data.isSelect ? greentick : priority;
        
        const index = this.state.data.findIndex(
            item => data.id === item.id
        );

        this.state.data[index] = data;

        this.setState({
            data: this.state.data,
        });
      };

      goToAssign = () => {
        const { title,id } = this.props.route.params;
        const items = this.state.data.filter(item => item.isSelect);
        if(items.length === 0){
            alert("Select at least one task");
            return;
        }
        this.props.navigation.push('NewAssignScreen',{items, title,id})
      } 

    render() {
        const { title,id } = this.props.route.params;

        if (this.state.data===null){
            return (
                <SafeAreaView style={styles.container}>
                    <Header
                        navigation={this.props.navigation}
                        leftNavTo={'Todo'}
                        params={{category_id:id , task_id: ''}}
                        title={"Pending Tasks"}
                        leftIcon={'ios-add'}
                        rightIcon={'filter'}
                    />
                    <View style={styles.body}>
                        <Spinner/>
                    </View>
                    <Footer />
                </SafeAreaView>
            )
        }
        
        const itemNumber = this.state.data.filter(item => item.isSelect).length;
        return (
            <SafeAreaView style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    leftNavTo={'Todo'}
                    params={{category_id:id}}
                    title={"Pending Tasks"}
                    leftIcon={'ios-add'}
                    rightIcon={'filter'}
                />
                <View style={styles.body}>
                    {
                        this.state.data.length>0?
                            <FlatList
                                data={this.state.data}
                                renderItem={({ item }) => <CatItemCard
                                    navigation={this.props.navigation}
                                    category_id={item.category_id}
                                    id={item.id}
                                    coins={item.coins}
                                    taskType={item.taskType}
                                    members={item.members}
                                    priority={item.priority}
                                    date={item.date}
                                    title={item.title}
                                    status={item.status}
                                    item={item}
                                    selectItem={this.selectItem}
                                    extraData={this.state.data}
                                />}
                                keyExtractor={item => item.id.toString()}
                            />
                            :
                            <Text style={{ paddingBottom: 2, fontSize: 16, fontWeight: 'bold', color: '#7f7f7f' }}>{this.state.status}</Text>
                    }

                            <View style={styles.numberBox}>
                                <Text style={styles.number}>{itemNumber}</Text>
                            </View>
                            
                            <TouchableOpacity style={styles.icon}>
                                <View>
                                <Icon
                                    raised
                                    name="assignment-ind"
                                    type="material-icons"
                                    color="#e3e3e3" 
                                    size={30} 
                                    onPress={() => this.goToAssign()}
                                    containerStyle={{ backgroundColor: "#FA7B5F" }}
                                />
                                </View>
                            </TouchableOpacity>

                </View>

                <Footer />
            </SafeAreaView>
        );
    }
}
export default PendingTasks;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    body: {
        flex: 9
    },
    selected: {backgroundColor: "#d3d3d3"},
    list: {},
    icon: {
        position: "absolute",  
        bottom: 20,
        width: "100%", 
        left: 290, 
        zIndex: 1
      },
      numberBox: {
        position: "absolute",
        bottom: 75,
        width: 30,
        height: 30,
        borderRadius: 15,  
        left: 330,
        zIndex: 3,
        backgroundColor: "#e3e3e3",
        justifyContent: "center",
        alignItems: "center"
      },
      number: {fontSize: 14,color: "#000"},
});


