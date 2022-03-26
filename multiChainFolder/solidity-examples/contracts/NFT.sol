
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ILayerZeroReceiver.sol";
import "./interfaces/ILayerZeroEndpoint.sol";

contract NFT is ERC721URIStorage, ILayerZeroReceiver, Ownable {

    ILayerZeroEndpoint public endpoint;
    mapping(uint16 => bytes) public remotes;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    mapping(uint256 => bool) public tokenExists;
    mapping(uint256 => bool) public isTokenIdLocked;

    /*constructor(address marketPlaceAddress)
        ERC721("Concepts and Solutions Token", "CAST")
    {
        contractAddress = marketPlaceAddress;
    }*/


    function setLocked(uint256 _tokenId, bool _locked) public {
        isTokenIdLocked[_tokenId] = _locked;
    }

    function getLocked(uint256 _tokenId) public returns (bool){
        return isTokenIdLocked[_tokenId];
    }

    // constructor mints tokens to the deployer
    constructor(string memory name_, string memory symbol_, address _layerZeroEndpoint, address marketPlaceAddress) ERC721("Concep", "CAST"){
        endpoint = ILayerZeroEndpoint(_layerZeroEndpoint);
        contractAddress = marketPlaceAddress;
        //createToken("https://gateway.pinata.cloud/ipfs/QmZXsHdE13ruPqz3myrrSdnUZuMYtWmWr4DmRkuCT9jLAQ/");
        //
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender,newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newTokenId;
    }

        // send tokens to another chain.
    // this function sends the tokens from your address to the same address on the destination.
    function sendTokens(
        uint16 _chainId,                            // send tokens to this chainId
        bytes calldata _dstOmniChainTokenAddr,     // destination address of OmniChainToken
        uint256 _tokenId                                  // how many tokens to send
    )
        public
        payable
    {
        // burn the tokens locally.
        // tokens will be minted on the destination.
        //require(
         //   allowance(msg.sender, address(this)) >= _qty,
         //   "You need to approve the contract to send your tokens!"
        //);

        // and burn the local tokens *poof*
        _burn(_tokenId);
        //transferFrom(msg.sender, address(this), _tokenId);
        //setLocked(_tokenId,true);

        // abi.encode() the payload with the values to send
        //bytes memory payload = abi.encode(address(0x6b1e0D61eb90e529b198D69952C9e2F775101C74), uint256(2));
        bytes memory payload = abi.encode(msg.sender, _tokenId);

        // send LayerZero message
        endpoint.send{value:msg.value}(
            _chainId,                       // destination chainId
            _dstOmniChainTokenAddr,        // destination address of OmniChainToken
            payload,                        // abi.encode()'ed bytes
            payable(msg.sender),            // refund address (LayerZero will refund any superflous gas back to caller of send()
            address(0x0),                   // 'zroPaymentAddress' unused for this mock/example
            bytes("")                       // 'txParameters' unused for this mock/example
        );
    }

    // _chainId - the chainId for the remote contract
    // _remoteAddress - the contract address on the remote chainId
    // the owner must set remote contract addresses.
    // in lzReceive(), a require() ensures only messages
    // from known contracts can be received.
    function setRemote(uint16 _chainId, bytes calldata _remoteAddress) external onlyOwner {
        require(remotes[_chainId].length == 0, "The remote address has already been set for the chainId!");
        remotes[_chainId] = _remoteAddress;
    }

    // receive the bytes payload from the source chain via LayerZero
    // _fromAddress is the source OmniChainToken address
    function lzReceive(uint16 _srcChainId, bytes memory _srcAddress, uint64, bytes memory _payload) override external{
        require(msg.sender == address(endpoint)); // boilerplate! lzReceive must be called by the endpoint for security
        // owner must have setRemote() to allow its remote contracts to send to this contract
        //require(
        //    _srcAddress.length == remotes[_srcChainId].length && keccak256(_srcAddress) == keccak256(remotes[_srcChainId]),
        //    "Invalid remote sender address. owner should call setRemote() to enable remote contract"
        //);

        // decode
        (address toAddr, uint256 _tokenId) = abi.decode(_payload, (address, uint256));

        // mint the tokens back into existence, to the toAddr from the message payload
        //if(!tokenExists[_tokenId]){
            _mint(toAddr, _tokenId);
        //    tokenExists[_tokenId] = true;
        //}else{
        //    transferFrom(address(this), toAddr, _tokenId);
        //}
        //setLocked(_tokenId,false);    
    }
}