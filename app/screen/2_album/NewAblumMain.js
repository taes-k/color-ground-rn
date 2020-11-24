import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, SafeAreaView, View, FlatList, ScrollView, Button, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';

import FlexStyles from '../../style/FlexStyleSheet';
import ImagePreprocessor from '../3_edit/function/ImagePreprocessor'
import FastImage from 'react-native-fast-image';
import RNThumbnail from 'react-native-thumbnail';

const NewAlbumMain = ({ navigation, route }) => 
{
    const albumFetchSize = 30;

    const [photos, setPhotos] = useState([]);
    const [photoEndCursor, setPhotoEndCursor] = useState(null);
    const [photoHasNext, setPhotoHasNext] = useState(true);
    const [isScrollBottom, setScrollIsBottom] = useState(true);
    const [isPhotoLoading, setPhotoLoading] = useState(false);

    useEffect(() =>
    {
        if (isScrollBottom && !isPhotoLoading)
        {
            getPhtosFromAlbum();
        }
    }, [isScrollBottom, isPhotoLoading]);


    // ---------------------------------------------------------------------------------------------
    // get photos from album
    // ---------------------------------------------------------------------------------------------
    getPhtosFromAlbum = async () =>
    {
        if (!isPhotoLoading && photoHasNext)
        {
            setPhotoLoading(true);
            try
            {
                var result = null;

                if (photoEndCursor == null)
                {
                    result = await CameraRoll.getPhotos({
                        first: albumFetchSize,
                        assetType: 'Photos'
                    });
                }
                else
                {
                    result = await CameraRoll.getPhotos({
                        first: albumFetchSize,
                        after: photoEndCursor,
                        assetType: 'Photos'
                    });
                }

                setPhotoEndCursor(result.page_info.end_cursor);
                setPhotoHasNext(result.page_info.has_next_page);

                console.log("result.edges", result.edges);

                var images = await Promise.all(
                    result.edges.map((data) =>
                    {
                        var imageUri = data.node.image.uri;
                        return { imageUri: imageUri, thumbnailUri: imageUri }
                    })
                )
                setPhotos(photos.concat(images));

                setPhotoInit(true);
                setPhotoLoading(false);
            }
            catch (error)
            {
                setPhotoLoading(false);
            }
        }
    }


    const isBottom = () =>
    {
        setScrollIsBottom(true);
    };

    // ---------------------------------------------------------------------------------------------
    // select photo to edit
    // ---------------------------------------------------------------------------------------------
    const getPhotoToEdit = async (imagePath) =>
    {
        var resizeImageurl = await ImagePreprocessor.getResizeImage(imagePath);
        navigation.navigate('Edit', { imagePath: resizeImageurl });
    }

    const photoKeyExtractor = (item) => String(item.imageUri);

    const renderPhotoList = (data) =>
    {
        var imageUri = data.item.imageUri;
        var thumbnailUri = data.item.thumbnailUri;

        return (
            <TouchableOpacity style={[styles.photo_card_wrapper]} onPress={() => { getPhotoToEdit(imageUri) }}>
                <Image
                    key={data.index}
                    style={[styles.photo_card]}
                    source={{ uri: thumbnailUri }}
                />
            </TouchableOpacity>
        )
    }


    const LoadingFooter = ({ photoHasNext }) => (
        <View style={styles.footer_container}>
            {photoHasNext && <ActivityIndicator />}
            <Text style={styles.footer_text}>
                {photoHasNext ? 'Loading more photos...' : ""}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={[FlexStyles.flex_1]} >
            <View style={[styles.album_headere]}>
                <Button title="Go back" onPress={() => navigation.goBack()} />
            </View>
            <FlatList
                columnWrapperStyle={styles.photo_card_row}
                onEndReached={isBottom}
                onEndReachedThreshold={0.8}
                numColumns={3}
                keyExtractor={photoKeyExtractor}
                data={photos}
                renderItem={renderPhotoList}
                ListFooterComponent={<LoadingFooter hasMore={photoHasNext} animating={false} />}
            />
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    album_headere: {
        width: '100%',
        height: 50,
        backgroundColor: 'yellow',
    },
    album_scroller: {
        // flexDirection: 'row',
        flex: 1,
    },
    album_container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    photo_card_row: {
        flexDirection: 'row',
    },
    photo_card_wrapper: {
        width: '32%',
        aspectRatio: 1,
        marginTop: '1%',
        marginLeft: '1%',

    },
    photo_card: {
        width: '100%',
        height: '100%',
    },
    footer_container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        flexDirection: 'row',
    },
    footer_text: {
        opacity: 0.7,
        marginLeft: 8,
    },
});

export default NewAlbumMain;