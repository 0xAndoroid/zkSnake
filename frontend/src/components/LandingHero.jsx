import React from "react";

// import { ConnectKitButton } from "connectkit";
import "../App.css";

const LandingHero = (props) => {
  //   const { address, isConnecting, isDisconnected } = useAccount();

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold">
            Prove your skill in the{" "}
            <span className="text-[green]">Snake Game</span>.
          </h1>
          <p className="py-6">
            Once you're done, you can mint an NFT of your score which we'll
            verify and embed with a ZK-Proof. You can also look at high scores
            and your own NFTs.
          </p>
          <div className="flex justify-center">
            <button
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 transition ease-in-out duration-150"
              onClick={props.connect}
            >
              Connect
            </button>
          </div>
          <div className="flex justify-center">
            <a href="https://github.com/0xAndoroid/zkSnake" className="mt-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 transition ease-in-out duration-150">View on GitHub</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
