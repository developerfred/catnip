# Creating and managing Balancer smart pools

## Current features
Create a new Balancer smart pool
Open an existing Balancer smart pool
Add tokens to the pool and set their balance and weight
Change the balance and weight of tokens in the pool
Remove tokens from the pool
Change the swap fee of the pool
Change the pool from private to public and vice versa
Currently runs in the development environment under ganache-cli

## Planned features
ådd algorithms to automatically adjust tokens, balances, weights, swap fee, etc.
Migrate to Kovan and Mainnet
What features/algorithms would you find valuable

## Video demonstration


## How to install and run the software
Requirements: Git, Truffle, Ganache-CLI

1. Clone the repo:  git clone https://github.com/JerryFireman/.git
2. Navigate to the client subdirectory and install create-react-app dependencies: $ npm install
3. Disable the Metamask extension to save time by avoiding the need to confirm transactions
4. Run tests: $ truffle test ./test/poolmanager.js
5. Run Ganache CLI: $ ganache-cli -l 10000000
6. From the project directory, deploy the contracts to the Ganache blockchain: $ truffle migrate
7. From the client subdirectory, run the React app: $ npm start
8. A new browser window should open "Smart Pool Manager"
9. Click on create pool to create a new smart pool.
10. Table opens with the current status of the pool including token balances minted during startup
11. Select a token, enter an amount and click approve to prepare for adding to the pool.
12. Table updates token with the amount you approved appearing under allowance.
13. Select a token with an allowance, enter an amount less than or equal to that allowance, and a denormalized weight between 1 and 49. Normally the denorm is one half of its weight on the pool. Then click bind to put the token into the pool. Bind returns an error if the selected token is already in the pool.
14. To change the balance or weighting of a token, approve the new balance, enter amount and denorm and click rebind. Rebind returns an error if the selected token is not already in the pool.
15. Select a token that is in the pool and click unbind to remove it from the pool. Unbind returns an error if the selected token is not already in the pool.

## Support by developer
I would be happy to help anyone who needs support installing and running this software. I would also love to get feedback on any problems you have with the software and what features you would like to see added. Please contact me at jerry_fireman@strucinfo.com or leave an issue on Github.

Development plan 
1) record video, test installation and operation
2) social media: github, discord, linkedin, twitter
3) research algorithms
4) write simple algorithm
5) kovan
6) improve error messages and validation

