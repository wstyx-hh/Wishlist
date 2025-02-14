let web3;
let accounts;
let account;
let tokenContract;
let wishlistContract;


const contractAddress = '0xe18d6eD7FE3Bb51138b2a963B1e1668eF5ab88a5'; // Адрес контракта для wish
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "wishId",
				"type": "uint256"
			}
		],
		"name": "WishClosed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "wishId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "goalAmount",
				"type": "uint256"
			}
		],
		"name": "WishCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "wishId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "WishFunded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "wishId",
				"type": "uint256"
			}
		],
		"name": "closeWish",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "goalAmount",
				"type": "uint256"
			}
		],
		"name": "createWish",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "wishId",
				"type": "uint256"
			}
		],
		"name": "fundWish",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllWishes",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "goalAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "currentAmount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isClosed",
						"type": "bool"
					}
				],
				"internalType": "struct Wishlist.Wish[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "wishCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "wishes",
		"outputs": [
			{
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "goalAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "currentAmount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isClosed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]


async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            console.log("Connected account:", account);

            wishlistContract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Wishlist contract initialized successfully");

            setupEventListeners(); // Вызов после инициализации контракта

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

    const balanceWei = await web3.eth.getBalance(account);
    const balanceEther = web3.utils.fromWei(balanceWei, "ether");
    console.log(`Account balance: ${balanceEther} ETH`);
    document.getElementById("user-address").textContent = account;
    document.getElementById("user-balance").textContent = `${balanceEther} ETH`;
}

// **Создание нового желания (без оплаты)**
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

// **Донат на желание (с оплатой ETH)**
async function fundWish(wishId, amountETH) {
    if (!account) {
        console.error("No account connected.");
        return;
    }

    try {
        const amountWei = web3.utils.toWei(amountETH.toString(), "ether");
        await wishlistContract.methods.fundWish(wishId).send({ from: account, value: amountWei });
        console.log(`Wish #${wishId} funded successfully with ${amountETH} ETH.`);
    } catch (error) {
        console.error("Error funding wish:", error);
    }
}

// **Отслеживание событий контракта**
function setupEventListeners() {
    wishlistContract.events.WishCreated({ fromBlock: "latest" })
        .on("data", event => {
            console.log("Wish Created:", event.returnValues);
        })
        .on("error", console.error);

    wishlistContract.events.WishFunded({ fromBlock: "latest" })
        .on("data", event => {
            console.log("Wish Funded:", event.returnValues);
        })
        .on("error", console.error);

	wishlistContract.events.ItemAdded({ fromBlock: "latest" })
        .on("data", event => {
            console.log("Item Added:", event.returnValues);
        })
        .on("error", console.error);
}

// **Инициализация**
init();
setupEventListeners();