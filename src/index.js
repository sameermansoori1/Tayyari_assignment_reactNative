import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'


const TayyariApp = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        <TouchableOpacity
        style={styles.category}
        onPress={()=> navigation.navigate('TayyariScreen',{category: 'Chemistry'})}
        >
          <Text style={styles.categoryTitle}>Chemistry</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default TayyariApp

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'center',
    },
    categoryContainer:{
      flexDirection:'row',
      flexWrap:'wrap',
      justifyContent:'center',
      alignItems:'center',
     
    },
    category:{
      width:150,
      height:150,
      margin:10,
      borderRadius:10,
      backgroundColor:"#FFFFFF",
      shadowColor:'#000000',
      shadowOpacity:0.3,
      shadowRadius:5,
      elevation:5,
      justifyContent:'center',
      alignItems:'center'

    },
    categoryTitle:{
      fontSize:20,
      fontWeight:'bold',
      textAlign:'center',
      color:'#000000'
    }
  });