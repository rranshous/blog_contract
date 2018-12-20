pragma solidity >=0.4.21 <0.6.0;

import "truffle/Assert.sol";
import "../contracts/Blog.sol";
import "truffle/DeployedAddresses.sol";

contract TestBlog {

  Blog blog = Blog(DeployedAddresses.Blog());
  string ipfsHash = "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu";

  function testSettingOwner() public {
    Assert.equal(
      msg.sender,
      blog.owner(),
      "owner does not match"
    );
  }

  function testPublishContent() public {
    blog.publishContent(ipfsHash);
  }

}
