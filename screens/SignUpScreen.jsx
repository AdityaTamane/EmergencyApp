import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
  Alert,
  Touchable,
  TouchableOpacity,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth'

const handleSOSPress = () => {
    Linking.openURL('tel:112'); 
  };

const SignUpScreen = () => {

  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
  
    auth().createUserWithEmailAndPassword(email, password)
        .then(()=>{
            Alert.alert('Registered sucessfully', email);
            navigation.replace('Login')
            setEmail('')
            setPassword('')
        }).catch((e)=>{
            console.log(e);
            Alert.alert(e.message)
        })

        if (!email || !password) {
              Alert.alert('Error', 'Please enter both email and password.');
              return;
            }
  };

  return (
    <LinearGradient
          colors={['#EF4444', '#850505']}
          style={styles.container}
        >
     <SafeAreaView>
          <Image
            source={require('../assets/images/logo.png')} 
            style={styles.logo}
          />
          <Text style={styles.inputText}>Enter Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.inputText}>Create Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.bottomView}>
          <View style={styles.downOpt}>
            <Text style={styles.registerbtn}>Already Signed Up?</Text>
            <TouchableOpacity 
             onPress={() => navigation.replace('Login')}>
              <Text style={[styles.registerbtn, {fontWeight:'bold',textDecorationLine:'underline'}]}>Log In</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.logInbtn}>Sign In</Text>
            </TouchableOpacity>
          </View>
          </View>
    
          <View style={styles.textView}>
          <Text style={styles.registerbtn}>Please allow access for following</Text>
          <Text style={styles.registerbtn}>-Location</Text>
          <Text style={styles.registerbtn}>-Camera</Text>
          <Text style={styles.registerbtn}>-Make Calls</Text>
          </View>
    
          <TouchableOpacity style={styles.SOS} onPress={handleSOSPress}>
            <Text style={styles.sosText1}>SOS</Text>
            <Text style={styles.sosText2}>Dial emergency number instantly</Text>
          </TouchableOpacity>
        </SafeAreaView>
        </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'red',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 40,
    borderRadius:100,
    borderWidth:2,
    borderColor:'white',
    backgroundColor:'white'
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    marginBottom: 20,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation:4
  },
  buttonContainer: {
    width:'25%',  
    marginTop:10,
    borderWidth:4,
    borderRadius:10,
    borderColor:'white',
    padding:10
  },
  logInbtn:{
    color:'white',
    textAlign:'center'
  },
  downOpt:{
    flexDirection:'row',
    gap:10,
    marginTop:10
  },
  registerbtn:{
    color:'white',
    fontSize:16
  },
  bottomView:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
  textView:{
    marginTop:30,
  },
  SOS:{
    backgroundColor:'#EF4444',
    borderWidth:4,
    borderColor:'white',
    padding:10,
    borderRadius:10,
    marginTop:40,
    width:'80%',
    alignSelf:'center',
  },
  sosText1:{
    fontSize:40,
    textAlign:'center',
    color:'white',
    fontWeight:'bold',
    elevation:4
  },
  sosText2:{
    color:'white',
    textAlign:'center',
    elevation:4
  },
  inputText:{
    color:'white',
    fontSize:16,
    fontWeight:'bold',
    marginBottom:5
  }
});

export default SignUpScreen;
