require("dotenv").config();
const { ethers } = require("ethers");
const axios = require("axios");

// Configuración de Ethereum (usando Ganache)
const provider = new ethers.JsonRpcProvider(process.env.GANACHE_URL); // Cambiado a la URL de Ganache
const wallet = new ethers.Wallet(process.env.METAMASK_PRIVATE_KEY, provider); // Asegúrate de tener una clave privada en tus variables de entorno
let contractAddress = process.env.CONTRACT_ADDRESS;
const apiUrl = process.env.API_URL;

// ABI del contrato
const abi = [
  "event MessageSent(string indexed message, address indexed sender, uint256 indexed timestamp)", // Añadido indexed para sender y timestamp
  "function sendMessage(string memory message) public", // Añadido método para enviar mensajes
];

// Ajusta el bytecode según sea necesario, o elimínalo si no lo usas
const bytecode = process.env.BYTE_CODE_CONTRACT; // Cambiado a la variable de entorno

async function deployContract() {
  try {
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy();
    console.log(`Contrato desplegado en: ${contract.address}`);
    return contract.address;
  } catch (error) {
    if (error instanceof Error) console.log({ error });
  }
}

async function main() {
  let contract;

  // Comprobar si el contrato ya está desplegado
  if (contractAddress && contractAddress.length > 0) {
    try {
      contract = new ethers.Contract(contractAddress, abi, provider);
      console.log(`Conectado al contrato existente en: ${contractAddress}`);
    } catch (error) {
      console.error("Error al conectar al contrato existente:", error);
    }
  } else {
    // Desplegar el contrato si no está
    contractAddress = await deployContract();
    contract = new ethers.Contract(contractAddress, abi, provider); // Crear instancia del contrato
  }

  // Escuchar el evento MessageSent
  contract.on("MessageSent", async (message, sender, timestamp) => {
    console.log(
      `Mensaje recibido en el contrato: ${message} desde: ${sender} a las: ${timestamp}`
    );

    try {
      const response = await axios.post(apiUrl, { message });
      console.log("Respuesta de la API:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error al llamar a la API:", error.message);
      } else {
        console.error("Error desconocido:", error);
      }
    }
  });

  console.log("Escuchando eventos...");
}

// Iniciar el script
main().catch(console.error);
