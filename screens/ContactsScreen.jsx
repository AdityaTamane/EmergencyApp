import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ProfileIcon from '../assets/svg_wrapper/profile_icon.wrapper';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import BackIcon from '../assets/svg_wrapper/back_icon.wrapper';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState([]);
  const [openModal, setopenModal] = useState(false);
  const navigation = useNavigation();

  const addContact = async () => {
    if (!name || !phone || !email) {
      return Alert.alert('Error', 'Fill all fields');
    }

    const newContact = { name, phone, email };
    await firestore().collection('emergencyContacts').add(newContact);
    fetchContacts();
    setName('');
    setPhone('');
    setEmail('');
    setopenModal(false); // close modal after adding
    Alert.alert('Emergency', 'Contact Added');
  };

  const fetchContacts = async () => {
    try {
      const snapshot = await firestore().collection('emergencyContacts').get();
      const contactsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContacts(contactsList);
    } catch (error) {
      Alert.alert('Error', 'Failed to load contacts');
    }
  };

  const deleteContact = (id) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore().collection('emergencyContacts').doc(id).delete();
              fetchContacts();
              Alert.alert('Success', 'Contact deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete contact');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchContacts();
    }, [])
  );

  return (
    <LinearGradient colors={['#EF4444', '#850505']} style={styles.container}>
      <SafeAreaView>
        <View style={styles.Header}>
          <BackIcon onPress={() => navigation.goBack()} />
          <Text style={styles.profile}>CONTACTS</Text>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        </View>

        <View style={{ padding: 20 }}>
          <FlatList
            data={contacts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.contactscard}>  
              <View style={styles.contactscard1}>
                <Text style={styles.NAME}>{item.name}</Text>
                <Text style={styles.PHONE}>- {item.phone}</Text>
                <Text style={styles.EMAIL}>- {item.email}</Text>
              </View>
              <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteContact(item.id)}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
                </View>
            )}
          />
          <TouchableOpacity style={styles.btn} onPress={() => setopenModal(true)}>
            <Text style={styles.btnText}>Add Contact</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={openModal}
          onRequestClose={() => setopenModal(false)}
          transparent={true}
          animationType="slide"
        >
        
          <View style={styles.modalContainer}>
            <LinearGradient colors={['#EF4444', '#850505']} style={styles.modalContent}>
            <View>
               <Text style={styles.details}>Fill Details</Text>
              <TextInput
                placeholder="Name"
                placeholderTextColor={'white'}
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                placeholder="Phone"
                placeholderTextColor={'white'}
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor={'white'}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
              />
              <View style={styles.modalbtns}>   
              <TouchableOpacity style={styles.cancelbtn} onPress={() => setopenModal(false)}>
                <Text style={styles.cancletext}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addbtn} onPress={addContact}>
                <Text style={styles.btnText}>Add Contact</Text>
              </TouchableOpacity>
              </View>

            </View>
            </LinearGradient>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  Header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  logo: {
    height: 50,
    width: 50,
    marginRight: 10,
    alignSelf: 'center',
  },
  profile: {
    color: 'red',
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  input: {
    borderWidth: 3,
    borderColor: 'white',
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    color: 'white',
  },
  btn: {
    backgroundColor: '#EF4444',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  contactscard: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'gray',
    marginTop: 16,
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    // alignItems: 'center',
  },
  deleteBtn: {
    justifyContent:'center',
  },
  deleteBtnText: {
    color: 'white',
    fontWeight: 'bold',
    borderWidth:1,
    padding:10,
    borderRadius:10,
    borderColor:'red',
    backgroundColor:'red'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding:20,  
  },
  modalContent: {
    backgroundColor: '#E53828',
    borderRadius: 20,
    borderWidth:5,
    borderColor:'white',
    padding: 20,
    paddingVertical:60
  },
  modalbtns:{
    marginTop:20,
    flexDirection:'row',
    justifyContent:'space-around'
  },
  cancelbtn:{
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: 'red',
    width: '40%',
    alignSelf: 'center',
    marginTop: 10,
  },
  cancletext:{
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addbtn:{
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    width: '40%',
    alignSelf: 'center',
    marginTop: 10,
  },
  NAME:{
    fontSize:18,
    fontWeight:'bold',
  },
  PHONE:{
    marginTop:2,
    marginLeft:20,
    fontSize:14,
  },
  EMAIL:{
    marginTop:2,
    marginLeft:20,
    fontSize:14,
    textDecorationLine:'underline',
    color:'blue'
  },
  details:{
    fontSize:20,
    textAlign:'center',
    fontWeight:'800',
    color:'#fff',
    marginBottom:10
  }
});
