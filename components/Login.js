import {useState} from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebaseConfig';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const login = async(email, password) => {
        try{
            const userData = signInWithEmailAndPassword(auth, email, password);
            alert('Login successful!');
            navigation.replace('Chatlist');
        }catch (error) {
            console.error("Login failed with error:", error.message);
            alert("Login failed.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.formBox}>
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
                <TouchableOpacity style={styles.button} onPress={() => login(email, password)}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
                <Text style={styles.smallTexts}>Forgot Password?</Text>
            </View>
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
        fontStyle: 'italic',
    }
});