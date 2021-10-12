import React from 'react';
import './WhistResultsModal.css';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const WhistResultsModal = (  { 
    whistModalIsOpen, setWhistModalIsOpen, totalScores }  ) => {

        const handleClose = () => {
            setWhistModalIsOpen(false)
        }

        const determineWinner = () => {
            let winner
            let highestScore = 0 
            Object.entries(totalScores).forEach(player => {
                if(player[1] > highestScore){
                    winner = player[0]
                    highestScore = player[1]
                }else if(player[1] === highestScore) {
                    winner += (" and " + player[0] + " with " + highestScore) 
                    console.log("player[1]:", player[0])
                }
            })
            return winner
        }

    return(
        <Modal className="whist-results-modal" overlayClassName="whist-overlay" isOpen={whistModalIsOpen} appElement={document.getElementById('root')}>
            <p>The Winner of the game is: {determineWinner()} {totalScores[determineWinner()]}</p>
        <button className="close-button" onClick={() => handleClose() }>Close</button>
        </Modal>
    )
}

export default WhistResultsModal;