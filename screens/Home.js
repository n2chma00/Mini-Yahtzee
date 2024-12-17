import { useState } from 'react';
import { Text, View, TextInput, Pressable, Keyboard } from 'react-native';
import styles from '../style/style';
import Header from './Header';
import Footer from './Footer';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { 
    NBR_OF_DICES, 
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS,
    BONUS_POINTS_LIMIT } from '../constants/Game';
export default Home = ({navigation}) => {

    const [playerName, setPlayerName] = useState('');        //Tilamuuttujat
    const [hasPlayerName, setHasPlayerName] = useState(false);



    const handlePlayerName = (value) => {        //Nimen käsittelyfunktio
        if (value.trim().length > 0) {           //Tutkitaan parametrinä tullutta arvoa
            setHasPlayerName(true);              //Setmuuttuja on otettu tilamuuttujasta ja jos trimmien määrä on suurempi kuin nolla niin asetetaan setMutttuja true:ksi, koska pelaajan nimi on silloin annettu.
            Keyboard.dismiss();                  //Tämä funktio piilottaa näytöllä näkyvän virtuaalisen näppäimistön. Sen jälkeen kun pelaaja on antanut nimensä, ja siirtyy toiselle sivulle, niin virtuaalinäppäimistöä ei enää tarvitse näkyä.
        }
    }
    return (
        <>
        <Header />
        <View>
            <MaterialCommunityIcons name="information" size={90} color="steelblue"/>
            {!hasPlayerName ?
             <>
             <Text>For Scoreboard enter your name...</Text>
             <TextInput onChangeText={setPlayerName} autoFocus={true} />
             <Pressable
             onPress={() => handlePlayerName(playerName)}
             >
                <Text>OK</Text>
             </Pressable>
             </>
            :
            <>
             <Text>Rules of the Game</Text>
             <Text multiline="true">
               THE GAME: Upper section of the classic Yahtzee 
               dice game. You have {NBR_OF_DICES} dices and 
               for the every dice you have {NBR_OF_THROWS}
               throws. After each throw you can keep dices in 
               order to get same dice spot counts as many as 
               possible. In the end of the turn you must select 
               your points from {MIN_SPOT} to {MAX_SPOT}. 
               Game ends when all points have been selected. 
               The order for selecting those is free. 
               POINTS: After each turn game calculates the sum 
               for the dices you selected. Only the dices having 
               the same spot count are calculated. Inside the 
               game you can not select same points from 
               {MIN_SPOT} to {MAX_SPOT} again. 
               GOAL: To get points as much as possible. 
               {BONUS_POINTS_LIMIT} points is the limit of 
               getting bonus which gives you {BONUS_POINTS} points more.  
             </Text>
             <Text>Good luck, {playerName}</Text>
             <Pressable
             onPress={() => navigation.navigate('Gameboard', {player: playerName})}>      
             <Text>PLAY</Text>
             </Pressable>
             
            </>
         }    
        </View>
        <Footer />
        </>
    )
}