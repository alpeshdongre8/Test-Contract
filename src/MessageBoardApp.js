import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const contractAddress = "CONTRACT_ADDRESS"; // Replace with the actual contract address
const contractABI = [
  // Replace with the ABI of your deployed contract
  // You can obtain it from the compiled contract artifact
];

const MessageBoardApp = () => {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        // Detect Ethereum provider (MetaMask)
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setWeb3Provider(provider);

          // Request access to user's accounts
          const accounts = await provider.send("eth_requestAccounts", []);
          setAccount(accounts[0]);

          // Create contract instance
          const contractInstance = new ethers.Contract(contractAddress, contractABI, provider.getSigner());
          setContract(contractInstance);

          // Listen for changes in account or network
          window.ethereum.on("accountsChanged", (accounts) => setAccount(accounts[0]));
          window.ethereum.on("chainChanged", () => window.location.reload());
        } else {
          alert("Please install MetaMask or use a Web3-enabled browser.");
        }
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    };

    initWeb3();
  }, []);

  const sendMessage = async () => {
    try {
      if (contract && account && messageInput) {
        const tx = await contract.sendMessage(messageInput);
        await tx.wait(); // Wait for the transaction to be mined
        setMessageInput("");
        loadMessages();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const likeMessage = async (messageId) => {
    try {
      if (contract && account) {
        const tx = await contract.likeMessage(messageId);
        await tx.wait(); // Wait for the transaction to be mined
        loadMessages();
      }
    } catch (error) {
      console.error("Error liking message:", error);
    }
  };

  const loadMessages = async () => {
    try {
      if (contract) {
        const count = await contract.getMessageCount();
        const messages = [];

        for (let i = 0; i < count; i++) {
          const message = await contract.getMessage(i);
          messages.push({
            id: i,
            sender: message.sender,
            content: message.content,
            likes: parseInt(message.likes),
          });
        }

        setMessages(messages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [contract]);

  return (
    <div>
      <h1>Message Board</h1>
      <textarea
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type your message here"
      ></textarea>
      <button onClick={sendMessage}>Send Message</button>

      <hr />
      <h2>Messages</h2>
      {messages.map((message) => (
        <div key={message.id}>
          <p>
            <strong>Sender:</strong> {message.sender}
          </p>
          <p>
            <strong>Content:</strong> {message.content}
          </p>
          <p>
            <strong>Likes:</strong> {message.likes}
          </p>
          <button onClick={() => likeMessage(message.id)}>Like</button>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default MessageBoardApp;
