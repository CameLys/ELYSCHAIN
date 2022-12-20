const crypto = require('crypto');

class Block {
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256').update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).digest('hex');
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pseudonymMap = new Map();
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), 'Genesis block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  // Mélanger les transactions en utilisant un algorithme de mélange de transactions
  mixTransactions() {
    // TODO: implémenter l'algorithme de mélange de transactions
  }

  // Ajouter un nouveau pseudonyme à la carte des pseudonymes
  addPseudonym(publicAddress, pseudonym) {
    this.pseudonymMap.set(publicAddress, pseudonym);
  }

  // Obtenir le pseudonyme associé à une adresse publique
  getPseudonym(publicAddress) {
    return this.pseudonymMap.get(publicAddress);
  }
}