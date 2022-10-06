import React from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, View, Text} from "react-native";

const Home = ({navigation}) => {

    return(
        <SafeAreaView style={{flex:1, width:'100%', alignItems:'center'}}>
            <ScrollView style={{flex:1, width:'100%'}}>
                <TouchableOpacity onPress={() => navigation.navigate('Todo')} style={{margin:10, flex:1, width:'95%', height:50, alignItems:'center', justifyContent:'center', borderRadius:30, backgroundColor:'red'}}>
                    <Text style={{color:'white', fontSize:18}}>Todo'ya Geç</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
export default Home;