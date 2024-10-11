// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract APIComunication {
    string public apiUrl; // Almacena la URL de la API externa

    // Evento para notificar que un mensaje ha sido enviado
    event MessageSent(string message, string response);

    // Constructor para inicializar la URL de la API
    constructor(string memory _apiUrl) {
        apiUrl = _apiUrl;
    }

    // Función para enviar un mensaje (simulando la lógica de la API)
    function sendMessage(string memory message) public {
        // Lógica de la API simulado (en una implementación real, este proceso sería manejado off-chain)
        string memory response = string(
            abi.encodePacked("Mensaje enviado: ", message)
        );

        // Emitir un evento con el mensaje y la respuesta
        emit MessageSent(message, response);
    }

    // Función para obtener la URL de la API
    function getApiUrl() public view returns (string memory) {
        return apiUrl;
    }
}
