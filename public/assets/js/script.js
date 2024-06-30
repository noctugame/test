// Import the necessary libraries (skip this if using CDN)
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

// Create a Web3Modal instance
const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            infuraId: 'YOUR_INFURA_ID', // required
        },
    },
    coinbasewallet: {
        package: CoinbaseWalletSDK, // required
        options: {
            appName: 'NoctuGame', // required
            infuraId: 'YOUR_INFURA_ID', // required
            rpc: '', // Optional if `infuraId` is provided; otherwise required
            chainId: 137, // Polygon network ID
            darkMode: true,
        },
    },
};

const web3Modal = new Web3Modal({
    network: 'polygon', // optional
    cacheProvider: true, // optional
    providerOptions, // required
});

// Function to connect to the wallet
async function connectWallet() {
    try {
        const instance = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();
        return signer;
    } catch (error) {
        console.error('Failed to connect to the wallet:', error);
    }
}

// Function to buy tokens
async function buyTokens() {
    const signer = await connectWallet();
    if (!signer) return;

    const tokenAddress = '0x7ac822195EAb6C1Ac91389700D7449536b0148fc'; // Replace with your token's contract address
    const tokenAbi = [
        // Replace with your token's ABI
        "function buyTokens() payable"
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

    const amountToBuy = ethers.utils.parseUnits('1.0', 'ether'); // Replace with the amount in MATIC the user wants to spend

    try {
        const tx = await tokenContract.buyTokens({ value: amountToBuy });
        await tx.wait();
        console.log('Tokens bought successfully');
    } catch (error) {
        console.error('Error buying tokens:', error);
    }
}

// Ensure the user has a wallet installed
if (typeof window.ethereum !== 'undefined') {
    console.log('Ethereum wallet is installed!');
} else {
    alert('Please install a wallet to use this feature');
}

// Add an event listener to your "Claim Token" button
document.getElementById('buyTokensButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor behavior
    buyTokens();
});

// Existing code to get token data
async function fetchTokenData() {
    try {
        const response = await fetch('https://openapi.dexview.com/latest/dex/tokens/0x7ac822195EAb6C1Ac91389700D7449536b0148fc');
        const data = await response.json();

        // Process and display the data as needed
        console.log(data);
    } catch (error) {
        console.error('Error fetching token data:', error);
    }
}

// Fetch token data on page load
fetchTokenData();
