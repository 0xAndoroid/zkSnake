// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "base64/base64.sol";
import "openzeppelin/contracts/token/ERC721/ERC721.sol";
import "openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {Strings} from "openzeppelin/contracts/utils/Strings.sol";
import {IBonsaiRelay} from "bonsai/relay/IBonsaiRelay.sol";
import {BonsaiCallbackReceiver} from "bonsai/relay/BonsaiCallbackReceiver.sol";

contract ZkSnake is ERC721, ERC721Burnable, BonsaiCallbackReceiver {
    bytes32 public immutable snakeImageId;
    uint64 private constant BONSAI_CALLBACK_GAS_LIMIT = 1000000;

    uint256 private nextTokenId;

    mapping(uint256 => uint256) public scores;
    mapping(uint256 => uint256) public lengths;
    uint256[] public topScores;

    constructor(
        IBonsaiRelay bonsaiRelay,
        bytes32 _snakeImageId
    ) ERC721("zkSnake", "SNAKE") BonsaiCallbackReceiver(bonsaiRelay) {
        snakeImageId = _snakeImageId;
        topScores = new uint256[](10);
    }

    function mintByAuthority(
        address to,
        uint256 score,
        uint256 length
    ) external onlyBonsaiCallback(snakeImageId) {
        uint256 tokenId = nextTokenId++;
        _mint(to, tokenId);
        scores[tokenId] = score;
        lengths[tokenId] = length;
        updateTopScores(tokenId, score);
    }

    function submitScore(bytes memory gameplay) external {
        bonsaiRelay.requestCallback(
            snakeImageId,
            abi.encode(msg.sender, gameplay),
            address(this),
            this.mintByAuthority.selector,
            BONSAI_CALLBACK_GAS_LIMIT
        );
    }

    function updateTopScores(uint256 tokenId, uint256 score) internal {
        uint256 index = 0;
        for (uint256 i = 0; i < topScores.length; i++) {
            if (scores[topScores[i]] < score) {
                index = i;
                break;
            }
        }
        for (uint256 i = topScores.length - 1; i > index; i--) {
            topScores[i] = topScores[i - 1];
        }
        topScores[index] = tokenId;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireMinted(tokenId);
        string[] memory uriParts = new string[](4);
        uriParts[0] = string("data:application/json;base64,");
        string memory score = Strings.toString(scores[tokenId]);
        string memory length = Strings.toString(lengths[tokenId]);
        // TODO Fix descirption
        uriParts[1] = string(
            abi.encodePacked(
                '{"name":"zkSnake Score ',
                score,
                '",',
                '"description":"This NFT is a zero-knowledge proof of obtaining score in zkSnake game.",',
                '"attributes":[{"trait_type":"Score","value":"',
                score,
                '"}, {"trait_type": "Length","value":"',
                length,
                '"}],',
                '"image":"data:image/svg+xml;base64,'
            )
        );
        uriParts[2] = Base64.encode(
            abi.encodePacked(
                '<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"><rect width="1000" height="1000" fill="hsl(',
                score,
                ', 78%, 56%)"/><svg width="1000" height="1000" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path fill="black" d="M301.563 20.22c-8.64-.033-17.075.304-25.22.968-200.737 0-184.708 197.468 0 226 184.71 28.53 137.485 190.906 9.907 190.906-84.162 0-140.85-19.887-181.03-64.156-42.064-46.34-12.496-99.594 44.28-51.938 57.026 47.867 100.32 83.576 171.813 28-89.54 29.698-124.626-42.73-188.313-81.875-60.388-37.117-138.036 38.746-86 121.25 43.402 68.815 152.713 107.78 243.344 107.78 220.645 0 259.324-271.296 63.094-301.936-69.28-10.818-119.376-23.398-143.688-61.907-17.817-28.226 32.672-85.843 97.656-59.688 9.406 15.75 13.877 35.578 15.375 65.47l83.5 39.53 3.22-5.438.063.125c8.535-4.49 14.952-14.657 20.906-26.03-10.923 4.674-23.103 4.475-34.69 1.468-2.788-1.817-5.497-3.827-8.092-6-23.392-19.585-28.737-45.978-11.938-58.97 12.435-9.615 33.52-9.19 53.125-.374 8.603 18.074 9.702 35.265 11.188 52.5 10.24-14.024 15.704-29.453 18.562-45.656l10.72-18.063C421.43 35.528 357.307 20.423 301.56 20.22zm42.812 22.06c13.64.758 28.504 1.625 41.72 9.407l-9.47 16.126c-8.187-4.822-19.96-6.137-33.28-6.876l1.03-18.656z"/></svg><text x="80" y="276" fill="white" font-family="Helvetica" font-size="150" font-weight="bold">zkSnake</text><text x="80" y="425" fill="white" font-family="Helvetica" font-size="130" font-weight="regular">score ',
                score,
                "</text></svg>"
            )
        );
        uriParts[3] = string('"}');
        string memory uri = string.concat(
            uriParts[0],
            Base64.encode(
                abi.encodePacked(uriParts[1], uriParts[2], uriParts[3])
            )
        );

        return uri;
    }
}
