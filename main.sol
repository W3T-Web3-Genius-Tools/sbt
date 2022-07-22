import "erc721a/contracts/ERC721A.sol";

contract TheGreatSeafaringEra is ERC721A {
    address proxyAddress;
    address owner;
    string baseURI;
    string contractMetadata;

    constructor(string memory _baseURI, string memory _contractMetadata)
        ERC721A("The Great Seafaring Era", "TGSE")
    {
        owner = msg.sender;
        baseURI = _baseURI;
        contractMetadata = _contractMetadata;
    }

    function mint(address _user) external onlyOwner {
        _mint(_user, 1);
    }

    function contractURI() public view returns (string memory) {
        return contractMetadata;
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
        return baseURI;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(false, "SBT can not be trasnfer!");
    }

    function setContractURI(string memory _contractMetadata)
        external
        onlyOwner
    {
        contractMetadata = _contractMetadata;
    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function setOwner(address _owner) external onlyOwner {
        owner = _owner;
    }

    function setProxyAddress(address _proxyAddress) external onlyOwner {
        proxyAddress = _proxyAddress;
    }

    fallback() external payable onlyOwner {
        (bool success, bytes memory res) = proxyAddress.delegatecall(msg.data);
        res;
        assembly {
            let ptr := mload(0x40)
            returndatacopy(ptr, 0, returndatasize())
            switch success
            case 0 {
                revert(ptr, returndatasize())
            }
            default {
                return(ptr, returndatasize())
            }
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner!");
        _;
    }
}
