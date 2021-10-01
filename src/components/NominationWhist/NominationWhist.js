import React, { useEffect, useState } from 'react'
import './NominationWhist.css'
// import io from "socket.io-client"

// let socket

const NominationWhist = ({ players, setPlayers, socket }) => {

    const [ deckOfCards, setDeckOfCards ] = useState([])
    const [ numberOfPlayers, setNumberOfPlayers ] = useState(2)
    const [ playerOneHand, setPlayerOneHand ] = useState([])
    const [ playerTwoHand, setPlayerTwoHand ] = useState([])
    const [ playerThreeHand, setPlayerThreeHand ] = useState([])
    const [ playerFourHand, setPlayerFourHand ] = useState([])
    const [ playerFiveHand, setPlayerFiveHand ] = useState([])
    const [ imageSize, setImageSize ] = useState("whist-medium")
    const [ activePlayer, setActivePlayer ] = useState(1)
    const [ cardPot, setCardPot ] = useState([])
    const [ currentRound, setCurrentRound ] = useState(0)
    const [ playerOneScore, setPlayerOneScore ] = useState(0)
    const [ playerTwoScore, setPlayerTwoScore ] = useState(0)
    const [ playerThreeScore, setPlayerThreeScore ] = useState(0)
    const [ playerFourScore, setPlayerFourScore ] = useState(0)
    const [ playerFiveScore, setPlayerFiveScore ] = useState(0)
    const [ currentHandNumber, setCurrentHandNumber ] = useState(1)

    const trumpSuits = ["CLUBS", "DIAMONDS", "HEARTS", "SPADES", "", "CLUBS", "DIAMONDS", "HEARTS", "SPADES", "" ]

    // const ENDPOINT = "localhost:5000"

    // useEffect(() => {
    //     socket = io(ENDPOINT, {
    //         transports: ["websocket"]
    //     })
    // })

    useEffect(() => {
		
        fetchCards()
        handleDealCards(1)
        socket.on("hand", ({hand}) => {
            setPlayerOneHand(hand)
        })
		
	}, []);

    useEffect(() => {
        if(cardPot.length === numberOfPlayers){
        handleEndHand()
        }
    }, [cardPot])

    useEffect(() => {
        handleEndRound()
    }, [playerOneHand, playerTwoHand, playerThreeHand, playerFourHand, playerFiveHand])

    const fetchCards = () => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle?deck_count=1')
            .then((res) => res.json())
            .then((results) => {
                console.log('deck info', results);
                return results.deck_id;
            })
            .then((deck_id) => {
                fetch('https://deckofcardsapi.com/api/deck/' + deck_id + '/draw/?count=52')
                    .then((res) => res.json())
                    .then((results) => setDeckOfCards(results.cards));
            })
            .catch(err => console.log(err))
        }

    const handleDealCards = (currentRoundVariable) => {

        players.forEach((player, index) => {
            const playerCards = deckOfCards.slice((index * 10), ((index + 1) * 10) - currentRoundVariable + 1)
            socket.emit("player-hand", {playerId: player.id, hand: playerCards}) 
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

    const handleSelectCard = (card, cardIndex, hand) => {
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
            if(activePlayer === 1){
                card.player = 1
                playerOneHand.splice(cardIndex, 1)
                setPlayerOneHand([...playerOneHand])
            }
            else if (activePlayer === 2){
                card.player = 2
                playerTwoHand.splice(cardIndex, 1)
                setPlayerTwoHand([...playerTwoHand])
            }
            else if (activePlayer === 3){
                card.player = 3
                playerThreeHand.splice(cardIndex, 1)
                setPlayerThreeHand([...playerThreeHand])
            }
            else if (activePlayer === 4){
                card.player = 4
                playerFourHand.splice(cardIndex, 1)
                setPlayerFourHand([...playerFourHand])
            }
            else if (activePlayer === 5){
                card.player = 5
                playerFiveHand.splice(cardIndex, 1)
                setPlayerFiveHand([...playerFiveHand])
            }

            if(activePlayer < numberOfPlayers){
                setActivePlayer(activePlayer + 1)
            } else {
                setActivePlayer(1)

            }
            setCardPot([...cardPotVariable, card])
        } else {
            alert("Please play " + selectedSuit )
        }
    }

    
    const handleEndRound = () => {
        if(playerOneHand.length === 0 && (playerTwoHand.length === 0) && (playerThreeHand.length === 0) && (playerFourHand.length === 0) && (playerFiveHand.length === 0) && currentRound > 0){
            fetchCards()
            const currentRoundVariable = currentRound 
            setCurrentHandNumber(1)
            setTimeout(() => {
                setCurrentRound(currentRoundVariable + 1)
                handleDealCards(currentRoundVariable + 1)
                setCardPot([])
            }, 1000)
        }
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
            if(highestTrumpCard.player === 1) {
                setPlayerOneScore(playerOneScore + 1)
                setActivePlayer(1)
            }
            if(highestTrumpCard.player === 2) {
                setPlayerTwoScore(playerTwoScore + 1) 
                setActivePlayer(2)
            }
            if(highestTrumpCard.player === 3) {
                setPlayerThreeScore(playerThreeScore + 1) 
                setActivePlayer(3)
            }
            if(highestTrumpCard.player === 4) {
                setPlayerFourScore(playerFourScore + 1) 
                setActivePlayer(4)
            }
            if(highestTrumpCard.player === 5) {
                setPlayerFiveScore(playerFiveScore + 1) 
                setActivePlayer(5)
            }
        } else {

            if(highestSuitCard.player === 1) {
                setPlayerOneScore(playerOneScore + 1)
                setActivePlayer(1)
            }
            if(highestSuitCard.player === 2) {
                setPlayerTwoScore(playerTwoScore + 1)
                setActivePlayer(2)
            }
            if(highestSuitCard.player === 3) {
                setPlayerThreeScore(playerThreeScore + 1)
                setActivePlayer(3)
            }
            if(highestSuitCard.player === 4) {
                setPlayerFourScore(playerFourScore + 1)
                setActivePlayer(4)
            }
            if(highestSuitCard.player === 5) {
                setPlayerFiveScore(playerFiveScore + 1)
                setActivePlayer(5)
            }
        }
        setCurrentHandNumber(currentHandNumber + 1)
    }

    const displayCards = (hand, playerNumber) => {
            const cardImages = hand.map((card, index) => <img onClick={() => handleSelectCard(card, index, hand)} className={imageSize} src={card.image} alt={card.code} />);
            return <div className="whist-player-hand">{cardImages}</div>;
    }

    const displayPotCards = (hand, playerNumber) => {
            const cardImages = hand.map((card, index) => <img className={imageSize} src={card.image} alt={card.code} />);
            return <div className="whist-player-hand">{cardImages}</div>;
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
            <p>Active Player: {activePlayer}  Trump Suit: {trumpSuits[currentRound - 1]} Round: {currentRound}</p>
            <p>Player One: {playerOneScore}</p>
            <p>Player Two: {playerTwoScore}</p>
            <p>Player Three: {playerThreeScore}</p>
            <p>Player Four: {playerFourScore}</p>
            <p>Player Five: {playerFiveScore}</p>
            {displayPotCards(cardPot)}
            {displayCards(playerOneHand)}
            {displayCards(playerTwoHand)}
            {displayCards(playerThreeHand)}
            {displayCards(playerFourHand)}
            {displayCards(playerFiveHand)}




        </div>
    )
}
export default NominationWhist