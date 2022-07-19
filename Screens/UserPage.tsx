import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Button,
  Alert,
  TouchableHighlight,
  TouchableNativeFeedback,
  Pressable,
  PermissionsAndroid,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {utils} from '@react-native-firebase/app';
import {useNavigation} from '@react-navigation/native';
import {RouteParams} from '../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalComponent from '../Components/ModalComponent';
import Header from '../Components/Header';
import Clipboard from '@react-native-clipboard/clipboard';
import CameraRoll from '@react-native-community/cameraroll';

// import Ionicons from 'react-native-ionicons';

type PasswordArray = {
  data: any;
  id: string;
};

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

const UserPage = ({}) => {
  const [userPasswords, setUserPasswords] = useState<PasswordArray[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [photos, setPhotos] = useState<any>();

  const navigation = useNavigation<NativeStackNavigationProp<RouteParams>>();
  const currentUserId: string | undefined = firebase.auth().currentUser?.uid;

  const fetchPhotos = () => {
    CameraRoll.getPhotos({
      first: 5,
      assetType: 'Photos',
    })
      .then(response => {
        setPhotos(response.edges);
        console.log(response.edges[0].node.image.uri);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const deletePassword = (item: {id: string | undefined}) => {
    firestore()
      .collection('Users')
      .doc(currentUserId)
      .collection('passwords')
      .doc(item.id)
      .delete()
      .then(() => {
        console.log('User deleted!');
      })
      .catch(err => console.log(err));
  };

  const copyToClip = (item: any) => {
    Clipboard.setString(item.data.password);
    ToastAndroid.show('Password copied to clipboard !', ToastAndroid.SHORT);
  };

  // const reference = storage().ref('imageTest/IMG_20220716_135902.jpg');
  const reference = storage().ref('imageTest/414888b.jpg');
  const uploadFile = () => {
    // const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/IMG_20220716_135902.jpg`;
    const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/Reddit/414888b.jpg`;
    reference
      .putFile(pathToFile)
      .then(answer => console.log(answer, 'yas'))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const subscriber = firestore()
      .collection('Users')
      .doc(currentUserId)
      .collection('passwords')
      .onSnapshot(documentSnapshot => {
        let allPasswords: PasswordArray[] = [];
        documentSnapshot.forEach(el => {
          allPasswords.push({
            data: el.data(),
            id: el.id,
            // path: el._ref._documentPath._parts,
          });
          // console.log(el.data);
        });
        setUserPasswords(allPasswords);
        setIsLoading(false);
      });

    // console.log(utils.FilePath.PICTURES_DIRECTORY);
    // console.log(utils.FilePath.PICTURES_DIRECTORY/Gallery/owner/firestore);

    return () => subscriber();
  }, [currentUserId]);

  const renderPasswords = ({item}: any) => {
    return (
      <View style={styles.flatlist}>
        <View style={styles.items}>
          <View>
            <View style={styles.itemsInfo}>
              <Text style={{fontWeight: 'bold'}}>
                {item.data.name}{' '}
                <Text style={{fontWeight: 'normal'}}>({item.data.type})</Text>
              </Text>
              <Text>Login : {item.data.login}</Text>
              <Text>Password : {item.data.password}</Text>
              {/* <Text>Type : {item.data.type}</Text> */}
              {/* <Text>Path : {item.path}</Text> */}
              <View style={styles.icon}>
                <ModalComponent
                  itemValues={{
                    login: item.data.login,
                    password: item.data.password,
                    name: item.data.name,
                    type: item.data.type,
                    id: item.id,
                    currentUserId: currentUserId,
                  }}
                />
                <Ionicons
                  name="clipboard-outline"
                  size={30}
                  onPress={() => copyToClip(item)}
                />
              </View>
            </View>
          </View>
          <View style={{alignItems: 'center', marginVertical: 10}}>
            <Pressable
              style={styles.delete}
              onPress={() => deletePassword(item)}
              android_ripple={{
                color: 'red',
                borderless: false,
                foreground: false,
              }}
              onLongPress={() => Alert.alert('Are you sure ?')}>
              <Text style={{color: 'white'}}>Delete Password</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {currentUserId && <Header email={firebase.auth().currentUser?.email} />}
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList data={userPasswords} renderItem={renderPasswords} />
      )}
      {/* <Text>yoo</Text> */}
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('CreatePassword', {
              currentUserId: currentUserId,
            })
          }>
          {/* <Text style={{color: 'white', fontSize: 40}}>+</Text> */}
          <Ionicons name="add-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <Image
        style={{
          width: 51,
          height: 51,
          resizeMode: 'contain',
        }}
        source={{
          uri: 'file:///storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/WhatsApp Images/IMG-20220719-WA0001.jpg',
        }}
      />
      <Button title="request permissions" onPress={requestCameraPermission} />
      <Button title="Upload" onPress={uploadFile} />
      <Button title="Fetch Photos" onPress={fetchPhotos} />
    </View>
  );
};

export default UserPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'ivory',
  },
  flatlist: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    // backgroundColor: 'tomato',
    padding: 10,
  },
  items: {
    flex: 1,
    width: '100%',
    height: '0%',
    // margin: 5,
    padding: 10,
    backgroundColor: 'gold',
    borderRadius: 10,
    elevation: 5,
  },
  itemsInfo: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    // width: "50%"
  },
  delete: {
    backgroundColor: 'tomato',
    borderRadius: 5,
    width: '50%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 80,
    width: 80,
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    elevation: 5,
    position: 'absolute',
    bottom: 30,
    right: 30,
    // borderWidth: 1
  },
  icon: {
    position: 'absolute',
    top: '5%',
    right: '2%',
  },
});
