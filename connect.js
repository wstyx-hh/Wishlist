let web3;
let accounts;
let account;
let tokenContract;
let wishlistContract;


const contractAddress = '0x5d41B209Edf4e7d55d26D3ba8a02B63582ed4CE2'; // Адрес контракта для wish
const contractABI = [
	{
		"inputs": [
			{ "internalType": "string", "name": "_title", "type": "string" },
			{ "internalType": "string", "name": "_description", "type": "string" },
			{ "internalType": "uint256", "name": "_goalAmount", "type": "uint256" }
		],
		"name": "createWish",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "uint256", "name": "_wishId", "type": "uint256" }
		],
		"name": "fundWish",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getWishes",
		"outputs": [
			{
				"components": [
					{ "internalType": "uint256", "name": "id", "type": "uint256" },
					{ "internalType": "string", "name": "title", "type": "string" },
					{ "internalType": "string", "name": "description", "type": "string" },
					{ "internalType": "uint256", "name": "goalAmount", "type": "uint256" },
					{ "internalType": "uint256", "name": "currentAmount", "type": "uint256" },
					{ "internalType": "address payable", "name": "wisher", "type": "address" },
					{ "internalType": "bool", "name": "isFundable", "type": "bool" }
				],
				"internalType": "tuple[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

async function init() {
	if (window.ethereum) {
		web3 = new Web3(window.ethereum);

		try {
			// Запрашиваем доступ к аккаунтам через eth_requestAccounts
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			account = accounts[0]; // Получаем первый аккаунт
			console.log("Connected account:", account);

			// Инициализация контракта с использованием Web3
			tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
			wishlistContract = new web3.eth.Contract(contractABI, contractAddress);
			console.log("Contracts initialized successfully");

			// Показать аккаунт и баланс
			updateAccountInfo();
		} catch (error) {
			console.error("Error connecting to MetaMask:", error);
		}
	} else {
		console.error("Ethereum provider not detected.");
	}
}

async function updateAccountInfo() {
	if (!account) {
		console.error("No account connected.");
		return;
	}

	// Получение баланса токенов (при наличии)
	const balance = await tokenContract.methods.balanceOf(account).call();
	console.log(`Account balance: ${balance}`);
	document.getElementById("user-address").textContent = account;
	document.getElementById("user-balance").textContent = `${balance} WSH`;
}

// Создание нового желания
async function createWish(title, description, goalAmount) {
	if (!account) {
		console.error("No account connected.");
		return;
	}

	try {
		await wishlistContract.methods.createWish(title, description, goalAmount).send({ from: account });
		console.log("Wish created successfully.");
	} catch (error) {
		console.error("Error creating wish:", error);
	}
}

// Финансирование желания
async function fundWish(wishId, amount) {
	if (!account) {
		console.error("No account connected.");
		return;
	}

	try {
		await wishlistContract.methods.fundWish(wishId).send({ from: account, value: web3.utils.toWei(amount, "ether") });
		console.log("Wish funded successfully.");
	} catch (error) {
		console.error("Error funding wish:", error);
	}
}

// Отслеживание событий контракта
function setupEventListeners() {
	wishlistContract.events.WishCreated({ fromBlock: 0 })
		.on('data', event => {
			console.log("Wish Created:", event.returnValues);
		})
		.on('error', console.error);

	wishlistContract.events.WishFunded({ fromBlock: 0 })
		.on('data', event => {
			console.log("Wish Funded:", event.returnValues);
		})
		.on('error', console.error);
}

// Инициализация
init();
setupEventListeners();
