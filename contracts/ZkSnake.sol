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
    uint64 private constant BONSAI_CALLBACK_GAS_LIMIT = 100000;

    mapping(uint256 => uint256) public scores;
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
        uint256 tokenId,
        uint256 score
    ) external onlyBonsaiCallback(snakeImageId) {
        _mint(to, tokenId);
        scores[tokenId] = score;
        updateTopScores(tokenId, score);
    }

    function submitScore(
        uint256 tokenId,
        uint256 score,
        bytes memory gameplay
    ) external {
        bonsaiRelay.requestCallback(
            snakeImageId,
            abi.encode(msg.sender, tokenId, score, gameplay),
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
        // TODO Fix descirption
        uriParts[1] = string(
            abi.encodePacked(
                '{"name":"zkSnake Score ',
                score,
                '",',
                '"description":"",',
                '"attributes":[{"trait_type":"Score","value":"',
                score,
                ' ETH"},{"trait_type":"Status","value":"Exists"}],',
                '"image":"data:image/svg+xml;base64,'
            )
        );
        uriParts[2] = Base64.encode(
            abi.encodePacked(
                '<svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">',
                '<rect width="1000" height="1000" fill="hsl(',
                score,
                ', 78%, 56%)"/>',
                '<text x="80" y="276" fill="white" font-family="Helvetica" font-size="130" font-weight="bold">',
                "zkSnake",
                "</text>",
                '<text x="80" y="425" fill="white" font-family="Helvetica" font-size="130" font-weight="bold">',
                " score </text>",
                '<text x="80" y="574" fill="white" font-family="Helvetica" font-size="130" font-weight="bold">',
                score,
                "</text>",
                "</svg>"
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
