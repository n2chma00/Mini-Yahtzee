import { useEffect, useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import styles from '../style/style';
import Header from './Header';
import Footer from './Footer';
import { 
    NBR_OF_DICES, 
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS,
    BONUS_POINTS_LIMIT } from '../constants/Game';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Container, Row, Col } from 'react-native-flex-grid';
import { useFocusEffect } from '@react-navigation/native';

let board = []; //Määritetään pelille lauta

export default Gameboard = ({navigation, route}) => {
    
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices');
    const [gameEndStatus, setGameEndStatus] = useState(false);
    // Mitkä arpakuutioista ovat valittuna?
    const [selectedDices, setSelectedDices] =
       useState(new Array(NBR_OF_DICES).fill(false));
    // Arpakuutioiden silmäluvut
    const [diceSpots,setDiceSpots] =
       useState(new Array(NBR_OF_DICES).fill(0));
        //Valittujen arpakuutioiden kokonaispistemäärät
        const [dicePointsTotal, setdicePointsTotal] =
        useState(new Array(MAX_SPOT).fill(0)); 
    // Mitkä arpakuutioiden silmäluvuista on valittu pisteisiin 
    const [selectedDicePoints, setselectedDicePoints] = 
         useState(new Array(MAX_SPOT).fill(0));   
    const [playerName, setPlayerName] = useState('');   

    useEffect(() => {
        if (playerName === '' && route.params?.player)  {    //jos pelaajan nimi löytyy, eikä sitä oo asetettu vielä, niin se asetetaan arvoksi
          setPlayerName(route.params.player);
        }  
    }, []);

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

     const dicesRow = [];
     for (let i = 0; i < NBR_OF_DICES; i++) {
       dicesRow.push(
         <Pressable 
             key={"row" + i}
             onPress={() => chooseDice(i)}>

           <MaterialCommunityIcons
             name={board[i]}
             key={"row" + i}
             size={50} 
             color={getDiceColor(i)}>
           </MaterialCommunityIcons>
         </Pressable>
       );
     } 

    //Tässä luodaan pisterivi sarakkeittain (Col) 
    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"pointsRow" + spot}>
              <Text key={"pointsRow" + spot}>{getSpotTotal(spot)}</Text>  
            </Col>
        );
    }

    
    //Tässä luodaan rivi, joka kertoo onko pisteet jo valittu silmäluvulle
    const pointsToSelectRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
      pointsToSelectRow.push(
        <Col key={"buttonsRow" + diceButton}>
          <Pressable 
           key={"buttonsRow" + diceButton}
           onPress={() => chooseDicePoints(diceButton)}>
            <MaterialCommunityIcons
            name={"numeric-" + (diceButton + 1) + "-circle"}
            key={"buttonRow" + diceButton}
            size={35}
            color={getDicePointsColor(diceButton)}>
            </MaterialCommunityIcons>
          </Pressable>
        </Col>
      )
    }




    const chooseDice = (i) => {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus ) {//Jos jäljelle jääneiden heittojen lukumääärä on pienimpi kuin heittojen mahdollinen lukumäärä ja peli ei ole vielä päättynyt (!gameEndStatus)
          let dices = [...selectedDices];
          dices[i] = selectedDices[i] ? false : true;
          setSelectedDices(dices);
    }
         else {
            setStatus('You have to throw dices first')
         }
    }  

    const chooseDicePoints = (i) => {
      if (nbrOfThrowsLeft === 0) {
        let selectedPoints = [...setselectedDicePoints]; //paikallinen muuttuja, joka katsoaa onko valittu pisteet (selected points)
        let points = [...dicePointsTotal]; //paikallinen muuttuja, johon lasketaan dicePointsTotal eli kokonaispistemäärä. Tällä hetkellä on 0  0  0  0  0 THROW DICES painikkeen alla.
        if (!selectedPoints[i]) {
          selectedPoints[i] = true;  //Tässä asetetaan valituksi. Se on kiinnitetty pysyvästi
          let nbrOfDices =
          diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1: total), 0);
          console.log("nbr of dices: " + nbrOfDices);
          
          points[i]= nbrOfDices * (i + 1);
        } 
        else {
          setStatus("You already selected points for " + (i + 1));
          return points[i];

        }

        setdicePointsTotal(points);  //Kutsutaan funktiota tilamuuttujasta
        setselectedDicePoints(selectedPoints);
        return points[i];

      } else {
        setStatus("Throw " + NBR_OF_THROWS + " times before settings points.");
      }
    }

    function getDiceColor(i) { // Funktiota ei tarvitse nimetä uudestaan 
        return selectedDices[i] ? "black" : "steelblue";
      }

      function getDicePointsColor(i) { // Funktiota ei tarvitse nimetä uudestaan 
        return (selectedDicePoints[i] && !gameEndStatus) ? "black" : "steelblue";  //!gameEndStatus = peli päättyy tilanne (status)
      }

      function getSpotTotal(i) {
        return dicePointsTotal[i];
      }

      const throwDices = () => {
        let spots = {...diceSpots};
        for (let i = 0; i < NBR_OF_DICES; i++) {
          if (!selectedDices[i]) {
            let randomNumber = Math.floor(Math.random() * 6 + 1);
            board[i] = 'dice-' + randomNumber;
            spots[i] = randomNumber; //Sijoitetaan paikalliseen spot taulukkoon
        }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        setDiceSpots(spots); //korvataan tilamuuttujasta saatu spots arvo viimeisimmällä spots arvolla tässä komennossa.
        setStatus('Select and throw dices again');
    }
    
    return (
        <>
        <Header />
        <View>
          <Container>
            <Row>{dicesRow}</Row>
          </Container>  
            <Text>Throws left: {nbrOfThrowsLeft} </Text>
            <Text>{status}</Text>
            <Pressable onPress={() => throwDices()}>
              <Text>THROW DICES</Text>
            </Pressable>
            <Container>
                <Row>{pointsRow}</Row>
            </Container>
            <Container>
              <Row>{pointsToSelectRow}</Row>
            </Container>
            <Text>Player: {playerName}</Text> 
        </View>
        <Footer />
        </>
    )
}