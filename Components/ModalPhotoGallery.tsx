import {
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import CameraRoll from '@react-native-community/cameraroll';
import storage from '@react-native-firebase/storage';
import auth, {firebase} from '@react-native-firebase/auth';

const currentUserId: string | undefined = firebase.auth().currentUser?.uid;

const ModalPhotoGallery = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [phonePhotos, setPhonePhotos] = useState<object[]>();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const getUserPhotos = () => {
    CameraRoll.getPhotos({
      first: 15,
      assetType: 'Photos',
      groupName: 'Camera',
      include: ['filename'],
    })
      .then(response => {
        setPhonePhotos(response.edges);
        // console.log(response.edges[0].node.image.uri);
      })
      .catch(err => {
        console.log(err);
      });
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
                selectedItems.includes(item.node.image) &&
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

  const handleSelect = (item: any) => {
    let ids: object[] = [...selectedItems];

    if (ids.includes(item.node.image)) {
      ids = ids.filter(id => id !== item.node.image);
    } else ids.push(item.node.image);
    setSelectedItems(ids);
    // console.log(selectedItems)
  };

  const uploadFile = () => {
    selectedItems.forEach(item => {
      const reference = storage().ref(`${currentUserId}/${item.filename}`);
      reference
        .putFile(item.uri.split('file://')[1])
        .then(answer => console.log(answer, 'yas'))
        .catch(err => console.log(err));
    });
    setModalVisible(false)
  };

  const goModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      getUserPhotos();
    }, 50);
  };
  return (
    <View style={[styles.container]}>
      <Modal
        animationType="fade"
        // transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <FlatList
          data={phonePhotos}
          renderItem={renderUserPhotos}
          numColumns={3}
          extraData={selectedItems}
          // keyExtractor={item => item.node.image.filename}
        />
        <Button title="Upload selection" onPress={uploadFile} disabled={selectedItems.length===0} />
        <Button title="Close Modal" onPress={() => setModalVisible(false)} />
      </Modal>

      <Button title="Modal" onPress={goModal} />
    </View>
  );
};

export default ModalPhotoGallery;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "tomato",
  },
  selectedStyle: {
    borderWidth: 4,
    borderColor: 'dodgerblue',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // backgroundColor: "tomato",
  },
});
