import React from 'react';
import './SnapEndGameModal.css'
import Modal from 'react-modal'

const RulesOfSnap = ({ snapRulesModalIsOpen, setSnapRulesModalIsOpen }) => {

    const handleCloseModal = () => {
            setSnapRulesModalIsOpen(false)
        
        }

    return(
        <Modal className="snap-modal snap-rules-modal" overlayClassName="snap-overlay" isOpen={snapRulesModalIsOpen} appElement={document.getElementById("root")}>
            <div>
                <p>Rules of Snap</p>
                <ol>
                    <li>Before starting the game, select your card size, the number of decks you wish to play with and the difficulty level.</li>
                    <li>After clicking the Start Game button, the cards will start dealing. </li>
                    <li>If a pair of the same value ie. two Queens is displayed press the snap button as quick as you can.</li>
                    <li>If you press SNAP quicker than the computer you win those cards.</li>
                    <li>If you press SNAP slower than the computer, or press SNAP on a non-pair, the computer wins those cards. </li>
                    <li>The cards are worth one point each and the winner is whoever has most points at the end of the game.</li>
                    <li>Once the chosen amount of decks has been dealt, you can choose to continue the current game with scores intact, or start afresh with a new game.</li>
                </ol>
            <button className="snap-buttons" onClick={() => handleCloseModal()}>Close</button>
            </div>
        </Modal>
    )
}

export default RulesOfSnap;