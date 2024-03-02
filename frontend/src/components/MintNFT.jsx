import React from "react";
import { ZKSNAKE_ABI } from "../assets/zksnake_abi";
import { ethers } from "ethers";
import confetti from "canvas-confetti";
import { CONTRACT_ADDRESS } from "../assets/contract";

const MintNFT = ({ gameplay = [] }) => {
  const mint = async (gameplay) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ZKSNAKE_ABI,
        signer,
      );

      console.log(gameplay);
      console.log(new Uint8Array(gameplay));

      // Call the submitScore function on your contract
      const transactionResponse = await contract.submitScore(
        new Uint8Array(gameplay),
      );

      // Wait for the transaction to be mined
      const receipt = await transactionResponse.wait();

      // Transaction was successful
      console.log("Score submitted! Transaction receipt:", receipt);
      throwConfetti();
    } catch (error) {
      alert("Something went wrong!");
      console.error("Error submitting score to contract:", error);
    }
  };

  const throwConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <button
      onClick={() => {
        mint(gameplay);
      }}
      className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-600 transition duration-300"
    >
      Mint!
    </button>
  );
};

export default MintNFT;
