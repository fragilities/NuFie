import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import SelectPicker from 'react-native-form-select-picker';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createActivity, editActivity } from '../store/actions/Activity';
import { useNavigation } from '@react-navigation/native';
import Load from './loading'

function postActivityForm({ route, openAlert, uploadImage, activity, scrollToBottom }) {
    const dispatch = useDispatch()
    const [ tags, setTags ] = useState([]);
    const [ tagText, setTagText] = useState('');
    const [ isPromo, setIsPromo ] = useState('');
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ memberLimit, setMemberLimit ] = useState('');
    const [ date, setDate ] = useState(new Date()); 
    const [ show, setShow ] = useState(false);
    const [ location, setLocation ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ image, setImage ] = useState(uploadImage.uri);
    const [ marginBottomTags, setMarginBottomTags ] = useState(20);
    const [ buttonTitle, setButtonTitle ] = useState('');
    const [ newImage, setNewImage ] = useState(false);
    const [ borderFormColor, setBorderFormColor ] = useState('#C1C1C1');
    const [ warnings, setWarnings ] = useState([]);
    const [ marginBottomButton, setMarginBottomButton ] = useState(0);
    const [ loadingState, setLoadingState ] = useState(true);
    const [ userWarnings, setUserWarnings ] = useState([]);
    const [ isClick, setIsClick ] = useState(false);
    const warningsTemp = [];
    const userWarningTemp = [];
    
    const user = useSelector(state => state.user);
    const navigation = useNavigation();

    const chooseUploadMethod = () => {
        openAlert({showAlert: true})
    }

    useEffect(() => {
        if(route.name === 'EDIT POST') {
            setTags(activity.tags);
            setTitle(activity.title);
            setDescription(activity.description);
            if(activity.isPromo) {
                setIsPromo('YES');
            } else {
                setIsPromo('NO');
            }
            setDate(new Date(activity.due_date));
            if(activity.memberLimit === null) {
                setMemberLimit('0');
            } else {
                setMemberLimit(activity.memberLimit.toString());
            }
            setLocation(activity.location);
            setAddress(activity.address);
            if(!uploadImage.uri) {
                setImage(activity.image);
            } else {
                setNewImage(true);
                setImage(uploadImage.uri)
            }
            setButtonTitle('EDIT');
            setLoadingState(false);
        } else if(route.name === 'ADD POST') {
            setImage(uploadImage.uri);
            setButtonTitle('POST');
        }
    }, [uploadImage.uri]);
    
    const addTags = (action) => {
        if(action.nativeEvent.key === ' ') {
            setTags([...tags, tagText.slice(0, tagText.length-1)]);
            setTagText('');
            setMarginBottomTags(10)
        }
    }

    const deleteTag = (deletedTag) => {
        const newTags = tags.filter(tag => {return tag !== deletedTag})
        setTags(newTags);
        if(tags.length === 1) {
            setMarginBottomTags(20)
        } 
    }

    const setFormDate = (event, selectedDate) => {
        if(event.type === 'dismissed' || event.type === 'set') {
            setShow(false);
        } 
        if(selectedDate) {
            setDate(selectedDate)
        }
    }

    const formValidation = () => {
        if(title.length === 0) {
            warningsTemp.push('Title cannot be empty')
        }
        if(description.length < 50) {
            warningsTemp.push('Description must be at least 50 character');
        }
        if(parseInt(memberLimit) < 2) {
            warningsTemp.push('Member limit must be greater or equal to 2');
        }
        if(date < new Date()) {
            warningsTemp.push(`You can't set the date before`);
        } 
        if(!image) {
            warningsTemp.push(`You have to upload an image`);
        }
        if(tags.length === 0) {
            warningsTemp.push(`Tags cannot be empty`);
        }
        if(location.length === 0) {
            warningsTemp.push(`Location cannot be empty`);
        }
        if(address.length === 0) {
            warningsTemp.push(`Address cannot be empty`);
        }
        if(user.biodata.aboutMe.length === 0) {
            userWarningTemp.push('You have to filled About Me information First');
        }
        if(!user.biodata.phoneNumber) {
            userWarningTemp.push(`You have to filled Phone Number information First`);
        }
        if(user.biodata.gender === 'undefined') {
            userWarningTemp.push(`You have to filled Gender information First`);
        }
        if(warningsTemp.length > 0 || userWarningTemp.length > 0) {
            return false
        } else {
            return true
        }
    }
    
    let uriParts
    let fileType

    if(image) {
        uriParts = image.split('.');
        fileType = uriParts[uriParts.length - 1];
    } 

    const postActivity = () => {
        setIsClick(true);
        if(!formValidation()) {
            setWarnings([...warningsTemp]);
            setUserWarnings([...userWarningTemp]);
            setMarginBottomButton(20);
            scrollToBottom();
            setIsClick(false);
        } else {
            if(route.name === 'ADD POST') {
            let boolPromo;    
            if(isPromo === 'YES') {
                boolPromo = true;
            } else {
                boolPromo = false;
            }
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("image", {
                uri: image,
                name: `photo.${fileType}`,
                type: `image/${fileType}`
            });
            formData.append("tags", JSON.stringify(tags));
            formData.append("memberLimit", memberLimit);
            formData.append("due_date", date.toISOString());
            formData.append("location", location);
            formData.append("address", address);
            formData.append("isPromo", boolPromo);
            
            dispatch(createActivity({
                data: formData, 
                token: user.token,
                user_id: user.login
            }))
                .then(() => {
                    setIsClick(false);
                    navigation.navigate('My Activity')
                })
            } else {
                let boolPromo;    
                if(isPromo === 'YES') {
                    boolPromo = true;
                } else {
                    boolPromo = false;
                }
                const formData = new FormData();
                formData.append("title", title);
                formData.append("description", description);
                if(newImage) {
                    formData.append("image", {
                        uri: image,
                        name: `photo.${fileType}`,
                        type: `image/${fileType}`
                    });
                }
                formData.append("tags", JSON.stringify(tags));
                formData.append("memberLimit", memberLimit);
                formData.append("due_date", date.toISOString());
                formData.append("location", location);
                formData.append("address", address);
                formData.append("isPromo", boolPromo);
                
                dispatch(editActivity({
                    data: formData, 
                    token: user.token, 
                    id: activity._id,
                    user_id: user.login
                }))
                .then(() => {
                    setIsClick(false);
                    navigation.navigate('My Activity')
                })
            }
        }
    }

    if(route.name === 'EDIT POST' && loadingState) {
        return null;
    }

    return (
        <>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Title</Text>
                    <TextInput 
                    style={[styles.textInput, {borderColor: borderFormColor}]}
                    value={title}
                    onChangeText={(value) => setTitle(value)}></TextInput>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput 
                        style={styles.textDescription}
                        multiline={true}
                        textAlignVertical="top"
                        value={description}
                        onChangeText={(value) => setDescription(value)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Upload Image</Text>
                    {
                        !image 
                        ?   <TouchableOpacity onPress={chooseUploadMethod}>
                                <View style={styles.uploadImage}>
                                    <FontAwesome name="camera" size={40} color="#DADADA"/>
                                    <Text style={{marginTop: 10, color: '#5A5A5A'}}>Upload With Camera or File</Text>
                                </View>
                            </TouchableOpacity>
                        :   <TouchableOpacity onPress={chooseUploadMethod}>
                                <Image source={{uri: image}} style={styles.uploadedImage}/>
                            </TouchableOpacity>
                    }
                    
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Do you have Promo?</Text>
                    <SelectPicker
                        onValueChange={(value) => {
                            setIsPromo(value)
                        }}
                        selected={isPromo}
                        style={styles.selector}
                    >
                        <SelectPicker.Item label="YES" value="YES"></SelectPicker.Item>
                        <SelectPicker.Item label="NO" value="NO"></SelectPicker.Item>
                    </SelectPicker>
                </View>
                <View style={{marginBottom: marginBottomTags}}>
                    <Text style={styles.inputLabel}>Interest Category</Text>
                    <TextInput 
                    style={[styles.textInput, {borderColor: borderFormColor}]}
                    onKeyPress={addTags}
                    value={tagText}
                    onChangeText={(value) => setTagText(value)}></TextInput>
                    {
                        tags.length === 0 
                            ?   <View></View>
                            :   <View style={styles.tagsContainer}>
                                {
                                    tags.map((tag, i) => {
                                        return <View key={i} style={styles.tagContainer}>
                                                    <Text style={styles.tagText}>{tag}</Text>
                                                    <TouchableOpacity onPress={() => deleteTag(tag)}>
                                                        <FontAwesome name="times" size={18} color="white" />
                                                    </TouchableOpacity>
                                                </View>
                                    })                                
                                }
                                </View>
                    }
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Due Date</Text>
                    <TouchableWithoutFeedback onPress={() => setShow(true)}>
                        <View style={{
                            marginTop: 6,
                            borderWidth: 1,
                            borderRadius: 9,
                            paddingVertical: 7,
                            paddingHorizontal: 12,
                            height: 37,
                            borderColor: '#C1C1C1'}}>
                                <Text>{date.toDateString()}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    { show && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={date}
                        is24Hour={true}
                        display="default"
                        onChange={setFormDate}
                      />
                    )}
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Location</Text>
                    <TextInput 
                    style={[styles.textInput, {borderColor: borderFormColor}]}
                    value={location}
                    onChangeText={(value) => setLocation(value)}></TextInput>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Address</Text>
                    <TextInput 
                    style={[styles.textInput, {borderColor: borderFormColor}]}
                    value={address}
                    onChangeText={(value) => setAddress(value)}></TextInput>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Member Limit</Text>
                    <TextInput 
                    style={[styles.textInput, {borderColor: borderFormColor}]}
                    value={memberLimit}
                    onChangeText={(value) => setMemberLimit(value)}
                    keyboardType="phone-pad"></TextInput>
                </View>
                <View style={{marginBottom: marginBottomButton}}>
                    {
                        !isClick
                            ?   <TouchableOpacity onPress={postActivity}>
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>{buttonTitle}</Text>
                                    </View>
                                </TouchableOpacity>
                            :   <Load></Load>
                    }
                </View>
                {
                    warnings.length === 0
                        ?   <Text></Text>
                        :   <View style={styles.warningsContainer}>
                            <Text style={{
                                marginBottom: 25, 
                                textAlign: 'center',
                                fontSize: 17,
                                fontWeight: 'bold',
                                color: '#721C1B'
                                }}>Form Validation Error</Text>
                            {
                                warnings.map((warning, i) => {
                                    return <View key={i} style={styles.warningContainer}>
                                        <FontAwesome 
                                        name="arrow-right"
                                        color="#721C1B" 
                                        size={20}/>
                                        <Text style={{
                                            marginLeft: 10, 
                                            color: '#721C1B',
                                            fontWeight: 'bold'
                                            }}>{warning}</Text>
                                    </View>
                                })
                            }
                    </View>
                }
                <View style={{marginTop: 20}}>
                    {
                        userWarnings.length === 0
                            ?   <Text></Text>
                            :   <View style={styles.warningsContainer}>
                                <Text
                                style={{
                                    marginBottom: 25, 
                                    textAlign: 'center',
                                    fontSize: 17,
                                    fontWeight: 'bold',
                                    color: '#721C1B'
                                    }}>User Validation Error</Text>
                                    {
                                        userWarnings.map((warning, i) => {
                                            return <View key={i} style={styles.warningContainer}>
                                                <FontAwesome 
                                                name="arrow-right"
                                                color="#721C1B" 
                                                size={20}/>
                                                <Text style={{
                                                    marginLeft: 10, 
                                                    color: '#721C1B',
                                                    fontWeight: 'bold'
                                                    }}>{warning}</Text>
                                            </View>
                                        })
                                    }
                                </View>    
                        }
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        padding: 20
    },
    inputContainer: {
        marginBottom: 20
    },
    inputLabel: {
        fontSize: 17
    },
    textInput: {
        marginTop: 6,
        borderWidth: 1,
        borderRadius: 9,
        paddingVertical: 3,
        paddingHorizontal: 12,
    },
    textDescription: {
        marginTop: 6,
        borderWidth: 1,
        borderRadius: 9,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderColor: '#C1C1C1',
        height: 100
    },
    uploadImage: {
        height: 240,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 9,
        marginTop: 6,
        backgroundColor: '#5555',
        borderColor: '#C1C1C1',
    },
    uploadedImage: {
        width: '100%', 
        height: 240, 
        borderRadius: 9,
        marginTop: 6,
    },
    selector: {
        marginTop: 6,
        borderWidth: 1,
        borderRadius: 9,
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderColor: '#C1C1C1',
        height: 36
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
        paddingLeft: 3
    },
    tagContainer: {
        backgroundColor: 'black',
        flexDirection: 'row',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 7,
        marginRight: 10,
        marginBottom: 10
    },
    tagText: {
        color: 'white',
        marginRight: 10
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#03A9F4',
        paddingVertical: 10,
        borderRadius: 9,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    warningsContainer: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        borderWidth: 2,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    warningContainer: {
        flexDirection: 'row',
        marginBottom: 15
    }
})

export default postActivityForm;