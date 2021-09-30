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
                    <li>Before commencing the Player chooses Card Size, Number of Decks and Difficulty Level.</li>
                    <li>After clicking Start Game the cards will start dealing. </li>
                    <li>If a pair of the same value ie. two Queens is displayed press the snap button.</li>
                    <li>If the Player presses snap quicker than the computer they win those cards.</li>
                    <li>If the Player snaps slower than the computer, or snaps for a non-pair the computer wins those cards. </li>
                    <li>The cards are worth one point each and the winner is whomever has most points at the end.</li>
                    <li>Once the chosen amount of decks has been dealt, the Player can choose to continue the current game with scores intact, or start afresh with a new game.</li>
                </ol>
            <button className="snap-buttons" onClick={() => handleCloseModal()}>Close</button>
            </div>
        </Modal>
    )
}

export default RulesOfSnap;