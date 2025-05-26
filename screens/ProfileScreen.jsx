import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Alert,
  Platform,
  TouchableOpacity,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  checkMultiple,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackIcon from '../assets/svg_wrapper/back_icon.wrapper';
import ContactsIcon from '../assets/svg_wrapper/contacts_icon.wrapper';
import MySvgComponent from '../components/mySvgComponent';
import auth from '@react-native-firebase/auth'; // Only if using Firebase auth
import { CommonActions } from '@react-navigation/native';

const permissionMap = {
  location: Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  }),
  camera: Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  }),
  contacts: Platform.select({
    ios: PERMISSIONS.IOS.CONTACTS,
    android: PERMISSIONS.ANDROID.READ_CONTACTS,
  }),
  microphone: Platform.select({
    ios: PERMISSIONS.IOS.MICROPHONE,
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  }),
  notifications: Platform.select({
    ios: PERMISSIONS.IOS.NOTIFICATIONS,
    android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
  }),
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [permissions, setPermissions] = useState({});

  const checkPermissions = async () => {
    const permissionKeys = Object.keys(permissionMap);
    const permissionValues = permissionKeys.map((key) => permissionMap[key]);
    const results = await checkMultiple(permissionValues);

    const updatedPermissions = {};
    permissionKeys.forEach((key) => {
      updatedPermissions[key] = results[permissionMap[key]] === RESULTS.GRANTED;
    });

    setPermissions(updatedPermissions);
  };

  const requestPermission = async (key) => {
    const permission = permissionMap[key];
    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      setPermissions((prev) => ({ ...prev, [key]: true }));
    } else if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Blocked',
        'Please enable this permission in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openSettings() },
        ]
      );
    } else {
      setPermissions((prev) => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const handleLogout = async () => {
  try {
    await auth().signOut();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  } catch (error) {
    console.error('Logout Error:', error);
    Alert.alert('Error', 'Something went wrong during logout.');
  }
};
  return (
    <LinearGradient colors={['#EF4444', '#850505']} style={styles.container}>
        <View style={styles.Header}>
          <BackIcon onPress={() => navigation.goBack()} />
          <Text style={styles.profile}>Profile</Text>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        </View>
        <SafeAreaView>
      <View style={styles.content}>
        <Text style={styles.title}>Profile Permissions</Text>

        {Object.keys(permissionMap).map((key) => (
          <View key={key} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.permissionLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1)} Permission
              </Text>
              <Switch
                value={permissions[key]}
                onValueChange={() => requestPermission(key)}
                thumbColor={permissions[key] ? '#34D399' : '#f4f3f4'}
                trackColor={{ false: '#767577', true: '#10B981' }}
              />
            </View>
          </View>
        ))}
         <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Contacts')}>
          <Text style={styles.linkText}>Manage Contacts</Text>
          <MySvgComponent iconName='ContactsIcon' iconColor='white'/>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={styles.linkText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#EF4444',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    flexDirection:'row',
    justifyContent:'space-around'
  },
  linkText: {
    alignSelf:'center',
    textAlign:'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  permissionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  logout:{
    borderWidth:3,
    borderRadius:10,
    width:'50%',
    alignSelf:'center',
    padding:18,
    marginTop:40,
    borderColor:'white',
    backgroundColor:'red'    
  }
});
