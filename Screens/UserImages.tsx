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
  const [photos, setPhotos] = useState<any>();
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<[]>([])

  const userPhotos = () => {
    CameraRoll.getPhotos({
      first: 60,
      assetType: 'Photos',
      groupName: 'Camera',
      include: ['filename'],
    })
      .then(response => {
        setPhotos(response.edges);
        // console.log(response.edges[0].node.image.filename);
        // console.log(response.edges);
      })
      .catch(err => {
        console.log(err);
      });
  };

//   const toggleSelect = (index: string | number) => {
//     setIsSelected(prevState => {
//       prevState.items[index].selected = !prevState.items[index].selected;
//       return {...prevState};
//     });
//   };

const handleSelect = (item: any) => {
    setIsSelected(!isSelected)
}

  const renderPhotos = ({item, keyExtractor}: any) => {
    const imageName = item.node.image.filename;
    const bucketReference = `${utils.FilePath.PICTURES_DIRECTORY}/${imageName}`;
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={(item) => handleSelect}>
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
                isSelected && styles.selectedStyle,
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

  const reference = storage().ref('imageTest/414888b.jpg');
  const uploadFile = () => {
    // const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/IMG_20220716_135902.jpg`;
    const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/Reddit/414888b.jpg`;
    reference
      .putFile(pathToFile)
      .then(answer => console.log(answer, 'yas'))
      .catch(err => console.log(err));
  };

  return (
    <View>
      <FlatList
        data={photos}
        renderItem={renderPhotos}
        numColumns={3}
        keyExtractor={item => item.node.image.filename}
      />
      <View>
        {/* <Button title="request permissions" onPress={requestCameraPermission} /> */}
        <Button title="Upload" onPress={uploadFile} />
        <Button title="Choose a photo" onPress={userPhotos} />
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
    flexWrap: 'wrap',
    flexDirection: 'row',
    // backgroundColor: "tomato",
  },
  selectedStyle: {
    borderWidth: 4,
    borderColor: 'dodgerblue',
  },
});
