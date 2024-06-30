// Initialize web3 instance
var web3;

// Connect to Metamask
async function connectMetamask() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        web3 = new Web3(window.ethereum);
        console.log('Connected to Metamask');
    } catch (error) {
        console.error('Error connecting to Metamask:', error);
    }
}

// Connect to Coinbase Wallet
async function connectCoinbase() {
    try {
        const coinbaseProvider = new WalletLink({
            appName: "NocuGame",
            appLogoUrl: "assets/images/logo.png",
            darkMode: false
        }).makeWeb3Provider("https://polygon-rpc.com", 137);
        await coinbaseProvider.enable();
        web3 = new Web3(coinbaseProvider);
        console.log('Connected to Coinbase Wallet');
    } catch (error) {
        console.error('Error connecting to Coinbase Wallet:', error);
    }
}

// Connect to Trust Wallet
async function connectTrustWallet() {
    try {
        const trustWalletProvider = new TrustWalletProvider();
        await trustWalletProvider.enable();
        web3 = new Web3(trustWalletProvider);
        console.log('Connected to Trust Wallet');
    } catch (error) {
        console.error('Error connecting to Trust Wallet:', error);
    }
}

// Connect to WalletConnect
async function connectWalletConnect() {
    try {
        const walletConnectProvider = new WalletConnectProvider({
            rpc: {
                137: "https://polygon-rpc.com"
            }
        });
        await walletConnectProvider.enable();
        web3 = new Web3(walletConnectProvider);
        console.log('Connected to WalletConnect');
    } catch (error) {
        console.error('Error connecting to WalletConnect:', error);
    }
}

// Function to handle wallet connection
async function Connect(walletType) {
    switch(walletType) {
        case 'metamask':
            await connectMetamask();
            break;
        case 'coinbase':
            await connectCoinbase();
            break;
        case 'trustwallet':
            await connectTrustWallet();
            break;
        case 'walletconnect':
            await connectWalletConnect();
            break;
        default:
            console.error('Unsupported wallet type');
    }
}

// Example function to buy tokens
async function buyTokens(amount) {
    if (!web3) {
        console.error('Wallet is not connected');
        return;
    }

    const contractAddress = '0x7ac822195EAb6C1Ac91389700D7449536b0148fc'; // Replace with your contract address
    const contractABI = []; // Replace with your contract ABI

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];

    try {
        const result = await contract.methods.buyTokens().send({
            from: fromAddress,
            value: web3.utils.toWei(amount.toString(), 'ether') // Adjust as per your requirement
        });
        console.log('Transaction successful:', result);
    } catch (error) {
        console.error('Error buying tokens:', error);
    }
}
