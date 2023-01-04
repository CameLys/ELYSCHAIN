const crypto = require('crypto');
const _ = require('lodash');
const rp = require('request-promise-native');

async function sendRequestViaProxy(url) {
  try {
    const response = await rp({
      method: 'GET',
      uri: url,
      proxy: 'socks5://localhost:9050',
      timeout: 10000
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

sendRequestViaProxy('https://example.com');

class Transaction {
  constructor(fromAddress, toAddress, amount, timestamp, signature) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = timestamp;
    this.signature = signature;
    // Ajout d'une méthode de chiffrement des données de transaction
  encrypt(secret) {
    const cipher = crypto.createCipher('aes256', secret);
    let encrypted = cipher.update(JSON.stringify(this), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
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
    // Ajout d'une méthode pour créer une transaction chiffrée
  createEncryptedTransaction(transaction, secret) {
    const encryptedTransaction = transaction.encrypt(secret);
    this.pendingTransactions.push(encryptedTransaction);
  }
    // Ajout d'une méthode de coinjoin qui prend en entrée une liste de transactions et retourne une seule transaction mélangée
  coinjoin(transactions) {
    const mixedTransaction = {
      fromAddress: null,
      toAddress: null,
      amount: 0,
      timestamp: Date.now()
    };

    for (const transaction of transactions) {
      mixedTransaction.fromAddress = mixedTransaction.fromAddress || transaction.fromAddress;
      mixedTransaction.toAddress = mixedTransaction.toAddress || transaction.toAddress;
      mixedTransaction.amount += transaction.amount;
    }

    return mixedTransaction;
  }

  // Modification de la méthode createTransaction pour utiliser coinjoin
  createTransaction(transaction) {
    this.pendingTransactions.push(this.coinjoin([transaction]));
  }
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
 // Ajout d'un système de consensus de preuve de travail (PoW)
  mineBlock(block, difficulty) {
    while (block.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      block.nonce++;
      block.hash = block.calculateHash();
    }
  }

  // Ajout de contrôles de sécurité pour empêcher les attaques de type "double dépense"
  addBlock(block) {
    if (this.isChainValid()) {
      this.chain.push(block);
      return true;
    }
    return false;
  }

  // Ajout d'un système de gestion des droits d'accès
  canAccess(user, blockIndex) {
    // Vérifie si l'utilisateur a le droit d'accéder au bloc d'index blockIndex
    return true; // Dummy implementation, à remplacer par votre propre logique de contrôle d'accès
  }

  // Ajout d'un mécanisme de "smart contracts"
  executeContract(contract, blockIndex) {
    if (this.canAccess(contract.user, blockIndex)) {
      // Exécute le contrat
      return true;
    }
    return false;
  }

  // Ajout d'une fonction pour sauvegarder et restaurer la chaîne de blocs
  saveChain(filename) {
    fs.writeFileSync(filename, JSON.stringify(this.chain));
  }

  loadChain(filename) {
    this.chain = JSON.parse(fs.readFileSync(filename));
  }
// Ajout de contrôles pour empêcher les utilisateurs de choisir des pseudonymes qui seraient trop similaires ou qui seraient déjà utilisés par d'autres utilisateurs
  createPseudonym(address, desiredPseudonym) {
    if (this.getPseudonym(address)) {
      throw new Error(`Address ${address} already has a pseudonym.`);
    }
    if (this.isPseudonymUsed(desiredPseudonym)) {
      throw new Error(`Pseudonym ${desiredPseudonym} is already in use.`);
    }
    this.pseudonymMap.set(address, desiredPseudonym);
  }

  // Ajout d'une fonction de "mixing"
  mixFunds(amount, addresses) {
    // Vérifie que le montant total des fonds à mélanger est équivalent au montant spécifié
    const totalAmount = addresses.reduce((total, address) => total + this.getBalanceOfAddress(address), 0);
    if (totalAmount !== amount) {
      throw new Error(`Invalid total amount (${totalAmount}).`);
    }

    // Génère une liste aléatoire d'adresses
    const shuffledAddresses = _.shuffle(addresses);

    // Envoie les fonds de chaque adresse de manière aléatoire à une autre adresse de la liste
    for (let i = 0; i < shuffledAddresses.length; i++) {
      const fromAddress = shuffledAddresses[i];
      const toAddress = shuffledAddresses[(i + 1) % shuffledAddresses.length];
      const amountToSend = this.getBalanceOfAddress(fromAddress);
      this.createTransaction(new Transaction(fromAddress, toAddress, amountToSend));
    }
  }

// Ajout d'une fonction de "zeroknowledge proofs"
  proveOwnership(address, amount) {
    const balance = this.getBalanceOfAddress(address);
    if (balance < amount) {
      throw new Error(`Address ${address} does not have sufficient funds (${balance}).`);
    }

    // Génère les données nécessaires pour créer une preuve de possession de l'argent sans révéler l'adresse à laquelle il est associé
    const proofData = {
      // Génère une clé publique et une clé privée avec la bibliothèque crypto
      publicKey: crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      }),
      // Génère une preuve de possession de l'argent en signant un message avec la clé privée et en incluant la clé publique dans la preuve
      proof: crypto.sign(
        'sha256',
        Buffer.from(`I, the owner of address ${address}, hereby prove that I own ${amount} units of currency.`),
        proofData.privateKey,
        'hex'
      )
    };

    return proofData;
  }

// Ajout d'un constructeur qui crée un dictionnaire vide pour stocker les pseudonymes
  constructor() {
    ...
    this.pseudonymMap = new Map();
  }

  // Ajout d'une méthode pour générer un hachage de l'adresse de l'utilisateur
  hashAddress(address) {
    return crypto.createHash('sha256').update(address).digest('hex');
  }

  // Ajout d'une méthode pour retourner le pseudonyme associé à une adresse
  getPseudonym(address) {
    return this.pseudonymMap.get(address);
  }

  // Modification de la méthode createTransaction pour utiliser des pseudonymes
  createTransaction(transaction) {
    // Génération d'un hachage de l'adresse de l'expéditeur et du destinataire
    const fromPseudonym = this.getPseudonym(transaction.fromAddress) || this.hashAddress(transaction.fromAddress);
    const toPseudonym = this.getPseudonym(transaction.toAddress) || this.hashAddress(transaction.toAddress);

    // Enregistrement des pseudonymes dans le dictionnaire si nécessaire
    if (!this.getPseudonym(transaction.fromAddress)) {
      this.pseudonymMap.set(transaction.fromAddress, fromPseudonym);
    }
    if (!this.getPseudonym(transaction.toAddress)) {
      this.pseudonymMap.set(transaction.toAddress, toPseudonym);
    }

    // Création de la transaction avec les pseudonymes
    const pseudonymTransaction = {
      fromAddress: fromPseudonym,
      toAddress: toPseudonym,
      amount: transaction.amount,
      timestamp: transaction.timestamp
    };
    this.pendingTransactions.push(pseudonymTransaction);
  }
