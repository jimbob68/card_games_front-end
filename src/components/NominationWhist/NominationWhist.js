import React, { useEffect, useState } from 'react'
import './NominationWhist.css'
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
		
        if(players[0].id === socket.id)fetchCards()
        socket.on("hand", ({hand}) => {
            setPlayerOneHand(hand)
        })
        socket.on("set-next-player", ({nextPlayer}) => {
            // if(activePlayer !== nextPlayer) {
                setActivePlayer(nextPlayer)
            // }
            console.log("next player = " + nextPlayer + "--- activePlayer = " + activePlayer)
        })
        socket.on("set-card-pot", ({pot}) => {
            setCardPot(pot)
        })
		
	}, []);

    useEffect(() => {
        handleDealCards(1)
    }, [deckOfCards])

    useEffect(() => {
        if(cardPot.length === numberOfPlayers){
            handleEndHand()
        }
    }, [cardPot])

    // useEffect(() => {
    //     // if (socket.id === players[activePlayer - 1].id) {
    //         socket.emit("get-next-player", {activePlayer, room})
    //     // }
    // }, [activePlayer])

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
        if(currentRound === 0) setCurrentRound(1)
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
    //         fetchCards()
    //         const currentRoundVariable = currentRound 
    //         setCurrentHandNumber(1)
    //         setTimeout(() => {
    //             setCurrentRound(currentRoundVariable + 1)
    //             handleDealCards(currentRoundVariable + 1)
    //             setCardPot([])
    //         }, 1000)
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
            if(highestTrumpCard.player === 1) {
                setPlayerOneScore(playerOneScore + 1)
                // setActivePlayer(1)
                socket.emit("get-next-player", {activePlayer: 1, room})

                console.log("1")
            }
            if(highestTrumpCard.player === 2) {
                setPlayerTwoScore(playerTwoScore + 1) 
                // setActivePlayer(2)
                socket.emit("get-next-player", {activePlayer: 2, room})

                console.log("2")
            }
            if(highestTrumpCard.player === 3) {
                setPlayerThreeScore(playerThreeScore + 1) 
                // setActivePlayer(3)
                socket.emit("get-next-player", {activePlayer: 3, room})

                console.log("3")
            }
            if(highestTrumpCard.player === 4) {
                setPlayerFourScore(playerFourScore + 1) 
                // setActivePlayer(4)
                socket.emit("get-next-player", {activePlayer: 4, room})

                console.log("4")
            }
            if(highestTrumpCard.player === 5) {
                setPlayerFiveScore(playerFiveScore + 1) 
                // setActivePlayer(5)
                socket.emit("get-next-player", {activePlayer: 5, room})

                console.log("5")
            }
        } else {

            if(highestSuitCard.player === 1) {
                setPlayerOneScore(playerOneScore + 1)
                socket.emit("get-next-player", {activePlayer: 1, room})
                // setActivePlayer(1)
                console.log("6")
            }
            if(highestSuitCard.player === 2) {
                setPlayerTwoScore(playerTwoScore + 1)
                socket.emit("get-next-player", {activePlayer: 2, room})
                // setActivePlayer(2)
                console.log("7")
            }
            if(highestSuitCard.player === 3) {
                setPlayerThreeScore(playerThreeScore + 1)
                socket.emit("get-next-player", {activePlayer: 3, room})
                // setActivePlayer(3)
                console.log("8")
            }
            if(highestSuitCard.player === 4) {
                setPlayerFourScore(playerFourScore + 1)
                socket.emit("get-next-player", {activePlayer: 4, room})
                // setActivePlayer(4)
                console.log("9")
            }
            if(highestSuitCard.player === 5) {
                setPlayerFiveScore(playerFiveScore + 1)
                socket.emit("get-next-player", {activePlayer: 5, room})
                // setActivePlayer(5)
                console.log("10")
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

    const getPlayerName = () => {
        const player = players.find(player => player.id === socket.id) 
        return player.name   
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
            <p>Active Player: {players[activePlayer - 1].name}  Trump Suit: {trumpSuits[currentRound - 1]} Round: {currentRound}</p>
            {players[0] && <p>{players[0].name}: {playerOneScore}</p>}
            {players[1] && <p>{players[1].name}: {playerTwoScore}</p>}
            {players[2] && <p>{players[2].name}: {playerThreeScore}</p>}
            {players[3] && <p>{players[3].name}: {playerFourScore}</p>}
            {players[4] && <p>{players[4].name}: {playerFiveScore}</p>}
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