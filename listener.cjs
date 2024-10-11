require("dotenv").config();
const { ethers } = require("ethers");
const axios = require("axios");

// Configuración de Ethereum
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.METAMASK_PRIVATE_KEY, provider); // Asegúrate de tener una clave privada en tus variables de entorno
let contractAddress = process.env.CONTRACT_ADDRESS;
const apiUrl = process.env.API_URL;

// ABI y bytecode del contrato
const abi = ["event MessageSent(string message)"];
const bytecode = process.env.BYTE_CODE_CONTRACT; // Cambiado a la variable de entorno

async function deployContract() {
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`Contrato desplegado en: ${contract.address}`);
  return contract.address;
}

async function main() {
  let contract;

  // Comprobar si el contrato ya está desplegado
  if (contractAddress) {
    try {
      contract = new ethers.Contract(contractAddress, abi, provider);
      console.log(`Conectado al contrato existente en: ${contractAddress}`);
    } catch (error) {
      console.error("Error al conectar al contrato existente:", error);
    }
  } else {
    // Desplegar el contrato si no está
    contractAddress = await deployContract();
  }

  // Escuchar el evento MessageSent
  contract.on("MessageSent", async (message) => {
    console.log(`Mensaje recibido en el contrato: ${message}`);

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
