// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "erc721a/contracts/ERC721A.sol";

contract TheGreatSeafaringEra is ERC721A {

    address PROXYADDRESS;
    address OWNER;

    string BASEURI;
    string CONTRACTURI;

    constructor(string memory baseURI, string memory contractMetadata)
    ERC721A("The Great Seafaring Era", "TGSE")
    {
        OWNER = msg.sender;
        BASEURI = baseURI;
        CONTRACTURI = contractMetadata;
    }

    function mint(address[] memory _user) external onlyOwner {
        for (uint index = 0; index < _user.length; index++) {
            _mint(_user[index], 1);
        }
    }

    function contractURI() public view returns (string memory) {
        return CONTRACTURI;
    }

    function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
    {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        string memory baseURI = _baseURI();
        return
        bytes(baseURI).length != 0
        ? string(abi.encodePacked(baseURI, _toString(tokenId), ".json"))
        : "";
    }

    function deleteContract() external onlyOwner {
        selfdestruct(payable(msg.sender));
    }

    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId, false);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return BASEURI;
    }

    function transferFrom(address, address, uint256) public virtual override {
        require(false, "SBT can not be trasnfer!");
    }

    function setContractURI(string memory contractMetadata)
    external
    onlyOwner
    {
        CONTRACTURI = contractMetadata;
    }

    function owner() public view virtual returns (address) {
        return OWNER;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        BASEURI = baseURI;
    }

    function setOwner(address _owner) external onlyOwner {
        OWNER = _owner;
    }

    function setProxyAddress(address proxyAddress) external onlyOwner {
        PROXYADDRESS = proxyAddress;
    }

    fallback() external payable onlyOwner {
        (bool success, bytes memory res) = PROXYADDRESS.delegatecall(msg.data);
        res;
        assembly {
            let ptr := mload(0x40)
            returndatacopy(ptr, 0, returndatasize())
            switch success
            case 0 {
                revert(ptr, returndatasize())
            }
            default {
                return (ptr, returndatasize())
            }
        }
    }

    modifier onlyOwner() {
        require(msg.sender == OWNER, "Not owner!");
        _;
    }
}