import React, { useEffect, useState } from 'react';
import './WhistResultsModal.css';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const WhistResultsModal = (  { 
    whistModalIsOpen, setWhistModalIsOpen, totalScores, setCurrentRound, createPlayerScores, setGameScores, gameScores }  ) => {

    const [ winnersStatement, setWinnersStatement ] = useState("")
    const [ winnersArray, setWinnersArray ] = useState([])

    useEffect(() => {
        determineWinner()
    }, [totalScores])

        const handleClose = () => {

            let localGameScores = {...gameScores}
            winnersArray.forEach((winner, index) => {
                localGameScores[winner[0]] += 1 
            })
            setGameScores({...localGameScores})
            setWhistModalIsOpen(false)
            setCurrentRound(1)
            createPlayerScores()
        }

        const determineWinner = () => {
            let announceWinner = "The winner of the game is "
            let winners = [[0, 0]]
            let highestScore = 0 
            Object.entries(totalScores).forEach(player => {
                if(player[1] > highestScore){
                    // winner = player[0]
                    highestScore = player[1]
                    winners = [player]
                }else if(player[1] === highestScore) {
                    // winner += (" and " + player[0] + " with " + highestScore) 
                    // console.log("player[1]:", player[0])
                    winners.push(player)
                }
            })
            console.log("winners", winners)
            winners.forEach((winner, index) => {
                if(index === 0) {
                    announceWinner += winner[0]
                } else {
                    announceWinner += " and " + winner[0]
                }
            })
            setWinnersArray(winners)
            announceWinner += " with " + winners[0][1]
            setWinnersStatement(announceWinner)
        }

        const displayScores = () => {
            const playersFinalScores = []
            Object.entries(totalScores).forEach(player => {
                playersFinalScores.push(<p>{player[0]} Scored {player[1]}</p>)
            })
            return playersFinalScores
        }

    return(
        <Modal className="whist-results-modal" overlayClassName="whist-overlay" isOpen={whistModalIsOpen} appElement={document.getElementById('root')}>
            <p>{winnersStatement}</p>
            {displayScores()}
        <button className="close-button" onClick={() => handleClose() }>Close</button>
        </Modal>
    )
}

export default WhistResultsModal;