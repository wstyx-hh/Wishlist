// Add a new wish
async function addWish(event) {
    event.preventDefault();

    const title = document.getElementById('wish-title').value.trim();
    const description = document.getElementById('wish-description').value.trim();
    // Keep the value as a string: toWei on a float would lose precision
    const goalEth = document.getElementById('wish-goal').value.trim();

    if (!title || !description || !goalEth || Number(goalEth) <= 0) {
        alert("Please fill in all fields with valid data.");
        return;
    }

    try {
        const goalWei = web3.utils.toWei(goalEth, 'ether');
        await wishlistContract.methods.createWish(title, description, goalWei).send({
            from: account
        });
        alert("Wish added successfully!");
        document.getElementById('add-wish-form').reset();
        updateAccountInfo();
    } catch (e) {
        console.error("Error adding wish:", e);
        alert("Error adding wish: " + e.message);
    }
}

// Main function
function main() {
    document.getElementById('add-wish-form').addEventListener('submit', addWish);
}

walletReady.then(connected => {
    if (connected) main();
});
