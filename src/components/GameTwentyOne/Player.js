import React from 'react';
import './Player.css';

const Player = ({
	hand,
	calculateScore,
	playerNumber,
	computerTurn,
	handleSplit,
	playerNumberTurn,
	splitHand,
	handleTwist,
	handleStick,
	handlePlaceBet,
	areButtonsDisabled,
	playerWallet,
	playerBet,
	imageSize
}) => {



	const displayCards = (hand, playerNumber) => {
		const cardImages = hand.map((card) => <img className={imageSize} src={card.image} alt={card.code} />);

		if (hand.length === 2 && hand[0].value === hand[1].value && playerNumberTurn === playerNumber && splitHand.length === 0) {
			cardImages.push(<button className="twist-stick-button" disabled={ areButtonsDisabled }onClick={() => handleSplit(playerNumberTurn)}>Split</button>);
		}
		if (splitHand.length > 0) {
			cardImages.push( displayButtons() )
			cardImages.push(<p id={playerNumber + 0.5}>first split hand score: {calculateScore(hand, false)}</p>);
			splitHand.forEach((card) => {
				cardImages.push(<img className={imageSize} src={card.image} alt={card.code} />);
			});
			cardImages.push(<p>second split hand score: {calculateScore(splitHand, false)}</p>);
			if( playerNumberTurn % 1 !== 0 ){
				cardImages.splice(hand.length, 1)
			}
		}
		// else if (playerNumber === 2 && playerTwoSplitHand.length > 0) {
		// 	cardImages.push(<p>first split hand score:{calculateScore(playerTwoHand, false)}</p>);
		// 	playerTwoSplitHand.forEach((card) => {
		// 		cardImages.push(<img src={card.image} alt={card.code} />);
		// 	});
		// 	cardImages.push(<p>second split hand score:{calculateScore(playerTwoSplitHand, false)}</p>);
		// } else if (playerNumber === 3 && playerThreeSplitHand.length > 0) {
		// 	cardImages.push(<p>first split hand score:{calculateScore(playerThreeHand, false)}</p>);
		// 	playerThreeSplitHand.forEach((card) => {
		// 		cardImages.push(<img src={card.image} alt={card.code} />);
		// 	});
		// 	cardImages.push(<p>second split hand score:{calculateScore(playerThreeSplitHand, false)}</p>);
		// } else if (playerNumber === 4 && playerFourSplitHand.length > 0) {
		// 	cardImages.push(<p>first split hand score:{calculateScore(playerFourHand, false)}</p>);
		// 	playerFourSplitHand.forEach((card) => {
		// 		cardImages.push(<img src={card.image} alt={card.code} />);
		// 	});
		// 	cardImages.push(<p>second split hand score:{calculateScore(playerFourSplitHand, false)}</p>);
		// }
		return <div className="player-hand">{cardImages}</div>;
	};

	const displayButtons = () => {
		return( 
		<>
		{  hand.length > 0 &&
			(playerNumber === playerNumberTurn || playerNumber + 0.5 === playerNumberTurn) && 
			<div>
		
				<select id="bet-dropdown" disabled={ !areButtonsDisabled } onChange={(event) => handlePlaceBet(parseInt(event.target.value))}>
					<option>Place your bet!</option>
					<option value={0}>0</option>
					<option value={1}>1</option>
					<option value={2}>2</option>
					<option value={3}>3</option>
					<option value={4}>4</option>
					<option value={5}>5</option>
					<option value={6}>6</option>
					<option value={7}>7</option>
					<option value={8}>8</option>
					<option value={9}>9</option>
					<option value={10}>10</option>
				</select>
			
				<button className="twist-stick-button" disabled={ areButtonsDisabled } onClick={() => handleTwist(playerNumberTurn)}>Twist</button>
			
				<button className="twist-stick-button" disabled={ areButtonsDisabled } onClick={() => handleStick()}>Stick</button>
			</div> } 
			</>
			)			
	};

	return (
		<div 
		// className="player-container" id={playerNumber}
		id={playerNumber} className={(Math.floor(playerNumberTurn) === playerNumber && hand.length > 1) ? "active-player" : "player-container"}
		>
			<p>Player { playerNumber } - Wallet: £{ playerWallet } - Bet: £{ playerBet }</p>
			{displayCards(hand, playerNumber)}
			{ (splitHand.length === 0 || (splitHand.length > 0 && playerNumberTurn % 1 === 0.5)) && displayButtons() }

			{/* {hand.length > 0 &&
			(playerNumber === playerNumberTurn || playerNumber + 0.5 === playerNumberTurn) && (
				<select id="bet-dropdown" disabled={ !areButtonsDisabled } onChange={(event) => handlePlaceBet(parseInt(event.target.value))}>
					<option>Place your bet!</option>
					<option value={0}>0</option>
					<option value={1}>1</option>
					<option value={2}>2</option>
					<option value={3}>3</option>
					<option value={4}>4</option>
					<option value={5}>5</option>
					<option value={6}>6</option>
					<option value={7}>7</option>
					<option value={8}>8</option>
					<option value={9}>9</option>
					<option value={10}>10</option>
				</select>
			)}
			{hand.length > 0 && (playerNumber === playerNumberTurn || playerNumber + 0.5 === playerNumberTurn) ? (
				<button disabled={ areButtonsDisabled } onClick={() => handleTwist(playerNumberTurn)}>Twist</button>
			) : null}
			{hand.length > 0 && (playerNumber === playerNumberTurn || playerNumber + 0.5 === playerNumberTurn) ? (
				<button disabled={ areButtonsDisabled } onClick={() => handleStick()}>Stick</button>
			) : null} */}
			{splitHand.length === 0 && <p>Score: {calculateScore(hand, computerTurn)}</p>}
		</div>
	);
};



export default Player;
