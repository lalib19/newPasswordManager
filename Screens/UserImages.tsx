import {
  Button,
  FlatList,
  Image,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../Components/Header';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {utils} from '@react-native-firebase/app';
import CameraRoll from '@react-native-community/cameraroll';
import ModalPhotoGallery from '../Components/ModalPhotoGallery';
import auth, {firebase} from '@react-native-firebase/auth';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
const currentUserId: string | undefined = firebase.auth().currentUser?.uid;

const UserImages = () => {
  const [storagePhotos, setStoragePhotos] = useState<string[]>([]);

  const getStoragePhotos = (reference: any) => {
    const fetchedPhotos: string[] = [];
    return reference
      .list()
      .then((result: {items: any[]}) => {
        result.items.forEach(ref => {
          storage()
            .ref(ref.fullPath)
            .getDownloadURL()
            .then(res => {
              fetchedPhotos.push(res);
              setStoragePhotos(fetchedPhotos);
              // console.log(fetchedPhotos)
            })
            .catch(err => console.log(err));
        });
        // if (result.nextPageToken) {
        //   return getStoragePhotos(ref, result.nextPageToken);
        // }
      })
      .catch((err: any) => console.log(err));
  };

  const deletePhoto = ({item}: any) => {
    console.log(item)
  }
  const renderStoragePhotos = ({item}: any) => {
    return (
      <TouchableOpacity onLongPress={() => deletePhoto(item)}>
        <Image
          source={{uri: item}}
          style={{width: 125, height: 200, margin: 1}}
        />
      </TouchableOpacity>
    );
  };

  const reference = storage().ref(`${currentUserId}`);
  useEffect(() => {
    requestCameraPermission();
    getStoragePhotos(reference).then(() => {
      console.log('Finished listing');
    });
    // return () => getStoragePhotos(`${currentUserId}`);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={storagePhotos}
        renderItem={renderStoragePhotos}
        numColumns={3}
      />
      <View>
        {/* <Button title="request permissions" onPress={requestCameraPermission} /> */}
        <View style={{height: 40, width: '100%'}}>
          {/* <Button
              title="Get storage Photos"
              onPress={() => getStoragePhotos(`${currentUserId}`)}
            /> */}
          <ModalPhotoGallery />
        </View>
      </View>
    </View>
  );
};

export default UserImages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    // height: 300,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    backgroundColor: 'tomato',
  },
  selectedStyle: {
    borderWidth: 4,
    borderColor: 'dodgerblue',
  },
});
