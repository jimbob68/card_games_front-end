import React, { useEffect, useState } from 'react'
import './NominationWhist.css'
import backOfCard from '../../assets/back_of_card.png'
import WhistResultsModal from "./WhistResultsModal.js"
// import io from "socket.io-client"

// let socket

const NominationWhist = ({ players, setPlayers, socket, room }) => {

    const [ deckOfCards, setDeckOfCards ] = useState([])
    const [ numberOfPlayers, setNumberOfPlayers ] = useState(players.length)
    const [ playerOneHand, setPlayerOneHand ] = useState([])
    const [ playerTwoHand, setPlayerTwoHand ] = useState([])
    const [ playerThreeHand, setPlayerThreeHand ] = useState([])
    const [ playerFourHand, setPlayerFourHand ] = useState([])
    const [ playerFiveHand, setPlayerFiveHand ] = useState([])
    const [ imageSize, setImageSize ] = useState("whist-medium")
    const [ activePlayer, setActivePlayer ] = useState(1)
    const [ cardPot, setCardPot ] = useState([])
    const [ currentRound, setCurrentRound ] = useState(1)
    // const [ playerOneScore, setPlayerOneScore ] = useState(0)
    // const [ playerTwoScore, setPlayerTwoScore ] = useState(0)
    // const [ playerThreeScore, setPlayerThreeScore ] = useState(0)
    // const [ playerFourScore, setPlayerFourScore ] = useState(0)
    // const [ playerFiveScore, setPlayerFiveScore ] = useState(0)
    const [ currentHandNumber, setCurrentHandNumber ] = useState(1)
    const [ trickPrediction, setTrickPrediction ] = useState({})
    const [ predictionPlayer, setPredictionPlayer ] = useState(1)
    const [ currentPrediction, setCurrentPrediction ] = useState("")
    const [ startingPlayer, setStartingPlayer ] = useState(0)
    const [ roundScores, setRoundScores ] = useState({})
    const [ totalScores, setTotalScores ] = useState({})
    const [ whistModalIsOpen, setWhistModalIsOpen ] = useState(false)
    const [ gameScores, setGameScores ] = useState({})

    const trumpSuits = ["CLUBS", "DIAMONDS", "HEARTS", "SPADES", "NONE", "CLUBS", "DIAMONDS", "HEARTS", "SPADES", "NONE" ]

    // window.onbeforeunload = (event) => {
    //     event.returnValue = ""
    // }

    // const ENDPOINT = "localhost:5000"

    // useEffect(() => {
    //     socket = io(ENDPOINT, {
    //         transports: ["websocket"]
    //     })
    // })

    useEffect(() => {
        // if(players[0].id === socket.id)fetchCards(1)
        socket.on("hand", ({hand}) => {
            setPlayerOneHand(hand)
        })
        socket.on("set-next-player", ({nextPlayer, firstPlayer}) => {
            // if(activePlayer !== nextPlayer) {
                setActivePlayer(nextPlayer)
                if(firstPlayer){
                    setStartingPlayer(firstPlayer)
                }
            // }
            console.log("next player = " + nextPlayer + "--- activePlayer = " + activePlayer)
        })
        socket.on("set-card-pot", ({pot}) => {
            setCardPot(pot)
        })
        socket.on("set-prediction", ({nextPredictionPlayer, newPrediction}) => {
            setTrickPrediction(newPrediction)
            if(Object.entries(newPrediction).length === players.length){
                setPredictionPlayer(0)
            }else {
                setPredictionPlayer(nextPredictionPlayer)
                if(players[nextPredictionPlayer - 1].isComputer === true && players[0].id === socket.id){
                    setTimeout(() => {                  
                    computerPrediction(players[nextPredictionPlayer - 1], newPrediction, nextPredictionPlayer)
                }, 2000)
                }
            }
        })
       if(players[0].id === socket.id) {
           randomStartPlayer()
       }
       createPlayerScores()	
	}, []);

    useEffect(() => {
       if(players[0].id === socket.id)fetchCards(1)
    }, [currentRound])

    useEffect(() => {
        if(currentRound === 0 ) {
            handleDealCards(1)
            // setCurrentRound(1)
        } else {
            handleDealCards(currentRound)
        }

    }, [deckOfCards])

    useEffect(() => {
        if(cardPot.length === numberOfPlayers){
            handleEndHand()
        }
        // if(currentHandNumber === 10 - currentRound + 1 && cardPot.length === players.length){
        //     handleEndRound()
        // }
    }, [cardPot])

    useEffect(() => {
        if(currentHandNumber === 11 - currentRound + 1 && cardPot.length === players.length){
            handleEndRound()
        }
    }, [currentHandNumber])
    
    // useEffect(() => {
    //     // if (socket.id === players[activePlayer - 1].id) {
    //         socket.emit("get-next-player", {activePlayer, room})
    //     // }
    // }, [activePlayer])

    // useEffect(() => {
    //     handleEndRound()
    // }, [playerOneHand, playerTwoHand, playerThreeHand, playerFourHand, playerFiveHand])

    const fetchCards = (currentRoundVariable) => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle?deck_count=1')
            .then((res) => res.json())
            .then((results) => {
                console.log('deck info', results);
                return results.deck_id;
            })
            .then((deck_id) => {
                fetch('https://deckofcardsapi.com/api/deck/' + deck_id + '/draw/?count=52')
                    .then((res) => res.json())
                    .then((results) => setDeckOfCards(results.cards))
                    .then(() => handleDealCards(currentRoundVariable))
            })
            
            .catch(err => console.log(err))
        }

    const handleDealCards = (currentRoundVariable) => {
        // if(currentRound === 0) setCurrentRound(1)
        console.log("players:", players)
        players.forEach((player, index) => {
            const playerCards = deckOfCards.slice((index * 10), ((index + 1) * 10) - currentRoundVariable + 1)
            if(player.isComputer === true && playerCards.length !== 0){
                player.hand = playerCards
            } else {
                socket.emit("player-hand", {playerId: player.id, hand: playerCards}) 
            }
            setPlayers([...players])
        })
        // if(currentRound === 0) setCurrentRound(1)
        // let deck = deckOfCards;
        // console.log("currentRound:", currentRound)
        // setPlayerOneHand(deck.slice(0, (10 - currentRoundVariable + 1)));
        
        // if(numberOfPlayers >= 2){
        // setPlayerTwoHand(deck.slice((10), (20 - currentRoundVariable + 1)))
        // }
        // if(numberOfPlayers >= 3){
        // setPlayerThreeHand(deck.slice((20), (30 - currentRoundVariable + 1)))
        // }
        // if(numberOfPlayers >= 4){
        // setPlayerFourHand(deck.slice((30), (40 - currentRoundVariable + 1)))
        // }
        // if(numberOfPlayers >= 5){
        // setPlayerFiveHand(deck.slice((40), (50 - currentRoundVariable + 1)))
        // }
    }

    const computerPrediction = (currentComputerPlayer, previousPrediction, currentPredictionPlayer) => {
        console.log("currentComputerPlayer:", currentComputerPlayer)
        const computerName = currentComputerPlayer.name
        const hand = currentComputerPlayer.hand
        let goodCards = 0
        hand.forEach(card => {
            if(card.suit === trumpSuits[currentRound - 1]){
                goodCards += 1
            } else if(parseInt(card.value) > 9 || card.value === "JACK" || card.value === "QUEEN" || card.value === "KING" || card.value === "ACE"){
                goodCards += 1
            }
        })
        if(Object.entries(previousPrediction).length === players.length - 1){
            let totalPredictionAmount = 0
            Object.entries(previousPrediction).forEach(prediction => {
                totalPredictionAmount += parseInt(prediction[1])
            })
            if(totalPredictionAmount + goodCards === hand.length){
                goodCards -= 1
            }
        }
        previousPrediction[computerName] = goodCards
        setTrickPrediction({...previousPrediction})
        let nextPredictionPlayer = currentPredictionPlayer + 1
        if(currentPredictionPlayer === players.length) nextPredictionPlayer = 1
        socket.emit("update-predictions", {trickPrediction: previousPrediction, nextPredictionPlayer, room})
 }

    const createPlayerScores = () => {
        const startingRoundScores = {}
        players.forEach(player => {
            startingRoundScores[player.name] = 0
        })
        setTotalScores({...startingRoundScores})
        setRoundScores({...startingRoundScores})
        if(Object.entries(gameScores).length === 0){
            setGameScores({...startingRoundScores})
        }
    }

    const handleSelectCard = (card, cardIndex, hand) => {
        if(predictionPlayer > 0){
            alert("Predictions in progress!!!")
            return 
        }
        let hasSelectedSuit = false
        let selectedSuit
        let hasPlayedCard = false
        if(cardPot.length > 0 && cardPot.length < numberOfPlayers){
            selectedSuit = cardPot[0].suit
            hand.forEach(card => {
                if(card.suit === selectedSuit){
                    hasSelectedSuit = true
                }
            })
        }
        if(hand.length <= 10 - currentRound + 1 - currentHandNumber){
            hasPlayedCard = true
        }
        console.log("selected Suit:", selectedSuit)
        console.log("Has selected Suit:", hasSelectedSuit)
        let cardPotVariable = cardPot
        if(cardPotVariable.length === numberOfPlayers) cardPotVariable = []
        if(!hasPlayedCard && (card.suit === selectedSuit || !hasSelectedSuit)){
            if(socket.id === players[activePlayer - 1].id){
                card.player = activePlayer
                playerOneHand.splice(cardIndex, 1)
                setPlayerOneHand([...playerOneHand])
                if(activePlayer < numberOfPlayers){
                    // setActivePlayer(activePlayer + 1)
                    socket.emit("get-next-player", {activePlayer: (activePlayer + 1), room})

                    console.log("IN CARD")
                } else {
                    // setActivePlayer(1)
                    socket.emit("get-next-player", {activePlayer: 1, room})

                    console.log("IN CARD 2")
                }
                // setCardPot([...cardPotVariable, card])
                socket.emit("update-card-pot", {pot: [...cardPotVariable, card], room})
            } else {
                alert("Wait your turn!!!")
            }
            // if(activePlayer === 1){
            //     card.player = 1
            //     playerOneHand.splice(cardIndex, 1)
            //     setPlayerOneHand([...playerOneHand])
            // }
            // else if (activePlayer === 2){
            //     card.player = 2
            //     playerTwoHand.splice(cardIndex, 1)
            //     setPlayerTwoHand([...playerTwoHand])
            // }
            // else if (activePlayer === 3){
            //     card.player = 3
            //     playerThreeHand.splice(cardIndex, 1)
            //     setPlayerThreeHand([...playerThreeHand])
            // }
            // else if (activePlayer === 4){
            //     card.player = 4
            //     playerFourHand.splice(cardIndex, 1)
            //     setPlayerFourHand([...playerFourHand])
            // }
            // else if (activePlayer === 5){
            //     card.player = 5
            //     playerFiveHand.splice(cardIndex, 1)
            //     setPlayerFiveHand([...playerFiveHand])
            // }

            
        } else {
            alert("Please play " + selectedSuit )
        }
    }

    const handleEndRound = () => {
    //     if(playerOneHand.length === 0 && (playerTwoHand.length === 0) && (playerThreeHand.length === 0) && (playerFourHand.length === 0) && (playerFiveHand.length === 0) && currentRound > 0){
        const currentRoundVariable = currentRound 
        // if(players[0].id === socket.id){
        //     fetchCards(currentRoundVariable + 1)
        // }
        const newTotalScores = {...totalScores}
        const newRoundScores = {...roundScores}
        players.forEach(player => {
            const predictedScore = trickPrediction[player.name]
            const actualScore = roundScores[player.name]
            newRoundScores[player.name] = 0
            if(parseInt(predictedScore) === parseInt(actualScore)){
                newTotalScores[player.name] += 10
            }
        }) 
        console.log("New total scores:", newTotalScores)
        if(currentRound === 10){
            // let winner
            // let highestScore = 0 
            // Object.entries(newTotalScores).forEach(player => {
            //     if(player[1] > highestScore){
            //         winner = player[0]
            //     }
            // })
            setTimeout(() => {
                // alert("The Winner is " + winner + "!")
                setWhistModalIsOpen(true)
            }, 1500)
        }
        const currentStartingPlayer = startingPlayer
        if(startingPlayer === players.length){
            setPredictionPlayer(1)
            setStartingPlayer(1)
            setActivePlayer(1) 
        }else{
            setPredictionPlayer(currentStartingPlayer + 1)
            setStartingPlayer(currentStartingPlayer + 1)
            setActivePlayer(currentStartingPlayer + 1)
        }
        setCurrentPrediction("")
        setCurrentHandNumber(1)
        setTrickPrediction({})
        setTimeout(() => {
            setCurrentRound(currentRoundVariable + 1)
            // handleDealCards(currentRoundVariable + 1)
            setCardPot([])
            setTotalScores(newTotalScores)
            setRoundScores(newRoundScores)
        }, 1000)
    //     }
    }

    const handleEndHand = () => {
        const trumpSuit = trumpSuits[currentRound - 1]
        const selectedSuit = cardPot[0].suit
        let highestTrumpCard = {value: 0}
        let highestSuitCard = {value: 0}
        cardPot.forEach(card => {
            if(card.value === "JACK")card.value = "11"
            if(card.value === "QUEEN")card.value = "12"
            if(card.value === "KING")card.value = "13"
            if(card.value === "ACE")card.value = "14"

            if(card.suit === trumpSuit && parseInt(card.value) > parseInt(highestTrumpCard.value)){
                highestTrumpCard = card
            }
            if(card.suit === selectedSuit && parseInt(card.value) > parseInt(highestSuitCard.value)){
                highestSuitCard = card
            }
        })
        console.log("highest Trump Card:", highestTrumpCard)
        console.log("highest Suit Card:", highestSuitCard)

        if(highestTrumpCard.value > 0){
            const winningPlayer = players[highestTrumpCard.player - 1]
            totalScores[winningPlayer.name] = totalScores[winningPlayer.name] + 1
            setTotalScores({...totalScores})

            roundScores[winningPlayer.name] = roundScores[winningPlayer.name] + 1
            setRoundScores({...roundScores})
            socket.emit("get-next-player", {activePlayer: highestTrumpCard.player, room})

                
            // if(highestTrumpCard.player === 1) {
            //     setPlayerOneScore(playerOneScore + 1)
                
            //     // setActivePlayer(1)
                

            //     console.log("1")
            // }
            // if(highestTrumpCard.player === 2) {
            //     setPlayerTwoScore(playerTwoScore + 1) 
            //     // setActivePlayer(2)
            //     socket.emit("get-next-player", {activePlayer: 2, room})

            //     console.log("2")
            // }
            // if(highestTrumpCard.player === 3) {
            //     setPlayerThreeScore(playerThreeScore + 1) 
            //     // setActivePlayer(3)
            //     socket.emit("get-next-player", {activePlayer: 3, room})

            //     console.log("3")
            // }
            // if(highestTrumpCard.player === 4) {
            //     setPlayerFourScore(playerFourScore + 1) 
            //     // setActivePlayer(4)
            //     socket.emit("get-next-player", {activePlayer: 4, room})

            //     console.log("4")
            // }
            // if(highestTrumpCard.player === 5) {
            //     setPlayerFiveScore(playerFiveScore + 1) 
            //     // setActivePlayer(5)
            //     socket.emit("get-next-player", {activePlayer: 5, room})

            //     console.log("5")
            // }
        } else {

            const winningPlayer = players[highestSuitCard.player - 1]
            totalScores[winningPlayer.name] = totalScores[winningPlayer.name] + 1
            setTotalScores({...totalScores})
            roundScores[winningPlayer.name] = roundScores[winningPlayer.name] + 1
            setRoundScores({...roundScores})
            socket.emit("get-next-player", {activePlayer: highestSuitCard.player, room})

        //     if(highestSuitCard.player === 1) {
        //         setPlayerOneScore(playerOneScore + 1)
        //         socket.emit("get-next-player", {activePlayer: 1, room})
        //         // setActivePlayer(1)
        //         console.log("6")
        //     }
        //     if(highestSuitCard.player === 2) {
        //         setPlayerTwoScore(playerTwoScore + 1)
        //         socket.emit("get-next-player", {activePlayer: 2, room})
        //         // setActivePlayer(2)
        //         console.log("7")
        //     }
        //     if(highestSuitCard.player === 3) {
        //         setPlayerThreeScore(playerThreeScore + 1)
        //         socket.emit("get-next-player", {activePlayer: 3, room})
        //         // setActivePlayer(3)
        //         console.log("8")
        //     }
        //     if(highestSuitCard.player === 4) {
        //         setPlayerFourScore(playerFourScore + 1)
        //         socket.emit("get-next-player", {activePlayer: 4, room})
        //         // setActivePlayer(4)
        //         console.log("9")
        //     }
        //     if(highestSuitCard.player === 5) {
        //         setPlayerFiveScore(playerFiveScore + 1)
        //         socket.emit("get-next-player", {activePlayer: 5, room})
        //         // setActivePlayer(5)
        //         console.log("10")
        //     }
        }
        setCurrentHandNumber(currentHandNumber + 1)
    }

    const displayCards = (hand, playerNumber) => {
        let cardImages = []
        if(currentRound === 10 && hand.length === 1){
            cardImages.push(<img className={imageSize} src={backOfCard} onClick={() => handleSelectCard(hand[0], 0, hand)} alt="back of card"/>)
        } else {
            cardImages = hand.map((card, index) => <img onClick={() => handleSelectCard(card, index, hand)} className={imageSize} src={card.image} alt={card.code} />);
        }
             
            return <div className="whist-player-hand">{cardImages}</div>;
    }

    const displayPotCards = (hand, playerNumber) => {
            const cardImages = hand.map((card, index) => <img className={imageSize} src={card.image} alt={card.code} />);
            return <div className="whist-player-hand">{cardImages}</div>;
    }

    const getPlayerName = () => {
        const player = players.find(player => player.id === socket.id) 
        return player.name   
    }

    const displayPredictionDropdown = () => {
        let total = 0
        for (const [key, value] of Object.entries(trickPrediction)){
            total += parseInt(value)
        }
        const optionsArray = [<option value="" disabled selected>Number of tricks</option>]
        
            for(let index = 0; index < playerOneHand.length + 1; index++) {
                if(total + index === playerOneHand.length && players.length === Object.entries(trickPrediction).length + 1){
                    optionsArray.push(<option disabled value={index}>{index}</option>)
                } else {
                    optionsArray.push(<option value={index}>{index}</option>)
                }
                
            }
        return <select value={currentPrediction} onChange={(event) => setCurrentPrediction(event.target.value)}>{optionsArray}</select>
    }

    const handleConfirmPrediction = () => {
        const name = getPlayerName()
        trickPrediction[name] = currentPrediction
        setTrickPrediction({...trickPrediction})
        let nextPredictionPlayer = predictionPlayer + 1
        if (predictionPlayer === players.length) nextPredictionPlayer = 1 
        socket.emit("update-predictions", {trickPrediction, nextPredictionPlayer, room})
    }

    const randomStartPlayer = () => {
        const randomPlayer = Math.floor(Math.random() * players.length) + 1
        setActivePlayer(randomPlayer)
        setPredictionPlayer(randomPlayer)
        setStartingPlayer(randomPlayer)
        socket.emit("get-next-player", {activePlayer: randomPlayer, room, firstPlayer: randomPlayer})
        socket.emit("update-predictions", {trickPrediction, nextPredictionPlayer: randomPlayer, room})
    }

    const displayPrediction = (playerNumber) => {
        const prediction = trickPrediction[players[playerNumber].name]
        if(prediction){
            return prediction
        }else if(players[predictionPlayer - 1].name === players[playerNumber].name){
            return "Predicting..."
        }else{
            return "Waiting..."
        }
    }

    return(
        <div>
            <p>Nomination Whist</p>
            <select value={numberOfPlayers} onChange={(event) => {
				setNumberOfPlayers(parseInt(event.target.value))}}>
				<option value={0}>No. of Players</option>
				<option value={1}>1</option>
				<option value={2}>2</option>
				<option value={3}>3</option>
				<option value={4}>4</option>
                <option value={5}>5</option>
			</select>

            <button onClick={() => handleDealCards(1)}>Start Game</button>
            <h3>{getPlayerName()}</h3>
            {players[activePlayer - 1] && <p>Active Player: {players[activePlayer - 1].name}  Trump Suit: {trumpSuits[currentRound - 1]} Round: {currentRound}</p>}
            {players[0] && <p>{players[0].name}: RS: {roundScores[players[0].name]} TS: {totalScores[players[0].name]} P: {displayPrediction(0)} gs:{gameScores[players[0].name]} </p>}
            {players[1] && <p>{players[1].name}: RS: {roundScores[players[1].name]} TS: {totalScores[players[1].name]} P: {displayPrediction(1)} gs:{gameScores[players[1].name]}</p>}
            {players[2] && <p>{players[2].name}: RS: {roundScores[players[2].name]} TS: {totalScores[players[2].name]} P: {displayPrediction(2)} gs:{gameScores[players[2].name]}</p>}
            {players[3] && <p>{players[3].name}: RS: {roundScores[players[3].name]} TS: {totalScores[players[3].name]} P: {displayPrediction(3)} gs:{gameScores[players[3].name]}</p>}
            {players[4] && <p>{players[4].name}: RS: {roundScores[players[4].name]} TS: {totalScores[players[4].name]} P: {displayPrediction(4)} gs:{gameScores[players[4].name]}</p>}
            {displayPotCards(cardPot)}
            {predictionPlayer > 0 && socket.id === players[predictionPlayer - 1].id && <div>
            {displayPredictionDropdown()}
            <button disabled={currentPrediction === ""} onClick={ () => handleConfirmPrediction()} >Confirm Prediction</button>
            </div>} 
            {displayCards(playerOneHand)}
            {/* {displayCards(playerTwoHand)}
            {displayCards(playerThreeHand)}
            {displayCards(playerFourHand)}
            {displayCards(playerFiveHand)} */}
            <WhistResultsModal whistModalIsOpen={whistModalIsOpen} setWhistModalIsOpen={setWhistModalIsOpen} totalScores={totalScores} setCurrentRound={setCurrentRound} createPlayerScores={createPlayerScores} gameScores={gameScores} setGameScores={setGameScores}/>
        </div>
    )
}
export default NominationWhist