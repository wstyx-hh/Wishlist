// let web3;
// let accounts;
// let account;
// let tokenContract;
// let wishlistContract;
// let isAuthorized = false;

// const tokenAddress = '0x837AcbFe562afaF86f2c6973fAF07b152BBc6a8a';
// const contractAddress = '0xBaFFBE433976A4c57BF70BF72656CE4a989Ca52f';

// const tokenABI = [
// 	{
// 		"inputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "constructor"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "spender",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "allowance",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "needed",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "ERC20InsufficientAllowance",
// 		"type": "error"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "sender",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "balance",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "needed",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "ERC20InsufficientBalance",
// 		"type": "error"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "approver",
// 				"type": "address"
// 			}
// 		],
// 		"name": "ERC20InvalidApprover",
// 		"type": "error"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "receiver",
// 				"type": "address"
// 			}
// 		],
// 		"name": "ERC20InvalidReceiver",
// 		"type": "error"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "sender",
// 				"type": "address"
// 			}
// 		],
// 		"name": "ERC20InvalidSender",
// 		"type": "error"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "spender",
// 				"type": "address"
// 			}
// 		],
// 		"name": "ERC20InvalidSpender",
// 		"type": "error"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": true,
// 				"internalType": "address",
// 				"name": "owner",
// 				"type": "address"
// 			},
// 			{
// 				"indexed": true,
// 				"internalType": "address",
// 				"name": "spender",
// 				"type": "address"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "value",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "Approval",
// 		"type": "event"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": true,
// 				"internalType": "address",
// 				"name": "from",
// 				"type": "address"
// 			},
// 			{
// 				"indexed": true,
// 				"internalType": "address",
// 				"name": "to",
// 				"type": "address"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "value",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "Transfer",
// 		"type": "event"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "owner",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "address",
// 				"name": "spender",
// 				"type": "address"
// 			}
// 		],
// 		"name": "allowance",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "spender",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "value",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "approve",
// 		"outputs": [
// 			{
// 				"internalType": "bool",
// 				"name": "",
// 				"type": "bool"
// 			}
// 		],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "account",
// 				"type": "address"
// 			}
// 		],
// 		"name": "balanceOf",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "decimals",
// 		"outputs": [
// 			{
// 				"internalType": "uint8",
// 				"name": "",
// 				"type": "uint8"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "name",
// 		"outputs": [
// 			{
// 				"internalType": "string",
// 				"name": "",
// 				"type": "string"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "symbol",
// 		"outputs": [
// 			{
// 				"internalType": "string",
// 				"name": "",
// 				"type": "string"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "totalSupply",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "to",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "value",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "transfer",
// 		"outputs": [
// 			{
// 				"internalType": "bool",
// 				"name": "",
// 				"type": "bool"
// 			}
// 		],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "from",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "address",
// 				"name": "to",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "value",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "transferFrom",
// 		"outputs": [
// 			{
// 				"internalType": "bool",
// 				"name": "",
// 				"type": "bool"
// 			}
// 		],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	}
// ];
// const contractABI = [
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "_tokenAddress",
// 				"type": "address"
// 			}
// 		],
// 		"stateMutability": "nonpayable",
// 		"type": "constructor"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": false,
// 				"internalType": "address",
// 				"name": "user",
// 				"type": "address"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "string",
// 				"name": "name",
// 				"type": "string"
// 			}
// 		],
// 		"name": "UserRegistered",
// 		"type": "event"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "id",
// 				"type": "uint256"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "string",
// 				"name": "title",
// 				"type": "string"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "address",
// 				"name": "wisher",
// 				"type": "address"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "currentAmount",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "WishClosed",
// 		"type": "event"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "id",
// 				"type": "uint256"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "string",
// 				"name": "title",
// 				"type": "string"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "string",
// 				"name": "description",
// 				"type": "string"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "goalAmount",
// 				"type": "uint256"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "address",
// 				"name": "wisher",
// 				"type": "address"
// 			}
// 		],
// 		"name": "WishCreated",
// 		"type": "event"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "id",
// 				"type": "uint256"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "string",
// 				"name": "title",
// 				"type": "string"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "currentAmount",
// 				"type": "uint256"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "address",
// 				"name": "wisher",
// 				"type": "address"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "address",
// 				"name": "donater",
// 				"type": "address"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "donationAmount",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "WishFunded",
// 		"type": "event"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "id",
// 				"type": "uint256"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "string",
// 				"name": "title",
// 				"type": "string"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "address",
// 				"name": "wisher",
// 				"type": "address"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "address",
// 				"name": "donater",
// 				"type": "address"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "refundAmount",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "WishRefunded",
// 		"type": "event"
// 	},
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "id",
// 				"type": "uint256"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "string",
// 				"name": "title",
// 				"type": "string"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "address",
// 				"name": "wisher",
// 				"type": "address"
// 			},
// 			{
// 				"indexed": false,
// 				"internalType": "uint256",
// 				"name": "currentAmount",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "WishWithdrawn",
// 		"type": "event"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "account",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "_wishId",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "closeWish",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "account",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "_title",
// 				"type": "string"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "_description",
// 				"type": "string"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "_goalAmount",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "createWish",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "account",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "_wishId",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "_amount",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "fundWish",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "account",
// 				"type": "address"
// 			}
// 		],
// 		"name": "getUsername",
// 		"outputs": [
// 			{
// 				"internalType": "string",
// 				"name": "",
// 				"type": "string"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "account",
// 				"type": "address"
// 			}
// 		],
// 		"name": "getWishes",
// 		"outputs": [
// 			{
// 				"components": [
// 					{
// 						"internalType": "uint256",
// 						"name": "id",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "string",
// 						"name": "title",
// 						"type": "string"
// 					},
// 					{
// 						"internalType": "string",
// 						"name": "description",
// 						"type": "string"
// 					},
// 					{
// 						"internalType": "uint256",
// 						"name": "goalAmount",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "uint256",
// 						"name": "currentAmount",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "address",
// 						"name": "wisher",
// 						"type": "address"
// 					},
// 					{
// 						"internalType": "bool",
// 						"name": "isFundable",
// 						"type": "bool"
// 					}
// 				],
// 				"internalType": "struct Wishlist.WishModel[]",
// 				"name": "",
// 				"type": "tuple[]"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "account",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "address",
// 				"name": "_wisher",
// 				"type": "address"
// 			}
// 		],
// 		"name": "getWishes",
// 		"outputs": [
// 			{
// 				"components": [
// 					{
// 						"internalType": "uint256",
// 						"name": "id",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "string",
// 						"name": "title",
// 						"type": "string"
// 					},
// 					{
// 						"internalType": "string",
// 						"name": "description",
// 						"type": "string"
// 					},
// 					{
// 						"internalType": "uint256",
// 						"name": "goalAmount",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "uint256",
// 						"name": "currentAmount",
// 						"type": "uint256"
// 					},
// 					{
// 						"internalType": "address",
// 						"name": "wisher",
// 						"type": "address"
// 					},
// 					{
// 						"internalType": "bool",
// 						"name": "isFundable",
// 						"type": "bool"
// 					}
// 				],
// 				"internalType": "struct Wishlist.WishModel[]",
// 				"name": "",
// 				"type": "tuple[]"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "account",
// 				"type": "address"
// 			}
// 		],
// 		"name": "isUserAuthorized",
// 		"outputs": [
// 			{
// 				"internalType": "bool",
// 				"name": "",
// 				"type": "bool"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "owner",
// 		"outputs": [
// 			{
// 				"internalType": "address",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "account",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "_id",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "refundWish",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "string",
// 				"name": "_name",
// 				"type": "string"
// 			}
// 		],
// 		"name": "registerUser",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "token",
// 		"outputs": [
// 			{
// 				"internalType": "contract IERC20",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "",
// 				"type": "address"
// 			}
// 		],
// 		"name": "users",
// 		"outputs": [
// 			{
// 				"internalType": "string",
// 				"name": "",
// 				"type": "string"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "wishes",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "id",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "title",
// 				"type": "string"
// 			},
// 			{
// 				"internalType": "string",
// 				"name": "description",
// 				"type": "string"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "goalAmount",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "currentAmount",
// 				"type": "uint256"
// 			},
// 			{
// 				"internalType": "address",
// 				"name": "wisher",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "bool",
// 				"name": "isFundable",
// 				"type": "bool"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "address",
// 				"name": "account",
// 				"type": "address"
// 			},
// 			{
// 				"internalType": "uint256",
// 				"name": "_id",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "withdrawFunds",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	}
// ];

// // Подключение контрактов
// async function connectToContracts(){
//     tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
//     wishlistContract = new web3.eth.Contract(contractABI, contractAddress);
//     console.log(tokenContract, wishlistContract);
// }


// // Подключение к MetaMask
// async function connectToWallet(){
//     if(typeof window.ethereum !== 'undefined'){
//         web3 = new Web3(window.ethereum);
//         await window.ethereum.request({method: 'eth_requestAccounts'});
//         accounts = await web3.eth.getAccounts();
//         account = accounts[0];
//         tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
//         wishlistContract = new web3.eth.Contract(contractABI, contractAddress);
//         console.log(tokenContract, wishlistContract);
//         main();

//         // isAuthorized = await wishlistContract.methods.isUserAuthorized(account).call();

//         // if(isAuthorized){
//         //     console.log('Connected to wallet');
//         //     if(window.location.pathname === '/auth.html'){
//         //         window.location.replace('home.html');
//         //     }
//         //     main();
//         // }else{
//         //     console.log('User not authorized');
//         //     if(window.location.pathname !== '/auth.html'){
//         //         window.location.replace('auth.html');
//         //     }
//         // }
//     }else{
//         alert('MetaMask is not installed!');
//     }
// }


// // Показывает адрес юзера и его баланс
// async function showUserData(){
//     try{
//         const balance = await tokenContract.methods.balanceOf(account).call();
//         const formattedBalance = balance;
//         console.log('Balance:', formattedBalance);

//         document.getElementById('user-balance').innerText = formattedBalance;
//         let shortAcc = account.slice(0, 6) + '...' + account.slice(account.length - 4, account.length);
//         document.getElementById('user-address').innerText = shortAcc;

//     }catch(e){
//         console.log('Ошибка вывода данных пользователя:', e);
//     }
// }

// function main(){
//     showUserData();
// }

// document.addEventListener('DOMContentLoaded', connectToWallet);