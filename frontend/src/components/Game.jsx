import React from "react";
import VideoGame from "./VideoGame";
import { useState, useEffect } from "react";
import { food as initialFood } from "../assets/food.js";
import MintNFT from "./MintNFT";

const GRID_SIZE = 10;
const INITIAL_SNAKE = [
  { x: 5, y: 5 },
  { x: 5, y: 6 },
  { x: 5, y: 7 },
  { x: 5, y: 8 },
];

const Game = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState(0); // 0: up, 1: right, 2: down, 3: left
  const [gameplay, setGameplay] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Function to handle keyboard input
  function handleKeyPress(event) {
    const key = event.key;
    setDirection((direction) => {
      if (key === "w" && direction !== 2) return 0;
      else if (key === "d" && direction !== 3) return 1;
      else if (key === "s" && direction !== 0) return 2;
      else if (key === "a" && direction !== 1) return 3; // left
      return direction;
    });
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Function to update snake position
  useEffect(() => {
    const interval = setInterval(() => {
      // Update snake position based on direction
      const head = { ...snake[0] };
      switch (direction) {
        case 0:
          head.y -= 1;
          break;
        case 1:
          head.x += 1;
          break;
        case 2:
          head.y += 1;
          break;
        case 3:
          head.x -= 1;
          break;
        default:
          break;
      }

      // Check collision with walls
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        clearInterval(interval);
        setGameOver(true);
        return;
      }

      // // Check collision with self
      // if (snake.some((pos) => pos.x === head.x && pos.y === head.y)) {
      //   clearInterval(interval);
      //   alert("Game over!");
      //   return;
      // }

      // Check if snake eats food
      if (head.x === food[0].x && head.y === food[0].y) {
        setScore((score) => score + 1);
        setFood(food.slice(1));
      } else {
        snake.pop();
      }

      setSnake([head, ...snake]);
      console.log("Set gameplay");
      setGameplay((gameplay) => gameplay.concat([direction]));
      console.log(gameplay);
    }, 200);

    return () => clearInterval(interval);
  }, [snake, direction, food]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-2 border-gray-300 shadow-xl rounded-lg p-20 md:p-32 bg-white h-4/5 w-full max-w-6xl mx-4 md:mx-8 my-8 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-center mt-8">
          Play <span className="text-green-500">zkSnake</span>
        </h1>
        <h2 className="text-2xl font-bold text-center mb-5">Score: {score}</h2>
        {gameOver ? (
          <div className="flex flex-col">
            <span className="text-5xl font-bold text-center mb-5 text-red-500">
              Game Over
            </span>
            <MintNFT gameplay={gameplay} />
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <VideoGame snakeArr={snake} food={food[0]} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
