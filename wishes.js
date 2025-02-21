//Global Variables
let web3;
let account;
let wishlistContract;
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

const contractAddress = '0xe18d6eD7FE3Bb51138b2a963B1e1668eF5ab88a5'; // Replace with your contract's address

// Connect to MetaMask
async function connectToWallet() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            account = accounts[0];
            console.log('Connected account:', account);

            wishlistContract = new web3.eth.Contract(contractABI, contractAddress);
            console.log('Contract initialized:', wishlistContract);

            // Fetch and display wishes after connecting wallet
            getUserWishes();
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        alert('MetaMask is not installed!');
    }
}

// Get user's wishes
async function getUserWishes() {
    try {
        const wishes = await wishlistContract.methods.getAllWishes().call();
        console.log("User's Wishes:", wishes);

        if (!Array.isArray(wishes)) {
            console.error("Unexpected response format:", wishes);
            return;
        }

        const wishListElement = document.getElementById('wish-list');
        wishListElement.innerHTML = ''; // Очистка списка

        wishes.forEach((wish, index) => {
            if (!wish.isClosed) {
                renderUserWishes({
                    id: index + 1,
                    title: wish.title,
                    description: wish.description,
                    goalAmount: web3.utils.fromWei(wish.goalAmount, "ether"),
                    currentAmount: web3.utils.fromWei(wish.currentAmount, "ether"),
                    isFundable: !wish.isClosed
                });
            }
        });
    } catch (e) {
        console.error("Error getting user's wishes:", e);
    }
}
// async function getUserWishes() {
//     if (!wishlistContract || !account) {
//         console.log("Contract or account not initialized");
//         return;
//     }

//     try {
//         const wishes = await wishlistContract.methods.getWishes().call({ from: account });
//         console.log("User's Wishes:", wishes);

//         if (!Array.isArray(wishes)) {
//             console.error("Unexpected response format:", wishes);
//             return;
//         }

//         const wishListElement = document.getElementById('wish-list');
//         if (wishListElement) {
//             wishListElement.innerHTML = ''; // Clear the existing list
//         }

//         wishes.forEach(wish => {
//             if (wish.wisher.toLowerCase() === account.toLowerCase()) {
//                 renderUserWishes({
//                     id: wish.id,
//                     title: wish.title,
//                     description: wish.description,
//                     goalAmount: wish.goalAmount,
//                     currentAmount: wish.currentAmount,
//                     isFundable: wish.isFundable,
//                 });
//             }
//         });
//     } catch (e) {
//         console.error("Error getting user's wishes:", e);
//     }
// }

// Render user's wishes to the HTML
function renderUserWishes(wish) {
    const wishListElement = document.getElementById('wish-list');
    if (!wishListElement) {
        console.error("Element with ID 'wish-list' not found");
        return;
    }

    const wishElement = document.createElement('div');
    wishElement.classList.add('wish-item');
    wishElement.innerHTML = `
        <h4>${wish.title}</h4>
        <p>${wish.description}</p>
        <p><strong>Goal:</strong> ${wish.goalAmount} ETH</p>
        <p><strong>Current:</strong> ${wish.currentAmount} ETH</p>
        <button class="btn btn-warning" onclick="closeWish(${wish.id})">Close Fund</button>
        <button class="btn btn-success" onclick="withdrawFunds(${wish.id})">Withdraw Funds</button>
    `;
    wishListElement.appendChild(wishElement);
}

// Close wish fund
async function closeWish(wishId) {
    try {
        await wishlistContract.methods.closeWish(wishId).send({ from: account });
        alert("Wish fund closed successfully!");
        getUserWishes();
    } catch (e) {
        console.error("Error closing wish fund:", e);
        alert("Error closing wish fund: " + e.message);
    }
}

// Withdraw funds from wish
async function withdrawFunds(wishId) {
    try {
        await wishlistContract.methods.withdrawFunds(wishId).send({ from: account });
        alert("Funds withdrawn successfully!");
        getUserWishes();
    } catch (e) {
        console.error("Error withdrawing funds:", e);
        alert("Error withdrawing funds: " + e.message);
    }
}

// Support the wish with Ethereum payment
document.getElementById('supportForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const amount = document.getElementById('supportAmount').value;
    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
    }

    try {
        // Convert amount to Wei (ETH is in Wei internally)
        const amountInWei = web3.utils.toWei(amount, 'ether');

        // Send Ethereum transaction to fund the wish
        await wishlistContract.methods.fundWish(currentWishId).send({
            from: account,
            value: amountInWei // Amount of ETH to be sent
        });
        alert("Wish funded successfully!");
        document.getElementById('supportAmount').value = '';
        const supportModal = bootstrap.Modal.getInstance(document.getElementById('supportModal'));
        supportModal.hide();
        getUserWishes(); // Refresh the user's wishes list
    } catch (e) {
        console.error("Error funding wish:", e);
    }
});

// Refund the funds from the wish
document.getElementById('confirmRefund').addEventListener('click', async function() {
    try {
        await wishlistContract.methods.refundWish(currentWishId).send({ from: account });
        alert("Wish refunded successfully!");
        const refundModal = bootstrap.Modal.getInstance(document.getElementById('refundModal'));
        refundModal.hide();
        getUserWishes(); // Refresh the user's wishes list
    } catch (e) {
        console.error("Error refunding wish:", e);
    }
});

// Set support wish ID
let currentWishId;
function setSupportWishId(wishId) {
    currentWishId = wishId;
}

// Set refund wish ID
function setRefundWishId(wishId) {
    currentWishId = wishId;
}

// Main function to run when the page is loaded
function main() {
    showUserData();
    getUserWishes();
}

// Display user data (optional)
async function showUserData() {
    if (!wishlistContract || !account) {
        console.log("Contract or account not initialized");
        return;
    }

    try {
        let shortAcc = account.slice(0, 6) + '...' + account.slice(account.length - 4);
        document.getElementById('user-address').innerText = shortAcc;
    } catch (e) {
        console.log('Error displaying user data:', e);
    }
}

// Initialize the connection when the page is loaded
document.addEventListener('DOMContentLoaded', connectToWallet);
