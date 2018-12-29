var BlogContract;
var publishContent;
var simplemde;
(async function() {
  console.log("init app");
  var converter = new showdown.Converter();

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
  var address = "0x5f7BDE3e61E45B70A2be776F6069B2f347D1A94F";
  console.log("address: ", address);
  var accounts = await web3.eth.getAccounts();
  console.log("accounts: ", accounts);
  BlogContract = new web3.eth.Contract(
    blogAbi,
    address,
    {
      from: accounts[0],
      gasPrice: 2,
      gas: 1000000,
    }
  )
  console.log("BlogContract: ", BlogContract);

  publishContentToContract = function(content) {
    console.log("publishing content:", content);
    return BlogContract.methods.publishContent(content).send();
  };

  var addContent = function(html) {
    console.log('adding content', html);
    html = converter.makeHtml(html);
    console.log('after markdown conversion, html:', html);
    $('#new-content ul').prepend(`<li>${html}</li>`);
  };

  var renderEvent = function(event) {
    console.log("event:", event);
    addContent(event.returnValues.ipfsHash);
  };

  var renderIpfsEvent = async function(event) {
    // ipfs://ipfs/<> => /ipfs/<>
    var ipfsPath = event.returnValues.ipfsHash.substring(6);
    console.log("renderIpfsEvent:", event, ipfsPath);
    ipfs.cat(ipfsPath, function (err, file) {
      if (err) { throw err; }
      console.log("ipfs.cat:", event.ipfsPath, file.toString('utf8'));
      addContent(file.toString('utf8'));
    })
  };

  var handleEvent = function(event) {
    console.log("rendering event:", event);
    if (event.returnValues.ipfsHash.startsWith("ipfs://")) {
      console.log("rendering as IPFS event");
      renderIpfsEvent(event);
    } else {
      console.log("rendering as content event");
      renderEvent(event);
    }
  };

  var handleEvents = function(events) {
    console.log("handleEvents:", events);
    events.forEach(handleEvent);
  };

  console.log("subscribing to event");
  BlogContract.events.Publish('allEvents')
  .on('data', handleEvent)
  .on('error', (error) => { console.log("event error: ", error) });

  console.log("looking up historical events");
  BlogContract.getPastEvents('allEvents', { fromBlock: 0 })
  .then(handleEvents);

  console.log("initializing editor");
  simplemde = new SimpleMDE();
})();
