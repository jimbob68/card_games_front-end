import React, { useState, useEffect } from 'react'
import './SetUpPage.css'
import io from "socket.io-client"
import PlayersList from "./PlayersList.js"
import NominationWhist from './NominationWhist.js'


let socket

const SetUpPage = ({ setCurrentGame, currentGame, setName, setRoom, name, room, players, setPlayers }) => {

    
    const [ joined, setJoined ] = useState(false)
    const [ startGame, setStartGame ] = useState(false)
    const [ numberOfComputerPlayers, setNumberOfComputerPlayers ] = useState(0)
    const ENDPOINT = "localhost:5000"

    const computerPlayers = [
        {name: "bobby", room, isComputer: true, computerId: 1},
        {name: "nobby", room, isComputer: true, computerId: 2},
        {name: "toby", room, isComputer: true, computerId: 3},
        {name: "robby", room, isComputer: true, computerId: 4}
]    

    useEffect(() => {
        if(joined){
            socket.on("handle-start-game", () => setStartGame(true))
        }
        return () => {
            if(joined){socket.disconnect()}
        }
    }, [ENDPOINT, name, room, joined])

    const handleJoinRoom = () => {
        socket = io(ENDPOINT, {
            transports: ["websocket"]
        })
        setJoined(true)
        socket.emit("join-room", { name, room, isComputer: false }, () => {
        })
    }

    const handleStartGame = () => {
        socket.emit("start-game", {room: room}, () => {})
    }

    const handleAddComputerPlayer = () => {
        if(players.length < 5){
            socket.emit("join-room", computerPlayers[numberOfComputerPlayers], () => {

            })
            setNumberOfComputerPlayers(numberOfComputerPlayers + 1)
        }
    }

    

    return(
        <div>
            { !startGame  && <div><p>Set Up Page</p>

            <input type="text" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)}/>
            
            <input type="text" placeholder="Room" value={room} onChange={(event) => setRoom(event.target.value)}/>

            <button className="menu-button" onClick={() => handleJoinRoom()}>Join Room</button>

            <button className="menu-button" onClick={() => handleAddComputerPlayer()}>Play Computer</button>
            {joined && <PlayersList socket={socket} players={players} setPlayers={setPlayers} setStartGame={setStartGame}/>}

            <button onClick={() => handleStartGame()}>Start Game</button>
            </div>}

            {startGame && <NominationWhist  setCurrentGame={setCurrentGame} players={players} setPlayers={setPlayers} socket={socket} room={room}  />}

        </div>
    )
}
export default SetUpPage;