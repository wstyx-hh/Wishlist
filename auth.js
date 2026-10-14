// Authorization = connecting a MetaMask account. The wallet address is the user's identity,
// so there is no separate on-chain registration or username.
async function authorize(event) {
    event.preventDefault();

    const connected = (await walletReady) || (await init());
    if (connected) {
        window.location.href = 'home.html';
    }
}

document.getElementById('auth-form').addEventListener('submit', authorize);
