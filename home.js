async function getWishes() {
    try {
        const wishes = await wishlistContract.methods.getAllWishes().call();
        console.log("All wishes:", wishes);

        const wishListElement = document.getElementById('wish-list');
        wishListElement.innerHTML = ''; // Clear any existing wishes

        wishes.filter(wish => !wish.isClosed).forEach(wish => {
            renderWish(wish);
        });
    } catch (error) {
        console.error("Error fetching wishes:", error);
    }
}

// Creates an element with text content (never innerHTML: wish data comes from any user)
function createTextElement(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
}

function renderWish(wish) {
    const wishListElement = document.getElementById('wish-list');
    const wishCard = document.createElement('div');
    wishCard.classList.add('wish-card');

    const supportButton = createTextElement('button', 'Support');
    supportButton.className = 'btn btn-custom';
    supportButton.addEventListener('click', () => openSupportModal(wish.id));

    wishCard.append(
        createTextElement('h5', wish.title),
        createTextElement('p', wish.description),
        createTextElement('p', `Goal: ${web3.utils.fromWei(wish.goalAmount, 'ether')} ETH`),
        createTextElement('p', `Current: ${web3.utils.fromWei(wish.currentAmount, 'ether')} ETH`),
        supportButton
    );
    wishListElement.appendChild(wishCard);
}

function openSupportModal(wishId) {
    const supportModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('supportModal'));
    supportModal.show();

    document.getElementById('supportForm').onsubmit = async function (event) {
        event.preventDefault();
        const supportAmount = document.getElementById('supportAmount').value.trim();
        if (await donateToWish(wishId, supportAmount)) {
            document.getElementById('supportForm').reset();
            supportModal.hide();
        }
    };
}

async function donateToWish(wishId, amount) {
    if (!amount || Number(amount) <= 0) {
        alert("Invalid amount");
        return false;
    }

    try {
        const amountInWei = web3.utils.toWei(amount, 'ether');
        await wishlistContract.methods.fundWish(wishId).send({
            from: account,
            value: amountInWei
        });
        alert("Donation successful!");
        updateAccountInfo();
        getWishes(); // Refresh the wish list
        return true;
    } catch (error) {
        console.error("Error donating:", error);
        alert("Donation failed!");
        return false;
    }
}

walletReady.then(connected => {
    if (connected) getWishes();
});
