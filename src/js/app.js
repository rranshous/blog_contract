(async function() {
  console.log("init app");

  console.log("initWeb3");
  // Modern dapp browsers...
  var web3Provider;
  if (window.ethereum) {
    console.log("initWeb3 using etherium");
    web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    console.log("initWeb3 using web3");
    web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    console.log("initWeb3 using http fallback");
    web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
  }
  var web3 = new Web3(web3Provider);
  var blogAbi = (await $.getJSON('/Blog.json')).abi
  console.log("blogAbi: ", blogAbi);
  var address = "0xDD76dD1319a0E04c72e508203E557A7d34a5D6C2";
  console.log("address: ", address);
  var accounts = await web3.eth.getAccounts();
  console.log("accounts: ", accounts);
  var BlogContract = new web3.eth.Contract(
    blogAbi,
    address,
    {
      from: accounts[0],
      gasPrice: 2,
      gas: 1000000,
    }
  )
  console.log("BlogContract: ", BlogContract);

  console.log("subscribing to event");
  BlogContract.events.Publish('allEvents')
  .on('data', (event) => { console.log("event: ", event); })
  .on('error', (error) => { console.log("event error: ", error) });
})();
