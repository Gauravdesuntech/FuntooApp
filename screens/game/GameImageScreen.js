import React from "react";
import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    Modal,
    Dimensions,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
    RefreshControl,
    SafeAreaView,
    ActivityIndicator
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "../../config/colors";
import { Header, Dropdown } from "../../components";
import Configs, { ToFormData } from "../../config/Configs";
import { getFileData } from "../../utils/Util";
import Loader from "../../components/Loader";
import ProgressiveImage from "../../components/ProgressiveImage";
import AwesomeAlert from 'react-native-awesome-alerts';
import { GetGameImageByGameId, AddGameImage, DeleteGameImage } from "../../services/GameApiService";
import { Video, AVPlaybackStatus } from 'expo-av';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import AppContext from "../../context/AppContext";
import * as VideoThumbnails from 'expo-video-thumbnails';

export default class GameImageScreen extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            galleryImages: [],
            galleryImageData: [],
            galleryVideo: [],
            galleryVideoData: [],
            galleryVideothumbnail: [],
            id: "",
            game_id: this.props.route.params.game_id,

            isModalOpen: false,
            refreshing: false,

            showAlertModal: false,
            alertMessage: "",
            alertType: '',
            isPlaybackModalOpen: false,
            playbackURI: undefined,
            videoLoading: false,
        };
    }

    componentDidMount = () => {
        this.GetGameImageByGameId();
    }
    loadVideo = () => {
        // console.log("**********Started***********")
        this.setState({ videoLoading: true })
    }

    getFileSize = async (fileUri) => {
        let fileInfo = await FileSystem.getInfoAsync(fileUri);
        let new_fileSize = Math.trunc((fileInfo.size / 1024) / 1024);
        // Alert.alert(`Selected video size is ${new_fileSize} mb`)
        return new_fileSize;
    };


    addGalleryVideo = () => {
        let { galleryVideo, galleryVideoData, galleryVideothumbnail } = this.state;
        ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
            if (status.granted) {
                let optins = {
                    mediaTypes: 'Videos',
                };

                ImagePicker.launchImageLibraryAsync(optins).then(async (result) => {

                    const video_file_size = await this.getFileSize(result.uri)


                    if (!result.cancelled) {
                        if (video_file_size < 15) {
                            // let abc = getFileData(result)
                            try {
                                const { uri } = await VideoThumbnails.getThumbnailAsync(
                                    result.uri,
                                    {
                                        time: 5000,
                                    }
                                );
                                console.log('....Video_url.......', getFileData({ uri }));
                                // abc.thumbnail=uri;
                                galleryVideothumbnail.push(getFileData({ uri }));
                                this.setState({ galleryVideothumbnail: galleryVideothumbnail })
                            } catch (e) {
                                console.warn(e);
                            }

                            //   console.log('.....getFileData(result).......',abc);

                            galleryVideo.push({ uri: result.uri });
                            galleryVideoData.push(getFileData(result));
                            // galleryVideoData.push(abc);

                            this.setState({
                                galleryVideo: galleryVideo,
                                galleryVideoData: galleryVideoData,
                            });
                        } else {
                            Alert.alert("Error", `File size is more than ${this.context.fileSetting.video_size}mb`);
                        }

                    }
                });
            } else {
                Alert.alert("Warning", "Please allow permission to choose an Video");
            }
        });
    };
    addGalleryImage = () => {
        let { galleryImages, galleryImageData } = this.state;
        ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
            if (status.granted) {
                let optins = {
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                };

                ImagePicker.launchImageLibraryAsync(optins).then((result) => {
                    if (!result.cancelled) {
                        galleryImages.push({ uri: result.uri });
                        galleryImageData.push(getFileData(result));

                        this.setState({
                            galleryImages: galleryImages,
                            galleryImageData: galleryImageData,
                        });
                    }
                });
            } else {
                Alert.alert("Warning", "Please allow permission to choose an icon");
            }
        });
    };


    GetGameImageByGameId() {
        this.setState({
            isLoading: true
        });

        GetGameImageByGameId(this.state.game_id).then(res => {
            this.setState({
                isLoading: false,
                list: res.data,
                refreshing: false,
            });

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
        })
    }


    AddGameImage = () => {
        let model = {
            game_id: this.state.game_id,
        }
        this.setState({
            isLoading: true
        });


        let forData = ToFormData(model);
        forData = this.AppendImage(forData);
        forData = this.AppendVideo(forData);
        forData = this.AppendVideothumbnail(forData);
        console.log('..........forData.............', forData)

        AddGameImage(forData).then(res => {
            // console.log('........AddGameImage..res.............', res)
            this.setState({
                isLoading: false,
            });
            // return
            if (res.is_success) {
                this.GetGameImageByGameId();
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Success",
                    alertMessage: res.message,
                    galleryImages: [],
                    galleryVideo: [],
                    galleryImageData: [],
                    galleryVideoData: [],
                    galleryVideothumbnail: []
                })
            } else {
                this.GetGameImageByGameId();
                this.setState({
                    isModalOpen: false,
                    showAlertModal: true,
                    alertType: "Error",
                    alertMessage: res.message,
                    galleryImages: [],
                    galleryVideo: [],
                    galleryImageData: [],
                    galleryVideoData: [],
                    galleryVideothumbnail: []
                })
            }

        }).catch((error) => {
            Alert.alert("Server Error", error.message);
            this.setState({
                isLoading: false,
            });
        })
    }


    DeleteGameImage = (id) => {

        Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this image?",
            [
                {
                    text: "Yes",
                    onPress: () => {
                        let model = {
                            id: id,
                        }
                        this.setState({
                            isLoading: true
                        });

                        DeleteGameImage(model).then(res => {
                            this.setState({
                                isLoading: false,
                            });
                            this.setState({
                                isLoading: false
                            });
                            if (res.is_success) {
                                this.GetGameImageByGameId();
                                this.setState({
                                    isModalOpen: false,
                                    showAlertModal: true,
                                    alertType: "Success",
                                    alertMessage: res.message
                                })
                            } else {
                                this.setState({
                                    showAlertModal: true,
                                    alertType: "Error",
                                    alertMessage: res.message
                                })
                            }

                        }).catch((error) => {
                            Alert.alert("Server Error", error.message);
                        })
                    },
                },
                {
                    text: "No",
                },
            ]
        );
    }

    AppendVideo(fd) {
        let files = this.state.galleryVideoData;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            fd.append('videos[]', file);
        }
        return fd;
    }
    AppendVideothumbnail(fd) {
        let files = this.state.galleryVideothumbnail;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            fd.append('thumbnails[]', file);
        }
        return fd;
    }
    AppendImage(fd) {
        let files = this.state.galleryImageData;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            fd.append('images[]', file);
        }
        return fd;
    }

    hideAlert = () => {
        this.setState({
            showAlertModal: false
        });
    };

    openPlaybackModal = (uri) => {
        // console.log("URl>>>>",uri)
        this.setState({
            isPlaybackModalOpen: true,
            playbackURI: uri,
        });
    };

    closePlaybackModal = () =>
        this.setState({
            isPlaybackModalOpen: false,
            playbackURI: undefined,
        });



    lsitItem = ({ item }) => (
        <TouchableOpacity
            key={item.id.toString()}
            style={styles.galleryGrid}
        >
            <ProgressiveImage
                source={{ uri: Configs.GAME_GALLERY_IMAGE_URL + item.image }}
                style={styles.galleryImg}
                resizeMode="contain"
            />
        </TouchableOpacity>

    );


    toggleModal = () =>
        this.setState({
            id: null,
            imageURI: null,
            isModalOpen: !this.state.isModalOpen,
        });

    onRefresh = () => {
        this.setState({ refreshing: true }, () => { this.GetGameImageByGameId() })
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="Gallery" addAction={this.toggleModal} />
                {this.state.isLoading ? (
                    <Loader />
                ) : (

                    <View style={styles.galleryContainer}>
                        {this.state.list?.map(item => {
                            // console.log('............svsdv....',item);
                            let url = Configs.GAME_GALLERY_IMAGE_URL + item.image;
                            let thumb_url = Configs.GAME_GALLERY_IMAGE_URL + item.thumbnail;
                            let Video_url = Configs.GAME_GALLERY_IMAGE_URL + item.video;
                            return (
                                <>
                                    {item.image == null ? null :
                                        <TouchableOpacity
                                            key={item.id.toString()}
                                            style={styles.galleryGrid}
                                        // onLongPress={() => this.DeleteGameImage(item.id)}
                                        >
                                            <ProgressiveImage
                                                source={{ uri: url }}
                                                style={styles.galleryImg}
                                                resizeMode="contain"

                                            />
                                            <TouchableOpacity
                                                style={styles.img_delete}
                                                onPress={() => this.DeleteGameImage(item.id)}
                                            >
                                                <MaterialIcons name="delete" size={16} color="black" />

                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    }
                                    {item.video == null ? null :
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[
                                                styles.galleryGrid,
                                                { backgroundColor: "white" },
                                            ]}
                                            onPress={this.openPlaybackModal.bind(
                                                this,
                                                Video_url
                                            )}
                                        // onLongPress={() => this.DeleteGameImage(item.id)}
                                        >
                                            {item.thumbnail == null ?
                                                <Ionicons
                                                    name="play-circle-outline"
                                                    size={60}
                                                    color={Colors.primary}
                                                />
                                                :
                                                <>
                                                    <ProgressiveImage
                                                        source={{ uri: thumb_url }}
                                                        style={styles.galleryImg}
                                                        resizeMode="contain"

                                                    />
                                                    <View style={{ position: 'absolute', top: '35%', }}>
                                                        <Ionicons name="play-circle-outline" size={24} color={Colors.white} />
                                                    </View>
                                                </>
                                            }
                                            <TouchableOpacity
                                                style={styles.img_delete}
                                                onPress={() => this.DeleteGameImage(item.id)}
                                            >
                                                <MaterialIcons name="delete" size={16} color="black" />

                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    }
                                </>
                            )
                        })}

                    </View>
                )}

                <Modal
                    animationType="fade"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={this.state.isPlaybackModalOpen}
                >
                    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
                        <View style={[styles.modalContainer, { backgroundColor: "#000" }]}>
                            <View style={styles.playbackModalBody}>
                                {/* {this.state.videoLoading ?
                        <ActivityIndicator
                          color={Colors.primary}
                          size="small"
                          style={styles.video}
                        /> : null} */}
                                <Video
                                    useNativeControls={true}
                                    resizeMode="contain"
                                    isLooping={false}
                                    source={{
                                        // uri: `http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4`,
                                        uri: `${this.state.playbackURI}`,
                                    }}
                                    style={styles.video}
                                    shouldPlay={true}
                                    onLoadStart={() => this.loadVideo()}
                                    onLoad={() => this.setState({ videoLoading: false })}
                                    progressUpdateIntervalMillis={50}
                                />

                                {/* youtube video play */}
                                {/* <View>
                  <YoutubePlayer
                    height={300}
                    width={windowWidth}
                    play={true}
                    videoId={this.state.videoid}
                  />
                </View> */}
                                <TouchableOpacity
                                    style={[styles.closeButton, { top: 50, right: 20 }]}
                                    onPress={this.closePlaybackModal}
                                >
                                    <Ionicons
                                        name="close-outline"
                                        style={styles.closeButtonText}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.isModalOpen}
                    onRequestClose={this.toggleModal}
                >
                    <SafeAreaView style={styles.modalOverlay}>
                        {this.state.isLoading ? (
                            <Loader />
                        ) : (
                            <View style={styles.itemModalContainer}>
                                <View style={styles.itemModalHeader}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.headerBackBtnContainer}
                                        onPress={this.toggleModal}
                                    >
                                        <Ionicons name="arrow-back" size={26} color={Colors.white} />
                                    </TouchableOpacity>
                                    <View style={styles.headerTitleContainer}>
                                        <Text style={{ fontSize: 20, color: Colors.white }}>
                                            Add Gallery Media
                                        </Text>
                                    </View>
                                </View>



                                <View style={styles.itemModalBody}>
                                    <View style={styles.form}>
                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            <View>
                                                <Text style={[styles.inputLable, { marginTop: 20 }]}>
                                                    Add Photos:
                                                </Text>
                                                <View style={styles.galleryContainer}>
                                                    {this.state.galleryImages.map((value, index) => (
                                                        <TouchableOpacity
                                                            key={index.toString()}
                                                            activeOpacity={1}
                                                            style={styles.galleryGrid}
                                                        >
                                                            <Image
                                                                source={{ uri: value.uri }}
                                                                resizeMode="contain"
                                                                style={styles.galleryImg}
                                                            />
                                                        </TouchableOpacity>
                                                    ))}
                                                    <TouchableOpacity
                                                        activeOpacity={1}
                                                        style={styles.galleryAddBtn}
                                                        onPress={this.addGalleryImage}
                                                    >
                                                        <Ionicons name="add" size={40} color={Colors.primary} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <View>
                                                <Text style={[styles.inputLable, { marginTop: 20 }]}>
                                                    Add Video:
                                                </Text>
                                                <View style={styles.galleryContainer}>
                                                    {this.state.galleryVideo.map((value, index) => (
                                                        <TouchableOpacity
                                                            key={index.toString()}
                                                            activeOpacity={1}
                                                            style={styles.galleryGrid}
                                                        >
                                                            <Image
                                                                source={{ uri: value.uri }}
                                                                resizeMode="contain"
                                                                style={styles.galleryImg}
                                                            />
                                                        </TouchableOpacity>
                                                    ))}
                                                    <TouchableOpacity
                                                        activeOpacity={1}
                                                        style={styles.galleryAddBtn}
                                                        onPress={this.addGalleryVideo}
                                                    >
                                                        <Ionicons name="add" size={40} color={Colors.primary} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <TouchableOpacity
                                                style={styles.submitBtn}
                                                onPress={this.AddGameImage}
                                            >
                                                <Text style={{ fontSize: 18, color: Colors.white }}>
                                                    Upload
                                                </Text>
                                            </TouchableOpacity>
                                        </ScrollView>
                                    </View>
                                </View>
                            </View>
                        )
                        }

                    </SafeAreaView>
                </Modal>


                <AwesomeAlert
                    show={this.state.showAlertModal}
                    showProgress={false}
                    title={this.state.alertType}
                    message={this.state.alertMessage}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={false}
                    showConfirmButton={true}
                    cancelText="cancel"
                    confirmText="Ok"
                    confirmButtonColor="#DD6B55"
                    onCancelPressed={() => {
                        this.hideAlert();
                    }}
                    onConfirmPressed={() => {
                        this.hideAlert();
                    }}
                />
            </SafeAreaView>
        )
    }

}



const windowWidth = Dimensions.get("screen").width;
const windowHeight = Dimensions.get("screen").height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    lsitContainer: {
        flex: 1,
    },
    card: {
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderColor: Colors.textInputBorder,
    },
    qtyContainer: {
        width: "10%",
        alignItems: "center",
        justifyContent: "center",
    },
    titleText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.textColor,
        marginBottom: 2,
    },
    subText: {
        fontSize: 13,
        color: Colors.textColor,
        marginBottom: 2,
    },
    modalOverlay: {
        justifyContent: "center",
        alignItems: "center",
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.white,
    },
    itemModalContainer: {
        flex: 1,
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.white,
    },
    itemModalHeader: {
        height: 55,
        flexDirection: "row",
        width: "100%",
        backgroundColor: Colors.primary,
        elevation: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    headerBackBtnContainer: {
        width: "15%",
        height: 55,
        paddingLeft: 5,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    headerTitleContainer: {
        width: "70%",
        paddingLeft: 20,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
    },
    itemModalBody: {
        flex: 1,
        height: windowHeight - 55,
    },
    form: {
        flex: 1,
        padding: 8,
    },
    iconPickerContainer: {
        flexDirection: "row",
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "space-between",
    },
    imageContainer: {
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 3,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    image: {
        height: 50,
        width: 50,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
    },
    inputLable: {
        fontSize: 16,
        color: Colors.textColor,
        marginBottom: 10,
        // opacity: 0.8,
    },
    textInput: {
        borderWidth: 1,
        padding: 9,
        fontSize: 14,
        width: "100%",
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Colors.textInputBorder,
        backgroundColor: Colors.textInputBg,
    },
    submitBtn: {
        marginTop: 15,
        height: 45,
        width: "100%",
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
    },


    galleryGrid: {
        width: Math.floor((windowWidth - 16) / 4),
        height: Math.floor((windowWidth - 16) / 4),
        alignItems: "center",
        justifyContent: "center",
        margin: 2
    },

    galleryImg: {
        width: Math.floor((windowWidth - 16) / 4),
        height: Math.floor((windowWidth - 16) / 4),
        borderWidth: 2,
        borderColor: Colors.white,
    },
    img_delete: {
        position: 'absolute',
        zIndex: 2,
        bottom: 2,
        right: 5,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 4,
    },
    galleryContainer: {
        marginTop: 5,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
    },

    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    closeButton: {
        position: "absolute",
        zIndex: 11,
        top: 5,
        right: 5,
        backgroundColor: "#ddd",
        width: 25,
        height: 25,
        borderRadius: 40 / 2,
        alignItems: "center",
        justifyContent: "center",
        elevation: 0,
    },
    closeButtonText: {
        color: Colors.textColor,
        fontSize: 22,
    },
    playbackModalBody: {
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "#000",
        width: windowWidth,
        height: windowHeight,
        padding: 15,
        borderRadius: 5,
        elevation: 5,
    },
    video: {
        alignSelf: "center",
        width: "100%",
        height: 310,
        // height: Math.floor(windowHeight / 4),
    },


});

