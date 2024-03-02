import { useSDK } from '@metamask/sdk-react';
import React, { useState, useEffect } from 'react';
import './App.css';
import { send_eth_signTypedData_v4, send_personal_sign } from './SignHelpers';
import NFTCard from "./components/NFTCard"
import MyNFTs from "./components/MyNFTs"
import NavBar from "./components/NavBar"
import LandingHero from "./components/LandingHero"
import Game from "./components/Game"
import Gallery from "./components/Gallery"
import Leaderboard from "./components/Leaderboard"

import MintNFT from "./components/MintNFT"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';








export const App = () => {
  const sepoliaID = "0xAA36A7";
  const [response, setResponse] = useState<unknown>('');
  const { sdk, connected, connecting, provider, chainId, account, balance } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();

    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };


  useEffect(() => {
    if (chainId != sepoliaID) {
      changeNetwork();
    } else {
      // console.log("On Sepolia Network")
    }
    // console.log("Network Id:", chainId)

  }, [chainId])


  const terminate = () => {
    sdk?.terminate();
  };

  const changeNetwork = async () => {
    let hexChainId = sepoliaID;
    console.debug(`switching to network chainId=${hexChainId}`);
    try {
      const response = await provider?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }], // chainId must be in hexadecimal numbers
      });
      console.debug(`response`, response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-h-screen max-w-full">


      {(connected || account) ? (
        <div>
          <NavBar address={account} terminate={terminate}/>
          {/* <Game /> */}
          {/* <Gallery /> */}
          <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/my-profile" element={<MyNFTs address={account} />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/leaderboard" element={<Leaderboard />} />



          
          {/* <MintNFT /> */}
          </Routes>

        </div>
      ) : (
        <div>
      <LandingHero address={account} connect={connect}/>
        </div>
      )}

    </div>
  );
};

export default App;
