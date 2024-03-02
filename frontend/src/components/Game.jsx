import React from 'react';
import VideoGame from "./VideoGame"

const Game = () => {
  return (

    <div className="flex justify-center items-center h-screen">
      <div className="border-2 border-gray-300 shadow-xl rounded-lg p-20 md:p-32 bg-white h-4/5 w-full max-w-6xl mx-4 md:mx-8 my-8 flex flex-col justify-center items-center">

        <h1 className="text-4xl font-bold text-center my-8">
        Play <span className="text-green-500">ZKSnake</span>
        </h1>

        <div className="flex justify-center items-center">
          <VideoGame snakeArr={[[0, 1], [0, 2], [0, 3], [1, 3]]}/>
        </div>
      </div>
    </div>
  )
}

export default Game;