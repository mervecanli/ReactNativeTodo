import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, View, Text, StyleSheet, TextInput, FlatList} from "react-native";
import { openDatabase } from "react-native-sqlite-storage"; 


const db = openDatabase({ 
    name: "rn_sqlite",
});
 

const Todo = ({navigation}) => {

    const createTables = () => { 
        db.transaction(txn => {
            txn.executeSql(
                `CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(20), complete BOOLEAN NOT NULL CHECK (complete IN (0, 1)))`,
                [],
                (sqlTxn, res) => {
                    alert("table created successfully");
                },
                error => {
                    alert("error on creating table " + error.message);
                },
            );
        });
    };

    useEffect(async () => {
        await createTables();
        await getTodoList();
    }, []);


    const [todoTitle, setTodoTitle] = useState('');
    const [todoList, setTodoList] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);



    const renderFlatListItem = ({item}) => {
        return(
            <View style={[styles.todo, {borderColor:`${item.complete ? 'green' : 'red'}`}]}>
                <Text style={{fontSize:15, fontWeight:'bold'}}>{item.title}</Text>
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity style={styles.btnUpdate} onPress={() => updateTodo(item)} />
                    <TouchableOpacity style={styles.btnDelete} onPress={() => deleteTodo(item)} />
                </View>
            </View>
        );
    }

    const addTodo = () => {
        let isExist = false;

        if(todoTitle == '') {
            alert("Todo ismi boş geçilemez.");
            return;
        }   

        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM todos WHERE title=?`,
                [todoTitle],
                (sqlTxn, res) => {
                    let len = res.rows.length;
                    if(len>0) {
                        isExist=true;
                        alert(`${todoTitle} zaten mevcuttur.`);
                        setTodoTitle("");
                        setIsUpdate(false);
                        return;
                    }
                },
                error => {
                    alert("error on searching todo title " + error.message);
                }
            );
        });

        setTimeout(() => {

        

        if(!isExist) {
            if(!isUpdate) {
                db.transaction(txn => {
                    txn.executeSql(
                        `INSERT INTO todos (title, complete) VALUES (?,?)`,
                        [todoTitle, 0],
                        (sqlTxn, res) => {
                            alert(`${todoTitle} added succesfully.`);
                            getTodoList();
                            setTodoTitle("");
                        },
                        error => {
                            alert("error on addding new todo " + error.message);
                        },
                    );
                });
            } else {
                db.transaction(txn => {
                    txn.executeSql(
                        `UPDATE todos SET title=?, complete=? WHERE id=?`,
                        [todoTitle, updatingStatus, updatingId],
                        (sqlTxn, res) => {
                            alert(`${todoTitle} updated succesfully.`);
                            getTodoList();
                            setTodoTitle("");
                            setIsUpdate(false);
                        },
                        error => {
                            alert("error on updating todo " + error.message);
                        }          
                    );
                });
            }
            setTodoTitle('');
        }
    
    }, 500);
    }

    const getTodoList = () => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM todos ORDER BY id DESC`,
                [],
                (sqlTxn, res) => {
                    alert("todo list has been gotten successfully");
                    let len = res.rows.length;
                    if(len > 0) {
                        let results = [];
                        for(let i=0; i<len; i++) {
                            let item = res.rows.item(i);
                            results.push({id: item.id, title: item.title, complete: item.complete});
                        }
                        setTodoList(results);
                    }
                },
                error => {
                    alert("error on getting todo list " + error.message);
                },
            );
        });
    };

    const deleteTodo = (todo) => {
        let deletedTodo = todo;
        db.transaction(txn => {
            txn.executeSql(
                `DELETE FROM todos WHERE id=? `,
                [todo.id],
                (sqlTxn, res) => {
                    alert(`${deletedTodo.title} deleted succesfully.`);
                    getTodoList();
                    setTodoTitle("");
                },
                error => {
                    alert("error on deleting todo " + error.message);
                }
            );
        });

        setTodoTitle('');
    }

    const updateTodo = (todo) => {
        setTodoTitle(todo.title);
        setIsUpdate(true);
        setUpdatingId(todo.id);
        setUpdatingStatus(todo.complete);
    };

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.inputTextArea}>
                <TextInput 
                    style={styles.textInput}
                    value={todoTitle}
                    onChangeText={(value) => setTodoTitle(value)}
                />
                {   isUpdate && (
                        <View>
                            {   updatingStatus ?
                                    <TouchableOpacity style={styles.todoChangeStatus} onPress={() => setUpdatingStatus(0)}>
                                        <Text style={styles.todoChangeStatusLabel}>Todo'yu Yapılmadı Olarak İşaretle</Text>
                                    </TouchableOpacity> 
                                    :
                                    <TouchableOpacity style={styles.todoChangeStatus} onPress={() => setUpdatingStatus(1)}>
                                        <Text style={styles.todoChangeStatusLabel}>Todo'yu Yapıldı Olarak İşaretle</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    )
                }
            </View>
            <View style={styles.todoListArea}>
                {   todoList.length <= 0 && (
                        <View>
                            <Text style={{fontSize:16, color:'blue'}}>Todo listeniz boş. Yeni todo eklemeye çalışın.</Text>
                        </View>
                    )
                }
                <FlatList
                    data={todoList}
                    renderItem={renderFlatListItem}
                    keyExtractor={(todo, index) => index.toString()}
                />
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => addTodo()}>
                <Text style={styles.addBtnLabel}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    inputTextArea: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width:'100%'
    },
    textInput: {
        borderWidth:1,
        width:'90%',
        padding:10,
        borderRadius:20,
        borderColor:'#00f'
    },
    todoListArea: {
        flex:4,
        width:'100%',
        alignItems:'center'
    },
    addBtn: {
        borderWidth:1,
        width:60,
        height:60,
        borderColor:'#00f',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:30,
        backgroundColor:'#00f',
        position:'absolute',
        right:30,
        bottom:60
    },
    addBtnLabel: {
        color:'white',
        fontSize:22,
        fontWeight:'bold'
    },
    todo: {
        borderWidth:1,
        width:325,
        height:45,
        borderRadius:10,
        marginTop:20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:15,
        paddingRight:15
    },
    btnUpdate: {
        borderWidth:1,
        width:20,
        height:20,
        borderRadius:10,
        marginRight:10,
        borderColor:'orange',
        backgroundColor:'orange'
    },
    btnDelete: {
        borderWidth:1,
        width:20,
        height:20,
        borderRadius:10,
        borderColor:'red',
        backgroundColor:'red'
    },
    loading: {
        flex:1,
        justifyContent:'center'
    },
    todoChangeStatus: {
        marginTop:15,
        padding:8,
        borderWidth:1,
        borderRadius:20,
        backgroundColor:'purple',
        borderColor:'purple',
        justifyContent:'center',
        alignItems:'center'
    },
    todoChangeStatusLabel: {
        color:'white'
    }

});
export default Todo;