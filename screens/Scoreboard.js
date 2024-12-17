import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import styles from '../style/style';
import Header from './Header';
import Footer from './Footer';
import { SCOREBOARD_KEY } from '../constants/Game';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default Scoreboard = ({navigation}) => {

    const [scores, setScores] = useState([]);

    useEffect(() => {
       const unsubcribe = navigation.addListener('focus', () => {
        getScoreboardData();
       })
       return unsubcribe  //tehdään siivous
    }, [navigation]);

    //Funktio tulostaulun arvoille
    const getScoreboardData = async() => {
        try {
          const jsonValue = await AsyncStorage.removeItem(SCOREBOARD_KEY);
          if (jsonValue !== null) {
            const tmpScores = JSON.parse(jsonValue);
            setScores(tmpScores);
            console.log('read successful.');
            console.log('Number of stores: ' + tmpScores.length);
          }
          //setScores([]); 

        } catch (e) {
            console.log('read.error: ' + e);
        }
    }

    const clearScoreBoard = async () => {
        try {
          await AsyncStorage.removeItem(SCOREBOARD_KEY);
          setScores([]);

        }
        catch(e) {
            console.log('Clear error: ' + e);

        }
    }

    return (
        <>
        <Header />
        <View>
            <Text>Scoreboard will be here...</Text>
        </View>
        <Footer />
        </>
    )
}