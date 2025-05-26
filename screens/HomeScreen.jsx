import { StyleSheet, Text, View, Image, TouchableOpacity, Linking, Alert, Platform, ScrollView, PermissionsAndroid, Switch,ActivityIndicator, Modal} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { launchCamera } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MySvgComponent from '../components/mySvgComponent';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import ProfileIcon from '../assets/svg_wrapper/profile_icon.wrapper';
import CameraIcon from '../assets/svg_wrapper/camera_icon.wrapper';
import ContactsIcon from '../assets/svg_wrapper/contacts_icon.wrapper';

const HomeScreen = () => {
  const [isVideoMode, setIsVideoMode] = useState(false); 
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleSOSPress = () => {
    Linking.openURL('tel:112');
  };

  useEffect(() => {
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }
    }

    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      error => {
        console.error(error);
        Alert.alert('Error', 'Unable to fetch location: ' + error.message);
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
    );
  };

  requestLocationPermission();
}, []);

const getlocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
    );
  });
};

const requestCameraPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera to report incidents.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true;
    }
  } catch (err) {
    console.warn('Camera permission error:', err);
    return false;
  }
};

  // const handleReportIncident = async () => {
  //   const result = await launchCamera({
  //     mediaType: isVideoMode ? 'video' : 'photo',
  //     videoQuality: 'high',
  //     saveToPhotos: true,
  //   });

  //   if (result.didCancel) {
  //     console.log('User cancelled camera');
  //     return;
  //   }

  //   const asset = result.assets?.[0];
  //   if (!asset || !asset.uri) {
  //     console.error('No media captured');
  //     Alert.alert('Error', 'No media captured');
  //     return;
  //   }

  //   const uri = Platform.OS === 'android' ? asset.uri.replace('file://', '') : asset.uri;
  //   const fileName = `${Date.now()}.${isVideoMode ? 'mp4' : 'jpg'}`;
  //   const storagePath = `incidents/${fileName}`;
  //   const reference = storage().ref(storagePath);

  //   try {
  //     await reference.putFile(uri);
  //     const downloadUrl = await reference.getDownloadURL();
  //     console.log(`${isVideoMode ? 'Video' : 'Image'} uploaded:`, downloadUrl);
  //     Alert.alert('Success', `${isVideoMode ? 'Video' : 'Image'} uploaded successfully!`);
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //     Alert.alert('Upload Failed', 'Something went wrong while uploading media.');
  //   }
  // };
const handleReportIncident = async () => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    Alert.alert('Permission Required', 'Camera permission is required to report an incident.');
    return;
  }

  const result = await launchCamera({
    mediaType: isVideoMode ? 'video' : 'photo',
    videoQuality: 'high',
    saveToPhotos: true,
  });

  if (result.didCancel) {
    console.log('User cancelled camera');
    return;
  }

  const asset = result.assets?.[0];
  if (!asset || !asset.uri) {
    console.error('No media captured');
    Alert.alert('Error', 'No media captured');
    return;
  }

  setLoading(true); 

  const uri = Platform.OS === 'android' ? asset.uri.replace('file://', '') : asset.uri;
  const fileName = `${Date.now()}.${isVideoMode ? 'mp4' : 'jpg'}`;
  const storagePath = `incidents/${fileName}`;
  const reference = storage().ref(storagePath);

  try {
    await reference.putFile(uri);
    const downloadUrl = await reference.getDownloadURL();

    const snapshot = await firestore().collection('emergencyContacts').get();
    const emails = snapshot.docs.map(doc => doc.data().email).join(',');

    const location = await getlocation();
    const { latitude, longitude } = location.coords;
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    const subject = 'Emergency Incident Reported';
    const body = `An incident has been reported.\n\nIncident View Link: \n${downloadUrl}\n \nAccess the Location from: \n${mapsLink}\n\nPlease take necessary action.`;
    const emailUrl = `mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(emailUrl);
  } catch (error) {
    console.error('Upload or email failed:', error);
    Alert.alert('Upload Failed', error.message || 'Something went wrong while uploading media or sending email.');
  } finally {
    setLoading(false); // Stop loader
  }
};
  return (
    <>
    <View style={styles.Header}>
        <ProfileIcon onPress={()=>navigation.navigate("Profile")}/>
        <Text style={styles.dashboard}>DASHBOARD</Text>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        
      </View>
    <ScrollView>     
      <LinearGradient colors={['#EF4444', '#850505']} style={styles.container}>
        <SafeAreaView>
          {/* <Image source={require('../assets/images/map.png')} style={styles.map} /> */}
        {/* <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
        </MapView> */}

        {!location ? (
          <View style={styles.map}>
          <Text style={{ color: '#fff', textAlign: 'center', marginTop:'40%'}}>
            Fetching location...
          <ActivityIndicator size="large" color="#fff" style={styles.indicator} />
          </Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            showsUserLocation={true}
            region={location}
          >
            <Marker coordinate={location} title="You are here" />
          </MapView>
        )}

          <View style={styles.buttonContainer}>
             <View style={styles.filterToggleContainer}>
                <TouchableOpacity
                  style={[styles.filterButton, !isVideoMode && styles.filterButtonActive]}
                  onPress={() => setIsVideoMode(false)}
                >
                  <Text style={[styles.filterButtonText, !isVideoMode && styles.filterButtonTextActive]}>
                    Photo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterButton, isVideoMode && styles.filterButtonActive]}
                  onPress={() => setIsVideoMode(true)}
                >
                  <Text style={[styles.filterButtonText, isVideoMode && styles.filterButtonTextActive]}>
                    Video
                  </Text>
                </TouchableOpacity>
              </View>

            <TouchableOpacity style={styles.card} onPress={handleReportIncident}>
              <Text style={styles.cardText}>REPORT {isVideoMode ? 'INCIDENT' : 'INCIDENT'}</Text>
              <CameraIcon onPress={handleReportIncident}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={()=>{navigation.navigate("Contacts")}}>
              <Text style={styles.cardText}>EMERGENCY CONTACTS</Text>
              <ContactsIcon onPress={()=>{navigation.navigate("Contacts")}}/>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.SOS} onPress={handleSOSPress}>
            <Text style={styles.sosText1}>SOS</Text>
            <Text style={styles.sosText2}>Dial emergency number instantly</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
      </ScrollView>
      <Modal visible={loading} transparent={true} animationType="fade">
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      </Modal>

    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  Header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding:10
  },
  logo: {
    height: 50,
    width: 50,
    marginRight: 10,
    alignSelf: 'center',
  },
  dashboard: {
    color: 'red',
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf:'center'
  },
  profile: {
    alignSelf: 'center',
    marginLeft:10
  },
  buttonContainer: {
    alignSelf: 'center',
  },
  card: {
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#fff',
    padding: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    width: 360,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  cardText: {
    alignSelf:'center',
    textAlign: 'center',
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
  SOS: {
    backgroundColor: '#EF4444',
    borderWidth: 4,
    borderColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginTop: 40,
    marginBottom:20,
    width: '80%',
    alignSelf: 'center',
  },
  sosText1: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    elevation: 4,
  },
  sosText2: {
    color: 'white',
    textAlign: 'center',
    elevation: 4,
  },
  map: {
    borderRadius: 100,
    height: 310,
    width: '100%',
  },
  filterToggleContainer: {
  flexDirection: 'row',
  alignSelf: 'center',
  backgroundColor: '#fff',
  borderRadius: 100,
  overflow: 'hidden',
  borderWidth: 2,
  borderColor: '#EF4444',
  marginTop: 20,
  padding:6,
  paddingHorizontal:10
},

filterButton: {
  paddingVertical: 12,
  paddingHorizontal: 50,
  backgroundColor: '#fff',
  borderRadius:100
},

filterButtonActive: {
  backgroundColor: '#EF4444',
},

filterButtonText: {
  color: '#EF4444',
  fontWeight: 'bold',
  fontSize: 16,
},

filterButtonTextActive: {
  color: '#fff',
},
 loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
  indicator:{
    marginTop:20
  }
});
