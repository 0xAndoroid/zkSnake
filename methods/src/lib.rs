// Copyright 2023 RISC Zero, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//! Generated crate containing the image ID and ELF binary of the build guest.
include!(concat!(env!("OUT_DIR"), "/methods.rs"));

#[cfg(test)]
mod tests {
    use ethabi::{ParamType, Token, Uint};
    use risc0_zkvm::{default_executor, ExecutorEnv};

    #[test]
    fn test_score_one() {
        let input: Vec<u8> = vec![0, 0, 0, 0, 3, 3, 3, 3, 3];

        let env = ExecutorEnv::builder()
            .write_slice(&ethabi::encode(&[
                Token::Address(
                    "0x930235f1Ce11d17f569313Da5452527780C3327F"
                        .parse()
                        .unwrap(),
                ),
                Token::Bytes(input),
            ]))
            .build()
            .unwrap();

        let session_info = default_executor().execute(env, super::SNAKE_ELF).unwrap();

        let output = ethabi::decode(
            &[
                ParamType::Address,
                ParamType::Uint(256),
                ParamType::Uint(256),
            ],
            &session_info.journal.bytes,
        )
        .unwrap();

        assert_eq!(output[1].clone().into_uint().unwrap(), Uint::from(1));
    }
}
