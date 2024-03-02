import React from "react";

const VideoGame = ({ snakeArr = [], food = [0, 0] }) => {
  // this checks if a square's coordinates are found in snakeArr
  // snakeArr is structed like this: [[0, 1], [0, 2], [0, 3], [1, 3]]
  const isSnakeSquare = (x, y) => {
    return snakeArr.some((square) => square.x === x && square.y === y);
  };

  // The 10x10 grid
  const grid = Array.from({ length: 10 }, (_, y) => (
    <div key={y} className="flex">
      {Array.from({ length: 10 }, (_, x) => (
        <div
          key={`${x},${y}`}
          className={`w-14 h-14 inline-flex justify-center items-center ${isSnakeSquare(x, y) ? "bg-green-500" : x == food.x && y == food.y ? "bg-red-500" : "bg-transparent"} border border-gray-300`}
        ></div>
      ))}
    </div>
  ));

  return <div className="w-full h-full">{grid}</div>;
};

export default VideoGame;
