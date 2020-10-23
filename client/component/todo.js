import React, {Component} from 'react';
import { View, Image, Alert, RefreshControl } from 'react-native';
import { Container, Header, Left, Right, Title, Text, Body, Content, Input, Item, Button, Card, CardItem, Toast, Root } from 'native-base';
import axios from 'axios';



class Todo extends Component {

    constructor() {
        super();
        this.state ={
          todoArray : [],
          inputTask : '',
          updatedInputTask : '',
          updateIndex : '',
          refreshing : false,
          updateBox : false
        }
    
    }


    componentDidMount() {
        this.getTodo();
    }


    getTodo() {
        const { todoArray } = this.state;
     
        axios.get('https://tododb-server2.herokuapp.com/api/todoDB/')
             .then(res => {

                for(var i=0;i<res.data.length;i++) {
                    var obj = {
                        id : res.data[i]._id,
                        name : res.data[i].name,
                        date : res.data[i].added_date
                    }
                    todoArray.push(obj)
                    this.setState({todoArray})
                }

             })
             .catch(err => {
                 console.log(err);
             })

    }


    addTodo() {
        const { todoArray, inputTask, refresh } = this.state;
        
        if(inputTask.length > 0) {

            const newTodo = {
                name : inputTask
            }

            axios.post('https://tododb-server2.herokuapp.com/api/todoDB/' , newTodo)
                .then((res) => {
                    Toast.show({
                         text: "Task has been added.",
                         duration: 5000
                    })

                    var obj = {
                        id : res.data._id,
                        name : res.data.name,
                        date : res.data.added_date
                    }
                    this.setState({todoArray : this.state.todoArray.concat(obj)})
                })
                
            this.setState({inputTask : ''})
            
        }
        else {
            Toast.show({
                text: "Please type something",
                duration: 3000
            })
        }
    }


    deleteTodo(i) {
        const { todoArray } = this.state;

        Alert.alert(
            "Are you sure ?",
            "You won't be able to revert this!",
            [
                {
                    text : "Cancel"
                },
                {
                    text: "Yes, delete it", onPress: () => {
                        axios.delete('https://tododb-server2.herokuapp.com/api/todoDB/'+todoArray[i].id)
                        this.setState({todoArray: this.state.todoArray.filter(todo => todo.id != todoArray[i].id)})
                        Toast.show({
                            text: "Your task has been deleted.",
                            duration: 3000
                        })
                    }
                }
            ]
        );
        
    }


    showUpdateBox(i) {
        const { todoArray, updateBox, updateIndex } = this.state;

        //const todo = prompt("Enter Task...");
        //alert('asd')
        if (updateBox == true) {
            this.setState({updateBox : false});
        }
        else {
            this.setState({updateBox : true, updateIndex : i});
        }
        
    }


    updateTodo() {
        const { todoArray , updateIndex, updatedInputTask, updateBox } = this.state;

        const updatedTodo = {
            name : updatedInputTask
        }

        if (updatedInputTask.length > 0) {
            axios.put('https://tododb-server2.herokuapp.com/api/todoDB/'+todoArray[updateIndex].id , updatedTodo)
                 .then((res) => {
                    Toast.show({
                        text: "Task has been updated",
                        duration: 5000
                   })

                   var obj = {
                        id : res.data._id,
                        name : res.data.name,
                        date : res.data.added_date
                    }

                    this.state.todoArray.splice( updateIndex , 1 , obj )
                    this.setState({todoArray})

                 })
            this.setState({updatedInputTask : '', updateIndex : '', updateBox : false})
        }
        else {
            Toast.show({
                text: "Please type something.",
                duration: 3000
           })
        }
        
    } 


    refreshData() {
        const { todoArray, refreshing, updateBox } = this.state;
        todoArray.splice(0,todoArray.length)
        this.setState({refreshing : false, updateBox : false});
        this.getTodo();
    }


    render() {
        const { todoArray, refreshing, updateBox } = this.state;

      return (<Root>
        <Container>

            <Header>
                <Left/>
                <Body>
                    <Title>Todo App</Title>
                </Body>
                <Right/>
            </Header>
      
            <Content refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refreshData()} />   }> 

                <View style={{flexDirection:"row", margin:10}}>
        
                    <Item rounded style={{width:220}}>
                        <Input placeholder='Enter Task...' onChangeText={(txt) => this.setState({ inputTask : txt })}  value={this.state.inputTask} />
                    </Item>

                    <Button success style={{margin:5}} onPress={()=>this.addTodo()}><Text>Add Task</Text></Button>

                </View>


                {this.state.updateBox && 
                    <View style={{flexDirection:"row", margin:10, marginTop : 20}}>

                        <Item rounded style={{width:220}}>
                            <Input placeholder='Enter Task...' onChangeText={(txt) => this.setState({ updatedInputTask : txt })}  value={this.state.updatedInputTask} />
                        </Item>

                        <Button style={{margin:5, backgroundColor:'#31B0F4', width:97}} onPress={()=>this.updateTodo()}><Text>  Update</Text></Button>

                    </View>

                }

                

                {todoArray.map((val , ind) => {
                    return(
                        <Card key={val.id} style={{margin:500}}>
                            <CardItem cardBody>
                                <Body><Image source={require('../images/icon.png')} style={{height : 140, width:140, alignSelf:'center'}} /></Body>
                            </CardItem>
                            <CardItem>
                                <Body style={{alignItems:"center"}}><Text style={{fontSize:20}}>{val.name}</Text></Body>
                            </CardItem>
                            <CardItem>
                                <Left>
                                    <Button danger style={{margin:5}} onPress={()=>this.deleteTodo(ind)}><Text>Delete Task</Text></Button>
                                </Left>

                                <Right>
                                    <Button style={{margin:5, backgroundColor:'#31B0F4'}} onPress={()=>this.showUpdateBox(ind)}><Text>Update Task</Text></Button>
                                </Right>
                            </CardItem>
                        </Card>
                    )
                })}

            </Content>

        </Container></Root>
      );
    }
    
  }
  
export default Todo;
