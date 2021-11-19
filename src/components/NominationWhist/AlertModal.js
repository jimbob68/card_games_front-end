import React from 'react';
import './WhistResultsModal.css';
import Modal from 'react-modal';

const AlertModal = (  { 
    whistAlertModalIsOpen, setWhistAlertModalIsOpen, error }  ) => {

 return(
        <Modal className="whist-results-modal" overlayClassName="whist-overlay" isOpen={whistAlertModalIsOpen} appElement={document.getElementById('root')}>
            <p>{error}</p>
        <button className="close-button" onClick={() => setWhistAlertModalIsOpen(false) }>Close</button>
        </Modal>
    )
}

export default AlertModal;