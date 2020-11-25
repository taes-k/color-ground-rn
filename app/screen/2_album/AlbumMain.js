// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, SafeAreaView, View, FlatList, ScrollView, Button, Image, TouchableOpacity } from 'react-native';
// import CameraRoll from '@react-native-community/cameraroll';

// import FlexStyles from '../../style/FlexStyleSheet';
// import ImagePreprocessor from '../3_edit/function/ImagePreprocessor'

// const AlbumMain = ({ navigation, route }) => 
// {
//     const albumFetchSize = 30;

//     const [photos, setPhotos] = useState([]);
//     const [photoEndCursor, setPhotoEndCursor] = useState(null);
//     const [photoHasNext, setPhotoHasNext] = useState(true);
//     const [isScrollBottom, setScrollIsBottom] = useState(true);
//     const [isPhotoLoading, setPhotoLoading] = useState(false);

//     useEffect(() =>
//     {
//         if (isScrollBottom && !isPhotoLoading)
//         {
//             getPhtosFromAlbum();
//         }
//     }, [isScrollBottom, isPhotoLoading]);


//     // ---------------------------------------------------------------------------------------------
//     // get photos from album
//     // ---------------------------------------------------------------------------------------------
//     getPhtosFromAlbum = async () =>
//     {
//         if (!isPhotoLoading && photoHasNext)
//         {
//             setPhotoLoading(true);
//             try
//             {
//                 var result = null;

//                 if (photoEndCursor == null)
//                 {
//                     result = await CameraRoll.getPhotos({
//                         first: albumFetchSize,
//                         assetType: 'Photos'
//                     });
//                 }
//                 else
//                 {
//                     result = await CameraRoll.getPhotos({
//                         first: albumFetchSize,
//                         after: photoEndCursor,
//                         assetType: 'Photos'
//                     });
//                 }

//                 setPhotoEndCursor(result.page_info.end_cursor);
//                 setPhotoHasNext(result.page_info.has_next_page);

//                 setPhotos(photos.concat(result.edges));
//                 setPhotoInit(true);
//                 setPhotoLoading(false);
//             }
//             catch (error)
//             {
//                 setPhotoLoading(false);
//             }
//         }
//     }


//     const isBottom = () =>
//     {
//         setScrollIsBottom(true);
//     };

//     // ---------------------------------------------------------------------------------------------
//     // select photo to edit
//     // ---------------------------------------------------------------------------------------------
//     const getPhotoToEdit = async (imagePath) =>
//     {
//         console.log("origin Path :", imagePath);
//         var resizeImageurl = await ImagePreprocessor.getResizeImage(imagePath);
//         console.log('resizeImageurl ', resizeImageurl);
//         navigation.navigate('Edit', { imagePath: resizeImageurl });
//     }

//     return (
//         <SafeAreaView style={[FlexStyles.flex_1]} >
//             <View style={[styles.album_headere]}>
//                 <Button title="Go back" onPress={() => navigation.goBack()} />
//             </View>
//             <FlatList
//                 columnWrapperStyle={styles.photo_card_row}
//                 onEndReached={isBottom}
//                 onEndReachedThreshold={0.8}
//                 numColumns={3}
//                 keyExtractor={(item) => String(item.node.image.uri)}
//                 data={photos}

//                 renderItem={(data) => 
//                 {
//                     return <TouchableOpacity
//                         style={[styles.photo_card_wrapper]}
//                         onPress={() => { getPhotoToEdit(data.item.node.image.uri) }}
//                     >
//                         <Image
//                             key={data.index}
//                             style={[styles.photo_card]}
//                             source={{ uri: data.item.node.image.uri }}
//                         />
//                     </TouchableOpacity>
//                 }
//                 }
//             />
//         </SafeAreaView>
//     );

// }



// const styles = StyleSheet.create({
//     album_headere: {
//         width: '100%',
//         height: 50,
//         backgroundColor: 'yellow',
//     },
//     album_scroller: {
//         // flexDirection: 'row',
//         flex: 1,
//     },
//     album_container: {
//         flex: 1,
//         flexDirection: 'row',
//         backgroundColor: 'white',
//     },
//     photo_card_row: {
//         flexDirection: 'row',
//     },
//     photo_card_wrapper: {
//         width: '32%',
//         aspectRatio: 1,
//         marginTop: '1%',
//         marginLeft: '1%',

//     },
//     photo_card: {
//         width: '100%',
//         height: '100%',
//     }
// });

// export default AlbumMain;