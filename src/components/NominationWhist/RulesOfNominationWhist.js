import React from 'react';
import './WhistResultsModal.css'
import Modal from 'react-modal'

const RulesOfNominationWhist = ({ whistRulesModalIsOpen, setWhistRulesModalIsOpen }) => {

    const handleCloseModal = () => {
            setWhistRulesModalIsOpen(false)
        
        }

    return(
        <Modal className="whist-results-modal" overlayClassName="whist-overlay" isOpen={whistRulesModalIsOpen} appElement={document.getElementById("root")}>
            <div>
                <p>Rules of Nomination Whist</p>
                <ol>
                    <li>Starting player is picked at random to begin with and moves on automatically every round from there.</li>
                    <li>Players initially receive 10 cards and each round there is one less card dealt till only one card is dealt in the final round.</li>
                    <li>Each round players have to predict how many tricks (hands) they will win, and if they predict correctly they earn 10 extra points.</li>
                    <li>Players also earn 1 point for each trick they win irrespective of predictions.</li>
                    <li>Trump suits change every round in alphabetical order ie Clubs, Diamonds, Hearts and Spades then NO TRUMP in the fifth round, and then the order is repeated until NO TRUMP in the last round.</li>
                    
                    <li>Only trick predictions for the <b><u>last player</u></b> within each round are limited ie the total predictions cannot add up to the total number of cards in that round.</li>
                    
                    <li>The first player in each hand chooses the selected suit for that hand.</li>
                    <li>If a player has the selected suit in their hand they must play the selected suit otherwise they can play any suit.</li>
                    <li>Highest selected suit played wins the hand unless a player trumps the selected suit in which case the highest trump card played wins the hand.</li>
                    <li>If a player wins a hand they go first in the next hand unless it was the last hand in the round.</li>
                    <li>Winner is the player with the most points after round 10.</li>
                    
                </ol>
            <button className="close-button" onClick={() => handleCloseModal()}>Close</button>
            </div>
        </Modal>
    )
}

export default RulesOfNominationWhist;