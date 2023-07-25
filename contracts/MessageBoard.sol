// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MessageBoard is ERC721Enumerable, Ownable {
    struct Message {
        address sender;
        string content;
        uint256 likes;
    }

    Message[] public messages;

    event MessageSent(address indexed sender, string content);
    event MessageLiked(uint256 indexed messageId, address indexed liker);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function sendMessage(string memory _content) public {
        require(bytes(_content).length > 0, "Message content can't be empty");

        messages.push(Message({
            sender: msg.sender,
            content: _content,
            likes: 0
        }));

        emit MessageSent(msg.sender, _content);
    }

    function likeMessage(uint256 _messageId) public {
        require(_messageId < messages.length, "Invalid message ID");

        messages[_messageId].likes++;

        emit MessageLiked(_messageId, msg.sender);

        if (messages[_messageId].likes >= 5) {
            _mintToken(messages[_messageId].sender);
        }
    }

    function getMessageCount() public view returns (uint256) {
        return messages.length;
    }

    function getMessage(uint256 _messageId) public view returns (
        address sender,
        string memory content,
        uint256 likes
    ) {
        require(_messageId < messages.length, "Invalid message ID");

        Message storage message = messages[_messageId];
        sender = message.sender;
        content = message.content;
        likes = message.likes;

        // Return statement for message details
        return (sender, content, likes);
    }

    // Internal function to mint an ERC-721 token
    function _mintToken(address _to) internal {
        uint256 tokenId = totalSupply();
        _mint(_to, tokenId);
    }
}
