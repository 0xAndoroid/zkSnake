#![allow(clippy::unwrap_used)]
#![no_main]

use std::io::Read;

use ethabi::{ethereum_types::U256, ParamType, Token};
use risc0_zkvm::guest::env;

risc0_zkvm::guest::entry!(main);

fn fibonacci(n: U256) -> U256 {
    let (mut prev, mut curr) = (U256::one(), U256::one());
    for _ in 2..=n.as_u32() {
        (prev, curr) = (curr, prev + curr);
    }
    curr
}

fn main() {
    // Read data sent from the application contract.
    let mut input_bytes = Vec::<u8>::new();
    env::stdin().read_to_end(&mut input_bytes).unwrap();
    // Type array passed to `ethabi::decode_whole` should match the types encoded in
    // the application contract.
    let input = ethabi::decode_whole(&[ParamType::Uint(256)], &input_bytes).unwrap();
    let n: U256 = input[0].clone().into_uint().unwrap();

    // Run the computation.
    let result = fibonacci(n);

    // Commit the journal that will be received by the application contract.
    // Encoded types should match the args expected by the application callback.
    env::commit_slice(&ethabi::encode(&[Token::Uint(n), Token::Uint(result)]));
}
