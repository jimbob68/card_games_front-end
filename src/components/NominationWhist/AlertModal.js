import React from 'react';
import './WhistResultsModal.css';
import Modal from 'react-modal';

const AlertModal = (  { 
    whistAlertModalIsOpen, setWhistAlertModalIsOpen, error, setCurrentGame }  ) => {

    const displayHomeButtons = () => {
        if(error === "Are you sure you want to leave, this will end the game for everyone!") {
            return <div>
                <button className="close-button" onClick={() => setCurrentGame("")}>Leave Game</button>
            </div>
        }
    }        

 return(
        <Modal className="whist-results-modal" overlayClassName="whist-overlay" isOpen={whistAlertModalIsOpen} appElement={document.getElementById('root')}>
            <p>{error}</p>
            {displayHomeButtons()}
        <button className="close-button" onClick={() => setWhistAlertModalIsOpen(false) }>Close</button>

        </Modal>
    )
}


export default AlertModal;