import React from 'react';

const Game = () => {
  return (
    // This container centers the game frame within the viewport.
    <div className="flex justify-center items-center h-screen">
      {/* // The game frame takes up more space and is still centered. */}
      <div className="border-2 border-gray-300 shadow-xl rounded-lg p-20 md:p-32 bg-white h-4/5 w-full max-w-6xl mx-4 md:mx-8 my-8">

        {/* Put the game stuff in here */}
        <div>🐍🐍🐍</div>
      </div>
    </div>
  )
}

export default Game;
