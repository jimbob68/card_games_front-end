import React from 'react';
import './SnapEndGameModal.css'

import Modal from 'react-modal';

const SnapEndGameModal = ({ endGameModalIsOpen, setEndGameModalIsOpen, handleContinueGame, handleResetGame, playerScore, computerScore }) => {

    return(
        
        <Modal className="snap-end-game-modal snap-modal" overlayClassName="snap-overlay" isOpen={endGameModalIsOpen} appElement={document.getElementById('root')}>
                
                <p>Player Score: {playerScore}</p>
                <p>Computer Score: {computerScore}</p>
                <div className="snap-modal-buttons-container">
                    <button className="snap-modal-button"onClick={() => handleContinueGame()}>Continue Current Game</button>
                    <br/>
                    <button className="snap-modal-button" onClick={() => handleResetGame()}>Start New Game</button>
                </div>
                </Modal>
    )

}
export default SnapEndGameModal;