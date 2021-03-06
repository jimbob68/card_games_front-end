import React, { useEffect } from 'react'


const PlayersList = ({ socket, setPlayers, players, setStartGame }) => {

    useEffect(() => {
        console.log("socket:", socket)
        socket.on("players-list", ({playersList}) => {
            setPlayers(playersList)
            console.log("playersList:", playersList)
        })
    }, [])

    const getPlayerNames = () => {
       return players.map(player => <p>{player.name}</p>)
    }

    return (

        <div>
            <h3>Players waiting in room...</h3>
            <h3>{getPlayerNames()}</h3>
        </div>
    )

}

export default PlayersList