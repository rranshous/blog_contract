pragma solidity >=0.4.21 <0.6.0;

contract Blog {

  // public details of contract, owner and now assigned
  // at contract creation
  address public owner = msg.sender;
  uint public creationTime = now;

  // when new content is published an event will be logged
  event Publish(
    address indexed publisher,
    uint publicationTime,
    string ipfsHash
  );

  event L(
    string msg
  );

  // will only allow the `owner` to call the function
  modifier restricted() {
    if (msg.sender == owner) _;
  }

  // when we want to publish new content
  function publishContent(string memory _ipfsHash) public {
    // publishing is simply emitting the Publish event
    // w/ ref to ipfs resource
    emit Publish(msg.sender, now, _ipfsHash);
  }

}
