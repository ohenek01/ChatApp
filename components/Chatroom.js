import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Button, View, Platform, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'
import {useNavigation} from "@react-navigation/native";
import {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import {db} from '../firebaseConfig';
import {collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, doc, setDoc} from "firebase/firestore";
import {FlatList} from "react-native";

export default function Chatroom({route}) {
    const {user} = route.params;
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const chatId = getChatId(user.id);
        const typingRef = doc(db, 'typingStatus', chatId);

        const q = query(
            collection(db, 'chats'),
            where('chatId', '==', getChatId(user.id)),
            orderBy('createdAt')
        );

        const unsubscribe = onSnapshot(q, async(querySnapshot) => {
            const messagesData = [];
            for(const docSnap of querySnapshot.docs){
                const data = docSnap.data();
                messagesData.push({
                    id: docSnap.id,
                    ...data,
                });

                if(
                    data.receiverId === auth.currentUser.uid &&
                    data.isRead === false
                ){
                await updateDoc(doc(db, 'chats', docSnap.id), {
                    isRead: true,
                });
            }}
            setMessages(messagesData);
        });
        const unsubscribeTyping = onSnapshot(typingRef, (docSnap) => {
            const data = docSnap.data();
            const isTyping = data?.[user.id] || false;
            setIsOtherUserTyping(isTyping);
        })
        return () => {
            updateTypingStatus(false);
            unsubscribe();
            unsubscribeTyping();
        };
    }, []);

    const sendMessage = async() => {
        if (text.trim() === '') return;

        await addDoc(collection(db, 'chats'),{
            chatId: getChatId(user.id),
            senderId: auth.currentUser.uid,
            receiverId: user.id,
            text: text,
            createdAt: new Date(),
            isRead: false,
        });
        setText('');
    };

    const getChatId = (otherUserId) => {
        const currentUser = auth.currentUser.uid;
        if(!currentUser){
            console.error('No authenticated user');
            return;
        }
        return[currentUser, otherUserId].sort().join('_');
    }

    const updateTypingStatus = async(isTyping) => {
        const chatId = getChatId(user.id);
        await setDoc(doc(db, 'typingStatus', chatId), {
            [auth.currentUser.uid]: isTyping,
        }, { merge: true });
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={90}
        >
            <View style={styles.nameBar}>
                <Ionicons onPress={() => navigation.goBack()} name="chevron-back" size={40} color="black" style={styles.icon}/>
                <Text style={styles.nameText}>{user.name}</Text>
                {isOtherUserTyping && (
                    <Text style={styles.typing}>{user.name} is typing</Text>
                )}
            </View>
            {messages.length === 0 ? (
                <Text>No messages yet. Say hi!</Text>
            ) : (
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <View style={[
                            styles.messageBox,
                            item.senderId === auth.currentUser.uid ? styles.sent : styles.received
                        ]}>
                            <Text>{item.text}</Text>
                        </View>
                    )}

                    contentContainerStyle={{ padding: 10 }}
                />
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    value={text}
                    onChangeText={(t) => {
                        setText(t);
                        updateTypingStatus(t.length > 0);
                    }}
                    placeholder="Type a message"
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={() => sendMessage()}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>

            <StatusBar style="auto" />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    nameBar:{
        width: 450,
        height: Platform.OS === 'android' ? 100 : 126,
        backgroundColor: '#38a1d3',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameText:{
        color: '#000',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 150,
        marginTop: 20,
    },
    icon:{
        marginTop: 20,
        marginLeft: 10,
    },
    typing: {
        marginTop: 60,
        marginLeft: -90,
        fontStyle: 'italic',
        color: '#7e7b7b'
    },
    sent:{
        backgroundColor: '#38a1d3',
        alignSelf: 'flex-end',
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
        marginBottom: 10,
        marginTop: 10,
    },
    received:{
        backgroundColor: '#3c5687',
        alignSelf: 'flex-start',
        padding: 10,
        borderRadius: 10,
        marginLeft: 10,
    },
    messageBox:{
        maxWidth: '100%',
        maxHeight: '100%',
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 10,
    },
    inputContainer:{
        width: 0,
        height: 50,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 40,
        position: 'absolute',
        bottom: 20,
    },
    input:{
        height: 50,
        width: 280,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        fontSize: 16,
        marginTop: 35,
        marginLeft: 10,
    },
    button:{
        borderRadius: 10,
        backgroundColor: '#38a1d3',
        width: 100,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        marginLeft: 20,
    },
    buttonText:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },

});
