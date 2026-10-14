# WishFund — Wishlist on Ethereum

A small crowdfunding dApp: a user creates a wish with a goal in ETH, other users fund it,
and only the wish's owner can withdraw the money raised for that wish.

- **Contract** — [`contracts/Wishlist.sol`](contracts/Wishlist.sol) (Solidity 0.8.20, Hardhat)
- **Frontend** — plain HTML/JS pages with [web3.js](https://web3js.org) and MetaMask
- **Tests** — [`test/Wishlist.js`](test/Wishlist.js) (Hardhat + chai)

Originally a team study project (February 2025), later cleaned up: access control,
safe withdrawal, consistent ETH units, XSS-safe rendering, tests.

## How it works

| Function | Who | What |
|---|---|---|
| `createWish(title, description, goalAmount)` | anyone | creates a wish; `msg.sender` becomes its owner; `goalAmount` is in wei |
| `fundWish(wishId)` *(payable)* | anyone | adds ETH to an open wish; the wish closes automatically when the goal is reached |
| `closeWish(wishId)` | wish owner | stops accepting funds |
| `withdrawWish(wishId)` | wish owner | sends that wish's funds to the owner, once; also closes the wish |
| `getWishes(offset, limit)` / `getAllWishes()` | view | read wishes (paginated / all) |

Events: `WishCreated(wishId, owner, …)`, `WishFunded(wishId, funder, amount)`,
`WishClosed(wishId)`, `FundsWithdrawn(wishId, owner, amount)` — `wishId` and addresses are
`indexed`, so they can be filtered by an indexer or `eth_getLogs`.

Withdrawal follows checks-effects-interactions: the wish is marked as withdrawn before Ether
is sent with `call`, so a re-entrant call cannot withdraw twice.

Authorization on the frontend is just connecting a MetaMask account: the wallet address is the
user's identity, there is no on-chain username.

### Known limitations

- `getAllWishes()` loops over every wish. It is a free `eth_call`, but node RPC limits will be hit
  once there are thousands of wishes — use `getWishes(offset, limit)` or index the events instead.
- There are no refunds: if a goal is not reached, the owner can still withdraw what was raised.
- Title and description are stored on-chain as strings, which is expensive on mainnet.

## Project structure

```
contracts/Wishlist.sol   smart contract
test/Wishlist.js         contract tests
deploy.js                deploys the contract and writes config.js
config.js                contract address + ABI for the frontend (generated, do not edit)
connect.js               shared MetaMask/web3 setup for all pages
home.html / home.js      board of open wishes, donations
wishes.html / wishes.js  "my wishes": close and withdraw
add-wish.html / .js      create a wish
auth.html / auth.js      connect MetaMask
```

## Running locally

Requirements: Node.js 18+, MetaMask in the browser.

```bash
npm install
npx hardhat test          # run the tests
npx hardhat node          # local chain on http://127.0.0.1:8545, chainId 31337 (keep it running)
npm run deploy:local      # in a second terminal: deploy and update config.js
npx serve .               # serve the frontend, then open the printed URL + /home.html
```

In MetaMask add a network: RPC `http://127.0.0.1:8545`, chain ID `31337`, currency `ETH`,
and import one of the test private keys printed by `npx hardhat node`. These keys are public
test keys — never send real funds to them.

After restarting `npx hardhat node`, deploy again and, in MetaMask, clear the account's activity
(Settings → Advanced → Clear activity tab data), otherwise nonces get out of sync.

### Using Ganache instead

Copy `.env.example` to `.env`, put the Ganache RPC URL and test account keys there, then run
`npm run deploy:ganache`. `.env` is git-ignored.
