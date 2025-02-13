async function registerUser(){
    var username = document.getElementById("username").value;
    
    if (!wishlistContract || !account) {
        console.log("Contract or account not initialized");
        return;
    }

    try{
        await wishlistContract.methods.registerUser(username).send({from: account});
        console.log('User registered');
        console.log(await wishlistContract.methods.getUsername(account).call({from: account}));
        window.location.replace('home.html');
    }catch(e){
        console.log("Ошибка при авторизации", e);
        window.location.replace(`/register.html?error=${e.message}`);
    }
}

document.getElementById("register-btn").addEventListener("click", registerUser);