
import "./web3.min.js"
console.log(window.location.search.split('=')[2])
let address;
let provider;
let web3;
const chainId = 1;
const metamaskWalletLogin = async () => {
address = await window.ethereum.request({
method: "eth_requestAccounts",
});

if (window.ethereum.networkVersion !== chainId) {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: Web3.utils.toHex(chainId) }]
          });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: 'Ethereum Mainnet',
              chainId: web3.utils.toHex(chainId),
              nativeCurrency: { name: 'ETH', decimals: 1, symbol: 'ETH' },
              rpcUrls: ['https://cloudflare-eth.com/']
            }
          ]
        });
      }
    }
  }
provider = window.ethereum;
web3 = new Web3(provider);

const req = await fetch(`/users/web3-nonce`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      wallet: address[0],
    }),
  });

  const nonce_data = await req.json();
  const signature = await web3.eth.personal.sign(
    nonce_data.nonce,
    address[0]
  );

  const req2 = await fetch(`/users/web3-auth`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sign: signature,
      wallet: address[0],
      nonce:nonce_data.nonce,
      network:window.ethereum.networkVersion
    }),
  });
  const data2 = await req2.json();
  if(data2?.status=='disabled'){
    document.querySelector('body').innerHTML='<h2>Wallet login is disabled.Please try again later.</h2>'
  }
  else if(data2?.status=='not-on-whitelist'){
    document.querySelector('body').innerHTML='<h2>You dont have any whitelisted NFT to proceed.</h2>'
  }
  else{
  location.href = `chrome-extension://${window.location.search.split('=')[2]}/views/web3LoginSuccess.html?data=${btoa(address[0])}`
  }




}
metamaskWalletLogin();
