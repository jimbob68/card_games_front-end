import React, {useState} from 'react';
import './App.css';
import GameTwentyOne from './components/GameTwentyOne/GameTwentyOne.js';
import GameSnap from './components/GameSnap/GameSnap.js';
import NominationWhist from "./components/NominationWhist/NominationWhist.js"
import SetUpPage from "./components/NominationWhist/SetUpPage.js"

function App() {

	const [currentGame, setCurrentGame] = useState("");
	const [ name, setName ] = useState("")
	const [ room, setRoom ] = useState("")

	return (
		<div className="App">
			{ currentGame === "" && <div>
				<h1>Card School</h1>
				<button className="menu-button" onClick={() => setCurrentGame("Twenty One")}>Twenty-One</button>
				<button className="menu-button" onClick={() => setCurrentGame("Snap")}>Snap</button>

				<button className="menu-button" onClick={() => setCurrentGame("Whist Options")}>Nomination Whist</button>

			</div>}
			{currentGame === "Twenty One" && <GameTwentyOne setCurrentGame={setCurrentGame} />}

			{currentGame === "Snap" && < GameSnap setCurrentGame={setCurrentGame}/>}

			{currentGame === "Whist Options" && <SetUpPage  setCurrentGame={setCurrentGame} setName={setName} setRoom={setRoom} name={name} room={room}/>}
			{currentGame === "Nomination Whist" && <NominationWhist  setCurrentGame={setCurrentGame}/>}

		</div>
	);
}

export default App;
