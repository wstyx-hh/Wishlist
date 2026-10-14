// Get user's wishes (only the ones created from the connected account)
async function getUserWishes() {
    try {
        const wishes = await wishlistContract.methods.getAllWishes().call();
        console.log("All wishes:", wishes);

        if (!Array.isArray(wishes)) {
            console.error("Unexpected response format:", wishes);
            return;
        }

        const wishListElement = document.getElementById('wish-list');
        wishListElement.innerHTML = ''; // Очистка списка

        wishes
            .filter(wish => wish.owner.toLowerCase() === account.toLowerCase())
            .forEach(wish => {
                renderUserWishes({
                    id: wish.id,
                    title: wish.title,
                    description: wish.description,
                    goalAmount: web3.utils.fromWei(wish.goalAmount, "ether"),
                    currentAmount: web3.utils.fromWei(wish.currentAmount, "ether"),
                    isClosed: wish.isClosed,
                    canWithdraw: !wish.isWithdrawn && wish.currentAmount > 0n
                });
            });
    } catch (e) {
        console.error("Error getting user's wishes:", e);
    }
}

// Creates an element with text content (never innerHTML: wish data comes from any user)
function createTextElement(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
}

function createButton(text, className, onClick) {
    const button = createTextElement('button', text);
    button.className = className;
    button.addEventListener('click', onClick);
    return button;
}

// Render user's wishes to the HTML
function renderUserWishes(wish) {
    const wishListElement = document.getElementById('wish-list');
    if (!wishListElement) {
        console.error("Element with ID 'wish-list' not found");
        return;
    }

    const wishElement = document.createElement('div');
    wishElement.classList.add('wish-item');
    wishElement.append(
        createTextElement('h4', wish.title),
        createTextElement('p', wish.description),
        createTextElement('p', `Goal: ${wish.goalAmount} ETH`),
        createTextElement('p', `Current: ${wish.currentAmount} ETH`),
        createTextElement('p', `Status: ${wish.isClosed ? 'closed' : 'open'}`)
    );
    if (!wish.isClosed) {
        wishElement.append(createButton('Close Fund', 'btn btn-warning', () => closeWish(wish.id)));
    }
    if (wish.canWithdraw) {
        wishElement.append(createButton('Withdraw Funds', 'btn btn-success', () => withdrawFunds(wish.id)));
    }
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

// Withdraw funds from wish (also closes it)
async function withdrawFunds(wishId) {
    try {
        await wishlistContract.methods.withdrawWish(wishId).send({ from: account });
        alert("Funds withdrawn successfully!");
        updateAccountInfo();
        getUserWishes();
    } catch (e) {
        console.error("Error withdrawing funds:", e);
        alert("Error withdrawing funds: " + e.message);
    }
}

// Initialize the page when the wallet is connected
walletReady.then(connected => {
    if (connected) getUserWishes();
});
