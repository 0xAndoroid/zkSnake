//src/components/NFTCard.js
import React from "react";

//component that takes an nft object and maps it to corresponding elements
const NFTCard = ({ nft }) => {
  const placeCalculator = (rank) => {
    if (rank == 1) {
      return "🥇";
    } else if (rank == 2) {
      return "🥈";
    } else if (rank == 3) {
      return "🥉";
    } else {
      return rank;
    }
  };
  return (
    <div className="max-w-lg rounded overflow-hidden shadow-lg">
      <img src={nft.imageUrl || nft.image} alt="" className="w-full" />
      <div className="px-4 py-4">
        {/* <div className='font-bold text-teal-600 text-xl mb-2'>{nft.name}</div> */}
        <a
          href={`https://testnets.opensea.io/assets/sepolia/0x1545911c6707b47a5890e95b4aecb0c8264ca0c3/${nft.collectionTokenId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-teal-600 text-xl mb-2 hover:text-teal-800 hover:underline cursor-pointer"
        >
          {nft.name}
        </a>
        <ul>
          <li>
            Collection Name: <strong>{nft.collectionName || "zkSnake"}</strong>
          </li>
          <li>
            Token ID: <strong>{nft.collectionTokenId || nft.tokenID}</strong>
          </li>
          {nft.Place && (
            <li>
              Place: <strong>{placeCalculator(nft.Place)}</strong>
            </li>
          )}
        </ul>
      </div>
      <div className="px-6 py-4">
        {nft.traits?.map((trait, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200
                 rounded-full px-3 py-2 text-sm font-semibold text-gray-700 mr-2"
          >
            {trait["trait_type"]}:{trait.value}
          </span>
        ))}
        <div></div>
      </div>
    </div>
  );
};

export default NFTCard;
