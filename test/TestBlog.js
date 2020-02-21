const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');
const Blog = artifacts.require("Blog");

contract("Blog", (accounts) => {
  let blog;
  const ipfsHash = "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu";
  const account = accounts[0];

  beforeEach('setup contract and call', async () => {
    blog = await Blog.deployed();
  });

  it("emits Publish event on publish", async () => {
    let result = await blog.publishContent(ipfsHash, {from: account});
    truffleAssert.eventEmitted(result, 'Publish', (ev) => {
      return ev.publisher == account &&
             ev.ipfsHash == ipfsHash;
    });
  });
});
