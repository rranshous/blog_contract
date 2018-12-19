pragma solidity >=0.4.21 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Blog.sol";

contract TestBlog {
  Blog blog = Blog(DeployedAddresses.Blog());
  string ipfsHash = "QmVtYjNij3KeyGmcgg7yVXWskLaBtov3UYL9pgcGK3MCWu";

  function testSettingOwner() public {
    //Blog _blog = new Blog();
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
