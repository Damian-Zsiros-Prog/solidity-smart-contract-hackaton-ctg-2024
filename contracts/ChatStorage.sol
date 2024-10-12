// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

contract ChatStorage {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    Message[] private messages;

    event MessageSent(address indexed sender, string content, uint256 timestamp);

    // Función para enviar un mensaje
    function sendMessage(string memory content) public {
        messages.push(Message(msg.sender, content, block.timestamp));
        emit MessageSent(msg.sender, content, block.timestamp);
    }

    // Función para obtener un mensaje por índice
    function getMessage(uint256 index) public view returns (address, string memory, uint256) {
        require(index < messages.length, "El indice esta fuera de rango"); // Mensaje sin tildes
        Message memory message = messages[index];
        return (message.sender, message.content, message.timestamp);
    }

    // Función para contar mensajes
    function getMessageCount() public view returns (uint256) {
        return messages.length;
    }
}
