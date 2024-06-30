const ethereum = window.ethereum;

// check if metamask extension is installed on the browser
const isMetaMaskInstalled = () => {
    return ethereum ? true : false;
};

// connect to MetaMask wallet
const connectMetaMaskWallet = async () => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
};

// connect to Coinbase Wallet
const connectCoinbaseWallet = async () => {
    const coinbaseProvider = new WalletLink({
        appName: "NocuGame",
        appLogoUrl: "assets/images/logo.png",
        darkMode: false
    }).makeWeb3Provider("https://polygon-rpc.com", 137);
    await coinbaseProvider.enable();
    web3 = new Web3(coinbaseProvider);
    const accounts = await web3.eth.getAccounts();
    return accounts;
};

// connect to Trust Wallet
const connectTrustWallet = async () => {
    const trustWalletProvider = new TrustWalletProvider();
    await trustWalletProvider.enable();
    web3 = new Web3(trustWalletProvider);
    const accounts = await web3.eth.getAccounts();
    return accounts;
};

// connect to WalletConnect
const connectWalletConnect = async () => {
    const walletConnectProvider = new WalletConnectProvider({
        rpc: {
            137: "https://polygon-rpc.com"
        }
    });
    await walletConnectProvider.enable();
    web3 = new Web3(walletConnectProvider);
    const accounts = await web3.eth.getAccounts();
    return accounts;
};

// connect to the selected wallet
const connectWallet = async (walletType) => {
    let accounts;
    switch (walletType) {
        case 'metamask':
            accounts = await connectMetaMaskWallet();
            break;
        case 'coinbase':
            accounts = await connectCoinbaseWallet();
            break;
        case 'trustwallet':
            accounts = await connectTrustWallet();
            break;
        case 'walletconnect':
            accounts = await connectWalletConnect();
            break;
        default:
            console.error('Unsupported wallet type');
            return;
    }
    connectWalletLocaly();
    return accounts;
};

// disconnect wallet
const disconnectWallet = () => {
    localStorage.removeItem('isWalletConnected');
    window.location.reload();
};

// check if wallet is connected
const isAccountConnected = async () => {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    return accounts;
};

// check if wallet is connected locally
const isWalletConnected = () => {
    return localStorage.getItem('isWalletConnected') === 'true';
};

// store wallet connection status locally
const connectWalletLocaly = () => {
    localStorage.setItem('isWalletConnected', true);
};

// get current chain ID
const getChainId = async () => {
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainId);
};

// handle account change
ethereum.on('accountsChanged', () => {
    window.location.reload();
});

// handle network connect
const onMetamaskconnect = async () => {
    const chainId = await getChainId();
    ethereum.on('connect', () => {
        console.log(chainId);
    });
};

// handle chain change
const onChainChange = () => {
    ethereum.on('chainChanged', (_chainId) => {
        return parseInt(_chainId);
    });
};
