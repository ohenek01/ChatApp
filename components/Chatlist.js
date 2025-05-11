import {useState, useEffect} from 'react';
import {StatusBar} from "expo-status-bar";
import {FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Platform} from 'react-native';
import {db} from '../firebaseConfig';
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {collection, getDocs, query, where, orderBy, limit, getDoc, doc, onSnapshot} from 'firebase/firestore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useNavigation} from "@react-navigation/native";

export default function Chatlist() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const auth = getAuth();

        const fetchUsers = async (currentUserId) => {
            try{
                const auth = getAuth();
                const currentUserId = auth.currentUser?.uid;

                if(!currentUserId){
                    console.error('No current user.');
                    return;
                }

                const usersCollection = await getDocs(collection(db, 'users'));
                const userList = usersCollection.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: data.userId ?? data.uid ?? doc.id,
                        ...data
                    };
                }).filter(user => user.id !== undefined && user.id !== currentUserId);

                const usersLastMessage = await Promise.all(
                    userList.map(async (user) => {
                        const chatId = [currentUserId, user.id].sort().join('_');
                        const messagesQuery = query(
                            collection(db, 'chats'),
                            where('chatId', '==', chatId),
                            orderBy('createdAt', 'desc'),
                            limit(1)
                        );
                        const messageSnapshot = await getDocs(messagesQuery);
                        const lastMessageDoc = messageSnapshot.docs[0]
                        const lastMessage = lastMessageDoc?.data()?.text || '';
                        const isUnread = lastMessageDoc?.data()?.receiverId === currentUserId &&
                                                  lastMessageDoc?.data()?.isRead === false;
                        return {
                            ...user,
                            lastMessage,
                            isUnread,
                        };
                    }))
                setUsers(usersLastMessage);
            }catch(error){
                console.error("Error fetching users", error);
            }finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            const auth = getAuth();
            const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
                if (user) {
                    const currentUserId = user.uid;

                    const unsubscribeChats = onSnapshot(collection(db, 'chats'), async() => {
                        await fetchUsers(currentUserId);
                    });
                    return unsubscribeChats;
                }else{
                    console.error('No user logged in.');
                }
            });
            return unsubscribeAuth;
        }, [])

    return (
        <View style={styles.container}>
            <View style={styles.titleBar}>
                <Text style={styles.title}>Chats</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
                ) : (
            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.userCard} onPress={() => navigation.navigate('Chatroom', {user: item})}>
                        <FontAwesome name="user-circle" size={30} color="black" />
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.preview}>{item.lastMessage || 'No messages yet'}</Text>
                        {item.isUnread && (
                            <View style={styles.unreadDot}/>
                        )}
                    </TouchableOpacity>
                )}
            />
            )}
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title:{
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 30,
    },
    titleBar:{
        backgroundColor: '#38a1d3',
    },
    userCard:{
        height: 95,
        width: 410,
        marginLeft: 10,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 20,
    },
    name:{
        marginTop: -10,
        marginLeft: 20,
        fontSize: 20,
        fontWeight: 'bold',
    },
    preview:{
        fontSize: 14,
        color: 'gray',
        marginLeft: Platform.OS === 'android' ? -75 : -48,
        marginTop: 35,
        maxWidth: 300,
    },
    unreadDot:{
        width: 10,
        height: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        position: 'absolute',
        top: 40,
        left: 0,
    }
});
