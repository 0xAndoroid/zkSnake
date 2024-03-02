#![allow(clippy::unwrap_used)]
#![no_main]

use std::io::Read;

use ethabi::{ethereum_types::U256, ParamType, Token, Uint};
use risc0_zkvm::guest::env;

risc0_zkvm::guest::entry!(main);

#[derive(Clone, Copy)]
struct Position {
    x: u8,
    y: u8,
}

fn main() {
    let mut input_bytes = Vec::<u8>::new();
    env::stdin().read_to_end(&mut input_bytes).unwrap();
    // Type array passed to `ethabi::decode_whole` should match the types encoded in
    // the application contract.
    let input = ethabi::decode(&[ParamType::Address, ParamType::Bytes], &input_bytes).unwrap();
    let address = input[0].clone().into_address().unwrap();
    let input = input[1].clone().into_bytes().unwrap();

    let mut score = U256::zero();
    let mut tick = U256::zero();
    let mut prev_direction = 4;
    let mut foods: Vec<Position> = vec![
        Position { x: 4, y: 1 },
        Position { x: 9, y: 7 },
        Position { x: 2, y: 8 },
        Position { x: 9, y: 9 },
        Position { x: 1, y: 1 },
        Position { x: 8, y: 4 },
        Position { x: 2, y: 7 },
        Position { x: 3, y: 4 },
        Position { x: 3, y: 9 },
        Position { x: 3, y: 0 },
        Position { x: 5, y: 9 },
        Position { x: 4, y: 3 },
        Position { x: 0, y: 2 },
        Position { x: 1, y: 4 },
        Position { x: 4, y: 2 },
        Position { x: 1, y: 0 },
        Position { x: 6, y: 8 },
        Position { x: 5, y: 8 },
        Position { x: 8, y: 2 },
        Position { x: 2, y: 3 },
        Position { x: 5, y: 2 },
        Position { x: 7, y: 3 },
        Position { x: 5, y: 0 },
        Position { x: 4, y: 8 },
        Position { x: 5, y: 5 },
        Position { x: 7, y: 1 },
        Position { x: 1, y: 2 },
        Position { x: 0, y: 8 },
        Position { x: 6, y: 2 },
        Position { x: 3, y: 6 },
        Position { x: 9, y: 5 },
        Position { x: 1, y: 6 },
        Position { x: 2, y: 5 },
        Position { x: 8, y: 6 },
        Position { x: 9, y: 4 },
        Position { x: 2, y: 6 },
        Position { x: 4, y: 9 },
        Position { x: 4, y: 7 },
        Position { x: 9, y: 3 },
        Position { x: 2, y: 4 },
        Position { x: 3, y: 3 },
        Position { x: 0, y: 4 },
        Position { x: 0, y: 3 },
        Position { x: 8, y: 3 },
        Position { x: 8, y: 1 },
        Position { x: 3, y: 7 },
        Position { x: 2, y: 0 },
        Position { x: 8, y: 8 },
        Position { x: 3, y: 5 },
        Position { x: 5, y: 7 },
        Position { x: 8, y: 9 },
        Position { x: 5, y: 3 },
        Position { x: 9, y: 2 },
        Position { x: 2, y: 2 },
        Position { x: 7, y: 4 },
        Position { x: 7, y: 0 },
        Position { x: 7, y: 7 },
        Position { x: 0, y: 6 },
        Position { x: 7, y: 8 },
        Position { x: 5, y: 1 },
        Position { x: 8, y: 7 },
        Position { x: 6, y: 9 },
        Position { x: 9, y: 1 },
        Position { x: 9, y: 6 },
        Position { x: 4, y: 5 },
        Position { x: 0, y: 0 },
        Position { x: 5, y: 6 },
        Position { x: 3, y: 8 },
        Position { x: 7, y: 5 },
        Position { x: 9, y: 0 },
        Position { x: 7, y: 6 },
        Position { x: 1, y: 9 },
        Position { x: 2, y: 9 },
        Position { x: 3, y: 1 },
        Position { x: 6, y: 1 },
        Position { x: 0, y: 5 },
        Position { x: 6, y: 4 },
        Position { x: 0, y: 1 },
        Position { x: 1, y: 5 },
        Position { x: 9, y: 8 },
        Position { x: 6, y: 7 },
        Position { x: 3, y: 2 },
        Position { x: 6, y: 5 },
        Position { x: 7, y: 9 },
        Position { x: 6, y: 0 },
        Position { x: 4, y: 4 },
        Position { x: 1, y: 7 },
        Position { x: 5, y: 4 },
        Position { x: 8, y: 5 },
        Position { x: 0, y: 7 },
        Position { x: 1, y: 8 },
        Position { x: 8, y: 0 },
        Position { x: 1, y: 3 },
        Position { x: 6, y: 6 },
        Position { x: 4, y: 6 },
        Position { x: 6, y: 3 },
        Position { x: 7, y: 2 },
        Position { x: 0, y: 9 },
        Position { x: 4, y: 0 },
        Position { x: 2, y: 1 },
    ];
    let mut snake: Vec<Position> = vec![
        Position { x: 5, y: 5 },
        Position { x: 5, y: 6 },
        Position { x: 5, y: 7 },
        Position { x: 5, y: 8 },
    ];
    // let mut tail = snake[snake.len() - 1]; // after snake moves, this becomes its
    // previous tail. if snake eats after moving, we add this piece back.
    println!("Input: {:?}", input);

    for direction in input {
        println!("Direction: {:?}", direction);
        // skip invalid moves
        if (prev_direction == 0 && direction == 2)
            || (prev_direction == 2 && direction == 0)
            || (prev_direction == 1 && direction == 3)
            || (prev_direction == 3 && direction == 1)
        {
            panic!("Invalid move");
        }

        match direction {
            0 => {
                // up
                if !snake.is_empty() {
                    let head = snake[0];
                    let new_head = Position {
                        x: head.x,
                        y: head.y - 1,
                    };
                    snake.insert(0, new_head);
                    snake.pop().unwrap();
                }
            }
            1 => {
                // right
                if !snake.is_empty() {
                    let head = snake[0];
                    let new_head = Position {
                        x: head.x + 1,
                        y: head.y,
                    };
                    snake.insert(0, new_head);
                    snake.pop().unwrap();
                }
            }
            2 => {
                // down
                if !snake.is_empty() {
                    let head = snake[0];
                    let new_head = Position {
                        x: head.x,
                        y: head.y + 1,
                    };
                    snake.insert(0, new_head);
                    snake.pop().unwrap();
                }
            }
            3 => {
                // left
                if !snake.is_empty() {
                    let head = snake[0];
                    let new_head = Position {
                        x: head.x - 1,
                        y: head.y,
                    };
                    snake.insert(0, new_head);
                    _ = snake.pop().unwrap();
                }
            }
            _ => {
                break;
            }
        }

        // die upon hitting wall
        if snake[0].x > 9 || snake[0].y > 9 {
            break;
        }

        let head = snake[0];
        prev_direction = direction;
        tick += Uint::from(1);

        // check if we ate food
        let food = foods[0];
        if head.x == food.x && head.y == food.y {
            foods.remove(0);
            let tail = snake[snake.len() - 1];
            snake.push(tail);
            score += Uint::from(1);
        }
    }

    // Commit the journal that will be received by the application contract.
    // Encoded types should match the args expected by the application callback.
    env::commit_slice(&ethabi::encode(&[
        Token::Address(address),
        Token::Uint(score),
        Token::Uint(tick),
    ]));
}
