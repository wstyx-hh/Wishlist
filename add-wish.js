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
        // Remove token contract as we are now using Ethereum for payments
        const balance = await web3.eth.getBalance(account);
        const formattedBalance = web3.utils.fromWei(balance, 'ether');
        console.log('Balance:', formattedBalance);

        document.getElementById('user-balance').innerText = formattedBalance;
        let shortAcc = account.slice(0, 6) + '...' + account.slice(account.length - 4, account.length);
        document.getElementById('user-address').innerText = shortAcc;
    } catch (e) {
        console.log('Error retrieving user data:', e);
    }
}

// Add a new wish
async function addWish(event) {
    event.preventDefault();

    const title = document.getElementById('wish-title').value.trim();
    const description = document.getElementById('wish-description').value.trim();
    const goalAmount = parseFloat(document.getElementById('wish-goal').value);

    if (!title || !description || isNaN(goalAmount) || goalAmount <= 0) {
        alert("Please fill in all fields with valid data.");
        return;
    }

    try {
        await wishlistContract.methods.createWish(title, description, goalAmount).send({
            from: account
        });
        alert("Wish added successfully!");
        document.getElementById('add-wish-form').reset();
    } catch (e) {
        console.error("Error adding wish:", e);
        alert("Error adding wish: " + e.message);
    }
}

// Main function
function main() {
    showUserData();
    document.getElementById('add-wish-form').addEventListener('submit', addWish);
}

document.addEventListener('DOMContentLoaded', connectToWallet);
