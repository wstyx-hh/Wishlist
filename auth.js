async function registerUser() {
    var username = document.getElementById("username").value;

    if (!wishlistContract || !account) {
        console.log("Contract or account not initialized");
        return;
    }

    try {
        // Register user with a payment in Ether (if necessary for the registration)
        const registrationFee = web3.utils.toWei("0.01", "ether");  // Example fee, adjust accordingly
        await wishlistContract.methods.registerUser(username).send({
            from: account,
            value: registrationFee // Payment in Ether for the registration
        });

        console.log('User registered');
        console.log(await wishlistContract.methods.getUsername(account).call({ from: account }));
        window.location.replace('home.html');
    } catch (e) {
        console.log("Error during registration", e);
        window.location.replace(`/register.html?error=${e.message}`);
    }
}

document.getElementById("register-btn").addEventListener("click", registerUser);
