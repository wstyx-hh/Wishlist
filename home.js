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

            main();
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        alert('MetaMask is not installed!');
    }
}

// Show user data
async function showUserData() {
    if (!wishlistContract || !account) {
        console.log("Contract or account not initialized");
        return;
    }

    try {
        const balance = await web3.eth.getBalance(account);
        const formattedBalance = web3.utils.fromWei(balance, 'ether');
        console.log('Balance:', formattedBalance);

        document.getElementById('user-balance').innerText = formattedBalance;
        let shortAcc = account.slice(0, 6) + '...' + account.slice(account.length - 4, account.length);
        document.getElementById('user-address').innerText = shortAcc;
    } catch (e) {
        console.log('Ошибка вывода данных пользователя:', e);
    }
}

// Get wishes
async function getWishes() {
    if (!wishlistContract || !account) {
        console.log("Contract or account not initialized");
        return;
    }

    try {
        const wishes = await wishlistContract.methods.getWishes().call({ from: account });
        console.log("Все желания:", wishes);

        if (!Array.isArray(wishes)) {
            console.error("Unexpected response format:", wishes);
            return;
        }
        const wishListElement = document.getElementById('wish-list');
        if (wishListElement) {
            wishListElement.innerHTML = '';
        }

        wishes.forEach(wish => {
            if (wish.isFundable) {
                renderWishes({
                    id: wish.id,
                    title: wish.title,
                    description: wish.description,
                    goalAmount: wish.goalAmount,
                    currentAmount: wish.currentAmount,
                    wisher: wish.wisher,
                });
            }
        });
    } catch (e) {
        console.error("Ошибка при выводе желаний", e);
        console.error("Error details:", e.message);
        if (e.data) {
            console.error("Error data:", e.data);
        }
        if (e.stack) {
            console.error("Error stack:", e.stack);
        }
    }
}

// Render wishes
function renderWishes(wish) {
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
        <p><strong>Goal:</strong> ${web3.utils.fromWei(wish.goalAmount, 'ether')} ETH</p>
        <p><strong>Current:</strong> ${web3.utils.fromWei(wish.currentAmount, 'ether')} ETH</p>
        <p><small>By: ${wish.wisher}</small></p>
        <button class="btn btn-custom" data-bs-toggle="modal" data-bs-target="#supportModal" onclick="setSupportWishId(${wish.id})">Support</button>
        <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#refundModal" onclick="setRefundWishId(${wish.id})">Refund</button>
    `;
    wishListElement.appendChild(wishElement);
}

let currentWishId;

function setSupportWishId(wishId) {
    currentWishId = wishId;
}

function setRefundWishId(wishId) {
    currentWishId = wishId;
}

document.getElementById('supportForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const amount = document.getElementById('supportAmount').value;
    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
    }

    try {
        // Fund the wish
        await wishlistContract.methods.fundWish(currentWishId).send({ from: account, value: web3.utils.toWei(amount, 'ether') });
        alert("Wish funded successfully!");
        document.getElementById('supportAmount').value = '';
        const supportModal = bootstrap.Modal.getInstance(document.getElementById('supportModal'));
        supportModal.hide();
        getWishes();
    } catch (e) {
        console.error("Error funding wish:", e);
    }
});

document.getElementById('confirmRefund').addEventListener('click', async function() {
    try {
        await wishlistContract.methods.refundWish(currentWishId).send({ from: account });
        alert("Wish refunded successfully!");
        const refundModal = bootstrap.Modal.getInstance(document.getElementById('refundModal'));
        refundModal.hide();
        getWishes();
    } catch (e) {
        console.error("Error refunding wish:", e);
    }
});

async function fundWish(wishId) {
    const amount = prompt("Enter the amount you want to fund (in ETH):");
    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
    }

    try {
        // Fund the wish
        await wishlistContract.methods.fundWish(wishId).send({ from: account, value: web3.utils.toWei(amount, 'ether') });
        alert("Wish funded successfully!");

        // Refresh the wishes list
        getWishes();
    } catch (e) {
        console.error("Ошибка при финансировании желания", e);
        alert("Error funding wish: " + e.message);
    }
}

async function refundWish(wishId) {
    try {
        await wishlistContract.methods.refundWish(account, wishId).send({ from: account });
        alert("Wish refunded successfully!");

        // Refresh the wishes list
        getWishes();
    } catch (e) {
        console.error("Ошибка при возврате средств", e);
        alert("Error refunding wish: " + e.message);
    }
}

// Main function
function main() {
    showUserData();
    getWishes();
}

document.addEventListener('DOMContentLoaded', connectToWallet);