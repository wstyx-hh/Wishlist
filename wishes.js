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

// Get user's wishes
async function getUserWishes() {
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

        // Clear existing wishes
        const wishListElement = document.getElementById('wish-list');
        if (wishListElement) {
            wishListElement.innerHTML = '';
        }

        wishes.forEach(wish => {
            if (wish.wisher.toLowerCase() === account.toLowerCase()) {
                renderUserWishes({
                    id: wish.id,
                    title: wish.title,
                    description: wish.description,
                    goalAmount: wish.goalAmount,
                    currentAmount: wish.currentAmount,
                    isFundable: wish.isFundable,
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

// Render user's wishes
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
        <p><strong>Goal:</strong> ${web3.utils.fromWei(wish.goalAmount, 'ether')} ETH</p>
        <p><strong>Current:</strong> ${web3.utils.fromWei(wish.currentAmount, 'ether')} ETH</p>
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

// Main function
function main() {
    showUserData();
    getUserWishes();
}

document.addEventListener('DOMContentLoaded', connectToWallet);