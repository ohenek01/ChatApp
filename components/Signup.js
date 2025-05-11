import {useState} from 'react';
import {StyleSheet, Text, TextInput, View, TouchableOpacity} from 'react-native';
import {auth, db} from '../firebaseConfig';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {addDoc, collection} from 'firebase/firestore';
import {useNavigation} from "@react-navigation/native";

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const signUp = async () => {
        try{
            const userData = await createUserWithEmailAndPassword(auth, email, password);
            const user = userData.user;
            await addDoc(collection(db, "users"),{
                uid: user.uid,
                name: name,
                email: email,
            });
            alert("User successfully created!");
            navigation.replace('Login');
        }catch (error) {
            console.error("Sign up failed with error: ", error.message);
            alert("Error creating account");
        }
    }
    return(
        <View style={styles.container}>
            <Text style={styles.title}>SignUp</Text>

            <View style={styles.formBox}>
                <TextInput
                    placeholder='Name'
                    onChangeText={setName}
                    value={name}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Email'
                    onChangeText={setEmail}
                    value={email}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Password'
                    onChangeText={setPassword}
                    value={password}
                    style={styles.input}
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.button} onPress={() => signUp(email, password)}>
                    <Text style={styles.buttonText}>SignUp</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.smallTexts}>Already have an account? <Text style={{fontWeight: 'bold', fontStyle: 'italic'}} onPress={() => {navigation.navigate('Login')}}>Login</Text></Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#38a1d3',
    },
    title:{
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 180,
        textAlign: 'center',
    },
    formBox:{
        marginTop: 50,
        alignItems: 'center',
    },
    input:{
        height: 60,
        width: 400,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        fontSize: 16,
        marginTop: 35
    },
    button:{
        borderRadius: 10,
        backgroundColor: '#1a386e',
        marginTop: 55,
        width: 150,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    smallTexts:{
        fontSize: 16,
        color: '#fff',
        marginTop: 20,
        textAlign: 'center',
    }
});
