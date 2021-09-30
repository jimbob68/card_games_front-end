import React, { useState, useEffect } from 'react'
import './SetUpPage.css'
import io from "socket.io-client"
import PlayersList from "./PlayersList.js"


let socket

const SetUpPage = ({ setCurrentGame, setName, setRoom, name, room }) => {

    const [ players, setPlayers ] = useState([])
    const [ joined, setJoined ] = useState(false)

    const ENDPOINT = "localhost:5000"

    useEffect(() => {
        
        
        return () => {
            if(joined){socket.disconnect()}
        }
    }, [ENDPOINT, name, room])

    // useEffect(() => {
    //     console.log("socket:", socket)
    //     if(joined){
    //         socket.on("players-list", ({playersList}) => {
    //         setPlayers(playersList)
    //        console.log("playersList:", playersList)
    //         })
    //     }
    // }, [joined])

    const handleJoinRoom = () => {
        socket = io(ENDPOINT, {
            transports: ["websocket"]
        })
        setJoined(true)
        console.log("room:", room)
        socket.emit("join-room", { name, room }, (playersList) => {
            // setPlayers(playersList)
        })
    }

    return(
        <div>
            <p>Set Up Page</p>

            <input type="text" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)}/>
            
            <input type="text" placeholder="Room" value={room} onChange={(event) => setRoom(event.target.value)}/>

            <button className="menu-button" onClick={() => handleJoinRoom()}>Join Room</button>

            <button className="menu-button" onClick={() => setCurrentGame("Nomination Whist")}>Play Computer</button>
            {joined && <PlayersList socket={socket} players={players} setPlayers={setPlayers}/>}
        </div>
    )
}
export default SetUpPage;