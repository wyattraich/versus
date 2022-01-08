# versus

## Dependencies
Vscode (remote containers extension)
docker desktop

## Setup
- clone repo
- open versus folder in vscode
- make sure remote containers extension is running
- cd into versus run '''shell docker-compose up '''
- take note of output for ganache accounts
- click on green bar in bottom left corner of vscode and search/select Remote Containers: reopen in container

## Run
- '''shell npm install ''' to install all node dependencies
- '''shell npm run start ''' to start front end app
- '''shell truffle migrate --reset ''' to deploy contract to local blockchain

## Test
- '''shell truffle test ''' to test solidity smart contract