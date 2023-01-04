const crypto = require('crypto');
const _ = require('lodash');

class Transaction {
  constructor(fromAddress, toAddress, amount, timestamp, signature) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = timestamp;
    this.signature = signature;
  }

 signTransaction(privateKey) {
  const data = this.fromAddress + this.toAddress + this.amount + this.timestamp;
  this.signature = crypto.sign('sha256', Buffer.from(data), privateKey).toString('hex');
}


  verifySignature(publicKey) {
  const data = this.fromAddress + this.toAddress + this.amount + this.timestamp;
  return crypto.verify('sha256', Buffer.from(data), publicKey, this.signature);
}


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
  if (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
    this.nonce++;
    this.hash = this.calculateHash();
    this.mineBlock(difficulty);
   }
 }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
    this.pseudonymMap = new Map();
    ...
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardsAddress) {
    const block = new Block(this.chain.length, Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
  const fromPseudonym = this.getPseudonym(transaction.fromAddress);
  const toPseudonym = this.getPseudonym(transaction.toAddress);

  transaction.fromAddress = fromPseudonym || transaction.fromAddress;
  transaction.toAddress = toPseudonym || transaction.toAddress;

  this.pendingTransactions.push(transaction);
}


  getBalanceOfAddress(address) {
  const pseudonym = this.getPseudonym(address);
  let balance = 0;

  for (const block of this.chain) {
    for (const trans of block.transactions) {
      if (trans.fromAddress === address || trans.fromAddress === pseudonym) {
        balance -= trans.amount;
      }

      if (trans.toAddress === address || trans.toAddress === pseudonym) {
        balance += trans.amount;
      }
    }
  }

  return balance;
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
}

module.exports = {
  Blockchain,
  Transaction
};


  // Mélanger les transactions en utilisant un algorithme de mélange de transactions
  mixTransactions() {
  this.pendingTransactions = _.shuffle(this.pendingTransactions);
}

  // Ajouter un nouveau pseudonyme à la carte des pseudonymes
  addPseudonym(publicAddress, pseudonym) {
    this.pseudonymMap.set(publicAddress, pseudonym);
  }

  // Obtenir le pseudonyme associé à une adresse publique
  getPseudonym(address) {
    let pseudonym = this.pseudonymMap.get(address);
    if (!pseudonym) {
      pseudonym = this.generatePseudonym();
      this.pseudonymMap.set(address, pseudonym);
    }
    return pseudonym;
  }
// Ajout d'une fonction pour vérifier si un pseudonyme est déjà utilisé ou non
  isPseudonymUsed(pseudonym) {
    return this.pseudonymMap.has(pseudonym);
  }

  // Ajout d'une fonction pour récupérer les transactions associées à une adresse ou à un pseudonyme donné
  getTransactionsForAddress(address) {
    const pseudonym = this.getPseudonym(address);
    const transactions = [];

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address || trans.toAddress === address || trans.fromAddress === pseudonym || trans.toAddress === pseudonym) {
          transactions.push(trans);
        }
      }
    }

    return transactions;
  }

  // Ajout d'une fonction pour vérifier que les transactions en attente respectent certaines règles de base
  validatePendingTransactions() {
    for (const trans of this.pendingTransactions) {
      const balance = this.getBalanceOfAddress(trans.fromAddress);
      if (trans.amount > balance) {
        throw new Error(`Transaction error: address ${trans.fromAddress} has insufficient funds (${balance}).`);
      }
    }
  }

  // Ajout d'une fonction pour visualiser la chaîne de blocs sous forme de graphique
  renderChain() {
    let graph = "";
    for (const block of this.chain) {
      graph += `Block ${block.index}:\n`;
      graph += `  Previous hash: ${block.previousHash}\n`;
      graph += `  Hash: ${block.hash}\n`;
      graph += `  Timestamp: ${block.timestamp}\n`;
      graph += `  Data:\n`;
      for (const trans of block.transactions) {
        graph += `    - From: ${trans.fromAddress}\n`;
        graph += `      To: ${trans.toAddress}\n`;
        graph += `      Amount: ${trans.amount}\n`;
        graph += `      Timestamp: ${trans.timestamp}\n`;
        graph += `      Signature: ${trans.signature}\n`;
      }
    }
    return graph;
  }
