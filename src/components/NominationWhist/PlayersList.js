import React, { useEffect } from 'react'


const PlayersList = ({ socket, setPlayers, players, startGame }) => {

    useEffect(() => {
        console.log("socket:", socket)
        console.log("start game1", startGame)
        // if(startGame === false) {
            socket.on("players-list", ({playersList}) => {
                // if(playersList.length > 1){
                    console.log("start game2", startGame)
                    // if(startGame === false) {
                    if(playersList.length > players.length){
                        console.log("playersList:", playersList)
                        console.log("players for comaprison:", players)
                        setPlayers(playersList)
                    }
                // }
            })
        // }
    }, [startGame])

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