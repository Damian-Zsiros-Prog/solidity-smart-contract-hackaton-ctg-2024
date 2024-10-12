import { expect } from "chai";
import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("ChatStorage", function () {
  let chatStorage: any;

  beforeEach(async function () {
    const ChatStorage = await ethers.getContractFactory("ChatStorage");
    chatStorage = await ChatStorage.deploy();
  });

  describe("Deployment", function () {
    it("Should deploy without any messages initially", async function () {
      expect(await chatStorage.getMessageCount()).to.equal(0);
    });
  });

  describe("sendMessage", function () {
    it("Should allow a user to send a message", async function () {
      const message = "Hello, world!";
      await chatStorage.sendMessage(message);

      const count = await chatStorage.getMessageCount();
      expect(count).to.equal(1);
    });

    it("Should emit MessageSent event when a message is sent", async function () {
      const message = "Hello, world!";
      await expect(chatStorage.sendMessage(message))
        .to.emit(chatStorage, "MessageSent")
        .withArgs(
          await (await ethers.provider.getSigner()).getAddress(),
          message,
          anyValue // Asegúrate de importar anyValue correctamente
        );
    });
  });

  describe("getMessage", function () {
    it("Should return the correct message data", async function () {
      const message = "Hello, world!";
      await chatStorage.sendMessage(message);
      const count = await chatStorage.getMessageCount();
      const [sender, content, timestamp] = await chatStorage.getMessage(0);

      expect(sender).to.equal(
        await (await ethers.provider.getSigner()).getAddress()
      );
      expect(content).to.equal(message);
    });

    it("Should revert if trying to get a message that doesn't exist", async function () {
      await expect(chatStorage.getMessage(0)).to.be.revertedWith(
        "El indice esta fuera de rango" // Ajusta el mensaje sin acento
      );
    });
  });

  describe("getMessageCount", function () {
    it("Should return the correct message count", async function () {
      expect(await chatStorage.getMessageCount()).to.equal(0);
      await chatStorage.sendMessage("Hello, world!");
      expect(await chatStorage.getMessageCount()).to.equal(1);
    });
  });
});
