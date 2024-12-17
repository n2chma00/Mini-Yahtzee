import { Text, View } from 'react-native';
import styles from '../style/style';
import { StatusBar } from 'expo-status-bar';


export default Footer = () => {
    return (
        <View style={styles.footer}>
           <Text style={styles.author}>Author: Maria Chabani</Text>
           <StatusBar style="auto" />
        </View>
    )
}