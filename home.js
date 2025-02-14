let web3;
let wishlistContract;
let account;

async function connectToWallet() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            account = accounts[0];
            document.getElementById('user-address').innerText = account;

            // Fetch balance (you can change this to ETH or other tokens if needed)
            const balance = await web3.eth.getBalance(account);
            const balanceInEth = web3.utils.fromWei(balance, 'ether');
            document.getElementById('user-balance').innerText = balanceInEth + ' ETH';

            // Initialize contract (replace with actual contract address and ABI)
            wishlistContract = new web3.eth.Contract(contractABI, contractAddress);
            getWishes();

        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
        }
    } else {
        alert('MetaMask is not installed!');
    }
}

async function getWishes() {
    try {
        const wishes = await wishlistContract.methods.getWishes().call();
        console.log("All wishes:", wishes);

        const wishListElement = document.getElementById('wish-list');
        wishListElement.innerHTML = ''; // Clear any existing wishes

        wishes.forEach(wish => {
            renderWish(wish);
        });
    } catch (error) {
        console.error("Error fetching wishes:", error);
    }
}

function renderWish(wish) {
    const wishListElement = document.getElementById('wish-list');
    const wishCard = document.createElement('div');
    wishCard.classList.add('wish-card');
    wishCard.innerHTML = `
        <h5>${wish.title}</h5>
        <p>${wish.description}</p>
        <p>Goal: ${wish.goalAmount} WSH</p>
        <p>Current: ${wish.currentAmount} WSH</p>
        <button class="btn btn-custom" onclick="openSupportModal(${wish.id})">Support</button>
        <button class="btn btn-danger" onclick="openRefundModal(${wish.id})">Refund</button>
    `;
    wishListElement.appendChild(wishCard);
}

function openSupportModal(wishId) {
    const supportModal = new bootstrap.Modal(document.getElementById('supportModal'));
    supportModal.show();

    document.getElementById('supportForm').onsubmit = async function (event) {
        event.preventDefault();
        const supportAmount = document.getElementById('supportAmount').value;
        donateToWish(wishId, supportAmount);
    };
}

async function donateToWish(wishId, amount) {
    try {
        const amountInWei = web3.utils.toWei(amount, 'ether');
        await wishlistContract.methods.donateToWish(wishId).send({
            from: account,
            value: amountInWei
        });
        alert("Donation successful!");
        getWishes(); // Refresh the wish list
    } catch (error) {
        console.error("Error donating:", error);
        alert("Donation failed!");
    }
}

function openRefundModal(wishId) {
    const refundModal = new bootstrap.Modal(document.getElementById('refundModal'));
    refundModal.show();

    document.getElementById('confirmRefund').onclick = async function () {
        await refundWish(wishId);
        refundModal.hide();
    };
}

async function refundWish(wishId) {
    try {
        await wishlistContract.methods.refundWish(wishId).send({ from: account });
        alert("Refund successful!");
        getWishes(); // Refresh the wish list
    } catch (error) {
        console.error("Error refunding:", error);
        alert("Refund failed!");
    }
}

// Call the connect function when the page is loaded
document.addEventListener('DOMContentLoaded', connectToWallet);
