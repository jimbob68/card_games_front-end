import React, { useEffect, useState } from 'react'
import './NominationWhist.css'
import backOfCard from '../../assets/back_of_card.png'
import WhistResultsModal from "./WhistResultsModal.js"
const NominationWhist = ({ players, setPlayers, socket, room }) => {

    const [ deckOfCards, setDeckOfCards ] = useState([])
    const [ numberOfPlayers, setNumberOfPlayers ] = useState(players.length)
    const [ playerOneHand, setPlayerOneHand ] = useState([])
    const [ imageSize, setImageSize ] = useState("whist-medium")
    const [ activePlayer, setActivePlayer ] = useState(1)
    const [ cardPot, setCardPot ] = useState([])
    const [ currentRound, setCurrentRound ] = useState(1)
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

    useEffect(() => {
        socket.on("hand", ({hand}) => {
            setPlayerOneHand(hand)
        })
        socket.on("set-next-player", ({nextPlayer, firstPlayer}) => {
            console.log("nextPlayer", nextPlayer)
            if(cardPot.length === players.length) {
                setCardPot([...cardPot])
            }
            setActivePlayer(nextPlayer)
            if(firstPlayer){
                setStartingPlayer(firstPlayer)
            }
        })
        socket.on("set-card-pot", ({pot}) => {
            setCardPot(pot)
        })
        socket.on("set-prediction", ({nextPredictionPlayer, newPrediction}) => {
            setTrickPrediction(newPrediction)
            if(Object.entries(newPrediction).length === players.length){
                setPredictionPlayer(0)
                setCardPot([...cardPot])
            }else {
                setPredictionPlayer(nextPredictionPlayer)
                if(players[nextPredictionPlayer - 1].isComputer === true && players[0].id === socket.id){
                    setTimeout(() => {                  
                        computerPrediction(players[nextPredictionPlayer - 1], newPrediction, nextPredictionPlayer)
                    }, 2000) // 2000
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
        } else {
            handleDealCards(currentRound)
        }

    }, [deckOfCards])

    useEffect(() => {
        if(cardPot.length === numberOfPlayers){
            handleEndHand()
        }
           if(players[activePlayer - 1].isComputer && predictionPlayer === 0 && players[0].id === socket.id){
                if(cardPot.length < players.length){
                    computerPlayCard(players[activePlayer - 1])
                }                 
            } 
    }, [cardPot])

    useEffect(() =>{
        if(cardPot.length === players.length){
            setTimeout(() => {
                setCardPot([])
            }, 2000) // 1000
            
        }
    }, [activePlayer])

    useEffect(() => {
        if(currentHandNumber === 11 - currentRound + 1 && cardPot.length === players.length){
            handleEndRound()
        }
    }, [currentHandNumber])
    
    const fetchCards = () => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle?deck_count=1')
            .then((res) => res.json())
            .then((results) => {
                return results.deck_id;
            })
            .then((deck_id) => {
                fetch('https://deckofcardsapi.com/api/deck/' + deck_id + '/draw/?count=52')
                    .then((res) => res.json())
                    .then((results) => setDeckOfCards(results.cards))
            })
            
            .catch(err => console.log(err))
        }

    const handleDealCards = (currentRoundVariable) => {
        players.forEach((player, index) => {
            const playerCards = deckOfCards.slice((index * 10), ((index + 1) * 10) - currentRoundVariable + 1)
            if(player.isComputer === true && playerCards.length !== 0){
                player.hand = playerCards
            } else {
                socket.emit("player-hand", {playerId: player.id, hand: playerCards}) 
            }
            setPlayers([...players])
        })
    }

    const computerPrediction = (currentComputerPlayer, previousPrediction, currentPredictionPlayer) => {
        const computerName = currentComputerPlayer.name
        const hand = currentComputerPlayer.hand
        if(hand.length === 0) {
            socket.emit("update-predictions", {trickPrediction: previousPrediction, nextPredictionPlayer: currentPredictionPlayer, room})
            return
        }
        let goodCards = 0
        hand.forEach(card => {
            if(card.suit === trumpSuits[currentRound - 1]){
                goodCards += 1
            } else if(parseInt(card.value) > 9 || card.value === "JACK" || card.value === "QUEEN" || card.value === "KING" || card.value === "ACE"){
                goodCards += 1
            }
        })
        if(hand.length > 5){
            if(players.length >= 4){
                goodCards = Math.floor(goodCards * 0.5) 
            }else if(players.length === 3){
                goodCards = Math.floor(goodCards * 0.75)
            }

        }
        if(Object.entries(previousPrediction).length === players.length - 1){
            let totalPredictionAmount = 0
            Object.entries(previousPrediction).forEach(prediction => {
                totalPredictionAmount += parseInt(prediction[1])
            })
            if(totalPredictionAmount + goodCards === hand.length){
                if(goodCards === 0) {
                    goodCards += 1
                } else {
                    goodCards -= 1
                }
            }
        }

        previousPrediction[computerName] = goodCards
        setTrickPrediction({...previousPrediction})
        let nextPredictionPlayer = currentPredictionPlayer + 1
        if(currentPredictionPlayer === players.length) nextPredictionPlayer = 1
        socket.emit("update-predictions", {trickPrediction: previousPrediction, nextPredictionPlayer, room})
 }

    const computerPlayCard = (computerPlayer) => {
        let selectedSuit
        let highestSuitCardInPot = {value: 0}
        let highestTrumpCardInPot = {value: 0}
        if(cardPot.length > 0 && cardPot.length < players.length){
            selectedSuit = cardPot[0].suit
        }
        cardPot.forEach(card => {
            if(card.value === "JACK") card.value = 11
            if(card.value === "QUEEN") card.value = 12
            if(card.value === "KING") card.value = 13
            if(card.value === "ACE") card.value = 14
            if(card.suit === selectedSuit && parseInt(card.value) > parseInt(highestSuitCardInPot.value)){
                highestSuitCardInPot = card
            }
            if(card.suit === trumpSuits[currentRound - 1] && parseInt(card.value) > parseInt(highestTrumpCardInPot.value)){
                highestTrumpCardInPot = card
            }
        })
        let highestSuitCardInHand = {value: 0}
        let lowestSuitCardInHand = {value: 100}
        let highestTrumpCardInHand = {value: 0}
        let highestCardInHand = {value: 0}
        let lowestCardInHand = {value: 100}

        computerPlayer.hand.forEach((card, index) => {
            if(card.value === "JACK") card.value = 11
            if(card.value === "QUEEN") card.value = 12
            if(card.value === "KING") card.value = 13
            if(card.value === "ACE") card.value = 14
            card.index = index
            if(card.suit === selectedSuit && parseInt(card.value) > parseInt(highestSuitCardInHand.value)){
                highestSuitCardInHand = card
            }
            if(card.suit === selectedSuit && parseInt(card.value) < parseInt(lowestSuitCardInHand.value)){
                lowestSuitCardInHand = card
            }
            if(parseInt(card.value) < parseInt(lowestCardInHand.value)){
                lowestCardInHand = card
            }
            if(parseInt(card.value) > parseInt(highestCardInHand.value)){
                highestCardInHand = card
            }
            if(card.suit === trumpSuits[currentRound - 1] && parseInt(card.value) > parseInt(highestTrumpCardInHand.value)){
                highestTrumpCardInHand = card
            }
        })
        setTimeout(() => {
            if(cardPot.length === 0 || cardPot.length === players.length){
                handleSelectCard(highestCardInHand, highestCardInHand.index, computerPlayer.hand)
            } else if(parseInt(highestSuitCardInHand.value) > parseInt(highestSuitCardInPot.value)){
                handleSelectCard(highestSuitCardInHand, highestSuitCardInHand.index, computerPlayer.hand)
            } else if(parseInt(highestSuitCardInHand.value) < parseInt(highestSuitCardInPot.value) && parseInt(highestSuitCardInHand.value) > 0){
                handleSelectCard(lowestSuitCardInHand, lowestSuitCardInHand.index, computerPlayer.hand)
            } else if(parseInt(highestSuitCardInHand.value) === 0){
                if(parseInt(highestTrumpCardInHand.value) > 0 && parseInt(highestTrumpCardInHand.value) > parseInt(highestTrumpCardInPot.value)){
                    handleSelectCard(highestTrumpCardInHand, highestTrumpCardInHand.index, computerPlayer.hand)
                } else {
                    handleSelectCard(lowestCardInHand, lowestCardInHand.index, computerPlayer.hand)
                }
            }
        }, 4000) // 1000
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
        if(predictionPlayer > 0 && players[activePlayer - 1].isComputer === false){
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
        let cardPotVariable = [...cardPot]
        if(cardPotVariable.length === numberOfPlayers) cardPotVariable = []
        if(hasPlayedCard){
            return
        }
        if(socket.id === players[activePlayer - 1].id && (card.suit !== selectedSuit && hasSelectedSuit)){
            alert("Please Play " + selectedSuit)
            return
        }
        if(socket.id === players[activePlayer - 1].id || players[activePlayer - 1].isComputer === true){
            card.player = activePlayer
            if(players[activePlayer - 1].isComputer){
                players[activePlayer - 1].hand.splice(cardIndex, 1)
                setPlayers([...players])
            } else {
                playerOneHand.splice(cardIndex, 1)
                setPlayerOneHand([...playerOneHand])
            }

            if(cardPot.length + 1 === players.length){
                socket.emit("update-card-pot", {pot: [...cardPotVariable, card], room})
                return
            }
          
            if(activePlayer < numberOfPlayers){
                socket.emit("get-next-player", {activePlayer: (activePlayer + 1), room, predictionPlayer})
            } else {
                socket.emit("get-next-player", {activePlayer: 1, room, predictionPlayer})
            }
            socket.emit("update-card-pot", {pot: [...cardPotVariable, card], room})
        }
    }

    const handleEndRound = () => {
        const currentRoundVariable = currentRound 
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
        if(currentRound === 10){
            setTimeout(() => {
                setWhistModalIsOpen(true)
            }, 1500) // 1000
        }
        const currentStartingPlayer = startingPlayer
        if(startingPlayer === players.length){
            setPredictionPlayer(1)
            setStartingPlayer(1)
            setActivePlayer(1)
            socket.emit("get-next-player", {activePlayer: 1, room, predictionPlayer})
            socket.emit("update-predictions", {trickPrediction: {}, nextPredictionPlayer: 1, room})
        }else{
            setPredictionPlayer(currentStartingPlayer + 1)
            setStartingPlayer(currentStartingPlayer + 1)
            setActivePlayer(currentStartingPlayer + 1)
            socket.emit("get-next-player", {activePlayer: currentStartingPlayer + 1, room, predictionPlayer})
            socket.emit("update-predictions", {trickPrediction: {}, nextPredictionPlayer: currentStartingPlayer + 1, room})
        }
        setCurrentPrediction("")
        setCurrentHandNumber(1)
        setTrickPrediction({})
        setTimeout(() => {
            setCurrentRound(currentRoundVariable + 1)
            setCardPot([])
            setTotalScores(newTotalScores)
            setRoundScores(newRoundScores)
        }, 1000)
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

        if(highestTrumpCard.value > 0){
            const winningPlayer = players[highestTrumpCard.player - 1]
            totalScores[winningPlayer.name] = totalScores[winningPlayer.name] + 1
            setTotalScores({...totalScores})

            roundScores[winningPlayer.name] = roundScores[winningPlayer.name] + 1
            setRoundScores({...roundScores})
            if(playerOneHand.length > 0){
                socket.emit("get-next-player", {activePlayer: highestTrumpCard.player, room, predictionPlayer})
            }

        } else {

            const winningPlayer = players[highestSuitCard.player - 1]
            totalScores[winningPlayer.name] = totalScores[winningPlayer.name] + 1
            setTotalScores({...totalScores})
            roundScores[winningPlayer.name] = roundScores[winningPlayer.name] + 1
            setRoundScores({...roundScores})
            if(playerOneHand.length > 0){
                socket.emit("get-next-player", {activePlayer: highestSuitCard.player, room, predictionPlayer})
            }
        }
        setActivePlayer(null)
        setCurrentHandNumber(currentHandNumber + 1)
    }

    const displayCards = (hand, playerNumber) => {
        let cardImages = []
        if(currentRound === 10 && hand.length === 1){
            cardImages.push(<img className={imageSize} src={backOfCard} onClick={() => handleSelectCard(hand[0], 0, hand)} alt="back of card"/>)
        } else {
            cardImages = hand.map((card, index) => <img onClick={() => handleClickCard(card, index, hand)} className={imageSize} src={card.image} alt={card.code} />);
        }
             
            return <div className="whist-player-hand">{cardImages}</div>;
    }

    const handleClickCard = (card, index, hand) => {
        if(players[activePlayer - 1].id === socket.id){
            handleSelectCard(card, index, hand)
        } else {
            alert("Wait your turn!!!")
        }
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
        if(prediction >= 0){
            return prediction
        }else if(predictionPlayer > 0 && players[predictionPlayer - 1].name === players[playerNumber].name){
            return "Predicting..."
        }else{
            return "Waiting..."
        }
    }

    const displayScoresTable = () => {
        let rowClass
        
        let playersScores = players.map((player, index) => {
            if(predictionPlayer - 1 === index || (activePlayer - 1 === index && predictionPlayer === 0)) {
                rowClass = "yellow"
            }else {
                rowClass = null
            }
            return (
                // <tr className={activePlayer -1 === index ? "yellow" : null }>
                <tr className={rowClass}>
                    <td>{player.name}</td>
                    <td>{displayPrediction(index)}</td>
                    <td>{roundScores[player.name]}</td>
                    <td>{totalScores[player.name]}</td>
                    <td>{gameScores[player.name]}</td>
                </tr>)
        })
        return (
            <table className="score-table">
                <tr>
                    <th>Name</th>
                    <th>Prediction</th>
                    <th>Round Score</th>
                    <th>Total Score</th>
                    <th>Game Score</th>
                </tr>
                {playersScores}
            </table>
        )
    }

    return(
        <div>
            <p>Nomination Whist</p>
            <h3>{getPlayerName()}</h3>
            {players[activePlayer - 1] && <p>Active Player: {players[activePlayer - 1].name}  Trump Suit: {trumpSuits[currentRound - 1]} Round: {currentRound}</p>}
            {/* {players[0] && <p>{players[0].name}: P: {displayPrediction(0)} RS: {roundScores[players[0].name]} TS: {totalScores[players[0].name]}  gs:{gameScores[players[0].name]} </p>}
            {players[1] && <p>{players[1].name}: P: {displayPrediction(1)} RS: {roundScores[players[1].name]} TS: {totalScores[players[1].name]}  gs:{gameScores[players[1].name]}</p>}
            {players[2] && <p>{players[2].name}: P: {displayPrediction(2)} RS: {roundScores[players[2].name]} TS: {totalScores[players[2].name]}  gs:{gameScores[players[2].name]}</p>}
            {players[3] && <p>{players[3].name}: P: {displayPrediction(3)} RS: {roundScores[players[3].name]} TS: {totalScores[players[3].name]}  gs:{gameScores[players[3].name]}</p>}
            {players[4] && <p>{players[4].name}: P: {displayPrediction(4)} RS: {roundScores[players[4].name]} TS: {totalScores[players[4].name]}  gs:{gameScores[players[4].name]}</p>} */}
            {displayScoresTable()}
            {displayPotCards(cardPot)}
            {predictionPlayer > 0 && socket.id === players[predictionPlayer - 1].id && <div>
            {displayPredictionDropdown()}
            <button disabled={currentPrediction === ""} onClick={ () => handleConfirmPrediction()} >Confirm Prediction</button>
            </div>} 
            {displayCards(playerOneHand)}
            <WhistResultsModal whistModalIsOpen={whistModalIsOpen} setWhistModalIsOpen={setWhistModalIsOpen} totalScores={totalScores} setCurrentRound={setCurrentRound} createPlayerScores={createPlayerScores} gameScores={gameScores} setGameScores={setGameScores}/>
        </div>
    )
}
export default NominationWhist