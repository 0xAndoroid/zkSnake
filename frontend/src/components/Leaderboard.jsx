import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ZKSNAKE_ABI } from "../assets/zksnake_abi";
import NFTCard from "./NFTCard";
import { CONTRACT_ADDRESS } from "../assets/contract";

const Leaderboard = () => {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getNFTs = async () => {
    let i = 0;
    let collection = [];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ZKSNAKE_ABI,
      provider,
    );
    setIsLoading(true);

    while (i < 10) {
      const tokenID = await contract.topScores(i);

      if (tokenID._hex === "0x00") {
        break;
      }

      const tokenLink = await contract.tokenURI(tokenID._hex);
      const base64EncodedJSON = tokenLink.split(",")[1];
      const decodedJSONString = atob(base64EncodedJSON);
      const token = JSON.parse(decodedJSONString);

      const tokenIdDecimal = parseInt(tokenID._hex, 16);

      token.Place = i + 1; // Since i starts from 0
      token.tokenID = tokenIdDecimal; // Converted tokenID from hex to base 10

      collection.push(token);

      i += 1;
    }
    setIsLoading(false);
    setNFTs(collection);
  };

  useEffect(() => {
    getNFTs();
  }, []);
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">
        The Top 10 <span className="text-[green]">ZKSnake Scores</span>
      </h1>

      {isLoading ? (
        <p className="text-center">Loading NFTs...</p>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {nfts.map((token) => (
            <NFTCard key={token.tokenID} nft={token} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
