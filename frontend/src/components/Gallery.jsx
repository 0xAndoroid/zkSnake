import { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFTCard from "./NFTCard";
import { CONTRACT_ADDRESS } from "../assets/contract";

const Gallery = (props) => {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [finished, setFinished] = useState(false);

  const loadMoreItems = () => {
    setPage((prevPage) => prevPage + 1);
  };

  //function to fetch nfts by collection
  const fetchCollection = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://wider-powerful-fog.ethereum-sepolia.quiknode.pro/ff66a7f93b85f72214a4d0344a8eb2d6305be1ca/",
      );

      const collection = await provider.send("qn_fetchNFTsByCollection", [
        {
          collection: CONTRACT_ADDRESS,
          page: page,
          perPage: 10,
        },
      ]);
      // console.log(collection)

      if (collection.tokens.length == 0) {
        setFinished(true);
        setIsLoading(false);
        return;
      }

      setNFTs(nfts.concat(collection.tokens));
      setIsLoading(false);

      return collection;
    } catch (error) {
      setIsLoading(false);

      console.error("Error fetching collection:", error);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [page]);

  return (
    <div className="container mx-auto mb-8">
      <h1 className="text-4xl font-bold text-center my-8">
        Explore <span className="text-[green]">ZKSnake NFTs</span>
      </h1>
      {!isLoading && nfts.length === 0 && (
        <h1 className="text-5xl text-center mx-auto mt-32">
          No Collection Found
        </h1>
      )}
      <div className="grid grid-cols-5 gap-4">
        {nfts.map((token) => (
          <NFTCard key={token.name} nft={token} />
        ))}
      </div>
      {isLoading && <p className="text-center">Loading more NFTs...</p>}
      {finished && (
        <p className="text-center">You've reached the end of the collection.</p>
      )}

      {!finished && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreItems}
            className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-600 transition duration-300"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
