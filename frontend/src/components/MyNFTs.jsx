// Import libraries and components
import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import NFTCard from "./NFTCard";
import { ZKSNAKE_ABI } from "../assets/zksnake_abi";
import { CONTRACT_ADDRESS } from "../assets/contract";

const MyNFTs = (props) => {
  // State variables
  const [nfts, setNFTs] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const checkOwnership = async (token) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ZKSNAKE_ABI,
      provider,
    );
    const owner = await contract.ownerOf(token.collectionTokenId);

    return owner.toLowerCase() === props.address.toLowerCase();
  };

  const getMyNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://wider-powerful-fog.ethereum-sepolia.quiknode.pro/ff66a7f93b85f72214a4d0344a8eb2d6305be1ca/",
    );
    let finished = false;
    let pageNum = 1;
    let ownedNFTs = [];

    setIsLoading(true);
    try {
      while (!finished) {
        const collection = await provider.send("qn_fetchNFTsByCollection", [
          {
            collection: CONTRACT_ADDRESS,
            page: pageNum,
            perPage: 10,
          },
        ]);

        if (collection.tokens.length == 0) {
          finished = true;
          break;
        }
        for (const token of collection.tokens) {
          const isOwner = await checkOwnership(token);
          if (isOwner) {
            ownedNFTs.push(token);
          }
        }

        pageNum++;
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching collection:", error);
      setIsLoading(false);
    }
    setNFTs(ownedNFTs);
  };

  useEffect(() => {
    getMyNFTs();
  }, []);

  // JSX containing our conditional rendering
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">
        My <span className="text-[green]">Profile</span>
      </h1>
      {isLoading && <p className="text-center">Loading NFTs...</p>}
      <div className="grid grid-cols-5 gap-4">
        {nfts.map((token) => (
          <NFTCard key={token.collectionTokenId} nft={token} />
        ))}
      </div>
    </div>
  );
};

export default MyNFTs;
