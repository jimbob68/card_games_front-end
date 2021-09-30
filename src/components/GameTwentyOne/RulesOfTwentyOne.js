import React from 'react';
import './ResultsModal.css'
import Modal from 'react-modal'

const RulesOfTwentyOne = ({ rulesModalIsOpen, setRulesModalIsOpen }) => {

    const handleCloseModal = () => {
            setRulesModalIsOpen(false)
        
        }

    return(
        <Modal className="twenty-one-results-modal" overlayClassName="twenty-one-overlay" isOpen={rulesModalIsOpen} appElement={document.getElementById("root")}>
            <div>
                <p>Rules of Twenty-One</p>
                <ol>
                    <li>All players are playing against the dealer and NOT each other.</li>
                    <li>Every hand each player is charged £5 initially.</li>
                    <li>After seeing cards players can bet up to an additional £10.</li>
                    <li>Players can only make an initial bet no further betting is permitted.</li>
                    <li>If a player has two cards the same ie two Jacks, then they can opt to split them. If the player does split the hand their total bets are doubled</li>
                    <li>If a player beats the dealer they receive double their bet. </li>
                    <li>If a player draws with the dealer they get their money back.</li>
                    <li>This game uses eight decks shuffled together which is why you may see the same card drawn repeatedly from time to time.</li>
                    <li>Please gamble responsibly, when the fun stops stop!</li>
                </ol>
            <button className="close-button" onClick={() => handleCloseModal()}>Close</button>
            </div>
        </Modal>
    )
}

export default RulesOfTwentyOne;