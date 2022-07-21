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
import React, {useState} from 'react';
import Header from '../Components/Header';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {utils} from '@react-native-firebase/app';
import CameraRoll from '@react-native-community/cameraroll';
import ModalPhotoGallery from '../Components/ModalPhotoGallery';

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
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const UserImages = () => {
  const [phonePhotos, setPhonePhotos] = useState<object[]>();
  const [storagePhotos, setStoragePhotos] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const getUserPhotos = () => {
    CameraRoll.getPhotos({
      first: 15,
      assetType: 'Photos',
      groupName: 'Camera',
      include: ['filename'],
    })
      .then(response => {
        setPhonePhotos(response.edges);
        console.log(response.edges[0].node.image.uri);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getStoragePhotos = (ref: string) => {
    const fetchedPhotos: string[] = [];
    storage()
      .ref(ref)
      .list()
      .then(result => {
        result.items.forEach(ref => {
          storage()
            .ref(ref.fullPath)
            .getDownloadURL()
            .then(res => {
              fetchedPhotos.push(res);
              setStoragePhotos(fetchedPhotos);
              // console.log(storagePhotos);
              // console.log(fetchedPhotos)
            })
            .catch(err => console.log(err));
        });
        // if (result.nextPageToken) {
        //   return getStoragePhotos(ref, result.nextPageToken);
        // }
      })
      .catch(err => console.log(err));
  };

  const handleSelect = (item: any) => {
    let ids: string[] = [...selectedItems];

    if (ids.includes(item.node.image.filename)) {
      ids = ids.filter(name => name !== item.node.image.filename);
    } else ids.push(item.node.image.filename);
    setSelectedItems(ids);
  };

  const renderStoragePhotos = ({item}: any) => {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={{width: '97%', height: 200}} source={{uri: item}} />
        </View>
      </View>
    );
  };
  const renderUserPhotos = ({item}: any) => {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => handleSelect(item)}>
            <Image
              style={[
                {
                  width: '97%',
                  height: 200,
                  marginVertical: 2,
                  borderWidth: 1,
                  borderColor: 'grey',
                  //   resizeMode: 'contain',
                },
                selectedItems.includes(item.node.image.filename) &&
                  styles.selectedStyle,
              ]}
              source={{
                uri: item.node.image.uri,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const reference = storage().ref('imageTest/toto.jpg');
  const uploadFile = () => {
    // const imageName = item.node.image.filename;
    // const bucketReference = `${utils.FilePath.PICTURES_DIRECTORY}/${imageName}`;

    // const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/IMG_20220716_135902.jpg`;
    // const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/Reddit/414888b.jpg`;
    const pathToFile =
      'file:///storage/emulated/0/DCIM/Camera/IMG_20220716_135902.jpg'.split(
        'file://',
      )[1];
    console.log(pathToFile);
    reference
      .putFile(pathToFile)
      .then(answer => console.log(answer, 'yas'))
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={storagePhotos}
        renderItem={renderStoragePhotos}
        numColumns={3}
      />
      <FlatList
        data={phonePhotos}
        renderItem={renderUserPhotos}
        numColumns={3}
        extraData={selectedItems}
        // keyExtractor={item => item.node.image.filename}
      />
      <View>
        {/* <Button title="request permissions" onPress={requestCameraPermission} /> */}
        {/* <Button title="Upload" onPress={uploadFile} /> */}
        {/* <Button
          title="Get storage Photos"
          onPress={() => getStoragePhotos('imageTest')}
        /> */}
        <Button title="Upload a photo from gallery" onPress={getUserPhotos} />
        <View
          style={{height: 40, width: '100%', position: 'absolute', bottom: 0}}>
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
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // flexWrap: 'wrap',
    // backgroundColor: "tomato",
  },
  selectedStyle: {
    borderWidth: 4,
    borderColor: 'dodgerblue',
  },
});
