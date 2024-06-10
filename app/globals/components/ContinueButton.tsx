import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';


function ContinueButton(props:any){
  const {title, onPress} = props;
  return(
  <Button style={styles.button} mode="contained" onPress={onPress}>
    <Text style={{color:"#000000", fontSize:15, fontWeight:"bold"}}>{title}</Text>
  </Button>
  )
}


const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ECCA9C', // Light brown color similar to the image
    borderRadius: 25,
    borderColor:"#000000",   
    borderWidth:3,       // Rounded corners
    fontSize:15,
    fontWeight:"bold",
  },
});

export default ContinueButton;
