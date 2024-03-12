"use client";
import { useState } from "react";
import {web3Accounts, web3Enable, web3FromAddress, web3FromSource} from "@polkadot/extension-dapp";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { SiwsMessage } from "@talismn/siws";
import { toast } from "react-toastify";
import Image from "next/image";
import Logo from "@/public/LOGO.png"

function App() {
  const [activeExtension, setActiveExtension] = useState<any>(null);
  const [accountConnected, setAccountConnected] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [signedIn, setSignIn] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);
  const [amountToBurn, setAmountToBurn] = useState<any>();

  const connectExtension = async () => {
    setLoading(true);
    try {
      const extension = await web3Enable("DotSys Polkadot Connection");
      // console.log(extension);
      setActiveExtension(extension);

      let accounts = null;

      if (extension && extension.length > 0) {
        accounts = await web3Accounts();
      } else {
        toast.error("Account Not found", {
          className: "toast-message",
        });
      }

      setAccountConnected(accounts);
      toast.success("Account Connected");
    } catch (e) {
      console.log(e);
      toast.error("Connection Error: " + e);
    }
    setLoading(false);
  };

  //SignIn Handler
  const SignInHandler = async () => {
    setLoading(true);
    const nonceRes = await fetch(`/api/getnonce`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    const data = await nonceRes.json();
    const { nonce } = data;
    console.log(nonce)

    const siws = new SiwsMessage({
      domain: "localhost",
      uri: "http://localhost:3000",
      address: accountConnected[0].address,
      nonce,
      statement: "Welcome to DOTRES, Approve Signin",
      chainName: "Polkadot",
    });

    try {

      const injectedExtension = await web3FromSource(accountConnected[0].meta.source);
      const signed = await siws.sign(injectedExtension);

      const verifyRes = await fetch("/api/verification", {
        method: "POST",
        body: JSON.stringify({
          ...signed,
          address: accountConnected[0].address,
        }),
      });

      const verified = await verifyRes.json();
      console.log(verified)

      if (verified.error) throw new Error(verified.error);
      toast.success(`Signed in Successfully. `, {
        className: "toast-message",
      });

      setSignIn(true);
      setJwtToken(verified.jwtToken);

    } catch (e: any) {
      toast.error(e.message, {
        className: "toast-message",
      });
      toast.error("Signed in Failed.");
    }
    setLoading(false);
  };

  const initTransaction = async () => {
    if (parseInt(amountToBurn) <= 0) {
      toast.error("Input a value greater than zero.", {
        className: "toast-message",
      });
    } else {
      
      setTransactionLoading(true);
      const websocketProvider = new WsProvider("wss://westend-rpc.polkadot.io");
      const api = await ApiPromise.create({ provider: websocketProvider });
  
      const injector = await web3FromAddress(accountConnected[0].address);
  
      const tx = api.tx.balances.transferKeepAlive(
        "5GbKMhCgYSVLRy62ZXFZuySSuLQcK7SstXbf9EvZpebkndGZ",
        parseFloat(amountToBurn)
      );
  
      tx.signAndSend(
        accountConnected[0].address,
        { signer: injector.signer },
        ({ status }) => {
          if (status.isInBlock) {
            toast.success(`Transaction sent at block ${status.asInBlock.toString()}`, {
              className: "toast-message",
            });
          } else {
            toast.info(`Current Status: ${status.type}`, {
              className: "toast-message",
            });
          }
          setTransactionLoading(false);
        }
      ).catch((error) => {
        toast.error(`:( transaction failed: ` + error, {
          className: "toast-message",
        });
        setTransactionLoading(false);
      });
    }
  };

  //Shortens Address String
  const shortenStringMiddle = (inputString: string) => inputString.replace(/^(.{10}).*(.{10})$/, '$1........$2');

  return (
    <div>

      {/* Navbar and wallet Connection */}
      <div className="flex justify-between items-center h-[5rem] px-[3rem] bg-white border-b-4 border-red">
        <div>
            <Image
              className="w-[100px]"
              src={Logo}
              alt="Logo"
            />
        </div>
        <div>
          {!accountConnected ? (
            <button
              className="outline-none border-none p-3 rounded-lg text-white bg-blue10 transition duration-500 text-lg hover:bg-blue20"
              onClick={connectExtension}
              disabled={loading}
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <button
              className="outline-none border-none p-4 rounded-lg text-white bg-red-700 transition duration-500 text-lg hover:bg-red-600 "
              onClick={() => setAccountConnected(null)}
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
      

      <div className="w-[85%]  h-[calc(100vh-_5rem)] mx-auto">
        {!accountConnected ? (
          <div className="w-full h-full flex items-center justify-center gap-[1rem] flex-col">
            <h2 className="text-[1.5rem]">Wallet not Connected, Click on the Connect Button</h2>
            <button
              className="outline-none border-none p-3 rounded-lg text-white bg-blue10 transition duration-500 text-lg hover:bg-blue20"
              onClick={connectExtension}
              disabled={loading}
            >
              {loading ? "Connecting" : "Connect"}
            </button>
          </div>
        ) : (
          <div className="size-full flex items-center justify-center">
            {signedIn ? (
              <div className="w-full border-white border-4 flex-col flex gap-[2rem] rounded-[10px] p-4 bg-white text-black">
                <h1 className="text-center text-[2rem]">
                  Sign In using Substrate
                </h1>
                <h3 className="text-center text-[1rem]">Substrate serves as the fundamental blockchain framework for constructing interconnected blockchains within the Polkadot network. However, Substrate is open for use by anyone aiming to create their own blockchains. Several independent chains, built with Substrate, operate autonomously beyond the Polkadot ecosystem.</h3>
                <div className="w-full flex text-center gap-[1rem] items-center justify-center flex-col pt-4 bg-blue10 rounded-[10px]">
                  <h2 className="p-[10px] rounded-[5px] bg-bg text-white">Selected Account Address:</h2>
                  <h5 className="w-full py-4 text-[1rem] bg-bg text-white">
                    {shortenStringMiddle(accountConnected[0].address)}
                  </h5>
                </div>
                <button
                  onClick={SignInHandler}
                  disabled={loading}
                  className="outline-none border-none p-3 rounded-lg text-white bg-blue10 transition duration-500 text-lg hover:bg-blue20 w-full"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            ) : (
              <div className="w-full border-white items-center justify-center border-4 flex-col flex gap-[2rem] rounded-[10px] p-4 bg-bg text-white">
                <h3 className="text-medium text-[1rem] capitalize">
                  Selected Extension: {activeExtension[0].name}
                </h3>
                <p className="text-white">
                  Address: {shortenStringMiddle(accountConnected[0].address)}{" "}
                </p>
                <p>Enter WND Token Amount to Burn</p>
                  <input
                    value={amountToBurn}
                    onChange={(e) => setAmountToBurn(e.target.value)}
                    type="number"
                    className="bg-white p-4 text-black rounded-[10px] pl-[5px] border-white focus:outline-none w-[60%]"
                    placeholder="Enter WND Token Amount to Burn"
                  />
                <button
                  className="w-full outline-none border-none p-3 rounded-lg text-white bg-blue10 transition duration-500 text-lg hover:bg-blue20 mt-[1rem]"
                  disabled={transactionLoading}
                  onClick={initTransaction}
                >
                  {transactionLoading ? `Burning...` : "Burn WND"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
