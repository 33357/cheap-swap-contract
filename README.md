# cheap-swap-contract

## Sample Scripts
### Install dependencies
```bash
yarn
```

### Compile contracts
```bash
yarn build
```

### Hardhat test
```bash
yarn test 
```

### Hardhat solidity-coverage
```bash
yarn test:cov
```

## SOP
### environment
#### bscTest
``` bash
export ENV_FILE='./envs/env.bsc-test'
export NETWORK_ID=97
export WAIT_NUM=1
export GAS_PRICE=10
```

#### bsc
``` bash
export ENV_FILE='./envs/env.bsc'
export NETWORK_ID=56
export WAIT_NUM=3
export GAS_PRICE=5
```

#### rinkeby
``` bash
export ENV_FILE='./envs/env.rinkeby'
export NETWORK_ID=4
export WAIT_NUM=1
export GAS_PRICE=3
```

#### eth
``` bash
export ENV_FILE='./envs/env.eth'
export NETWORK_ID=1
export WAIT_NUM=3
export GAS_PRICE=30
```

### script

#### deploy script
```bash
yarn run env-cmd -f $ENV_FILE yarn run hardhat contract:deploy --contract CheapSwapFactory2 --gas-price $GAS_PRICE --wait-num $WAIT_NUM --network $NETWORK_ID

yarn run env-cmd -f $ENV_FILE yarn run hardhat contract:deploy --contract CheapMintNFT --gas-price $GAS_PRICE --wait-num $WAIT_NUM --network $NETWORK_ID

yarn run env-cmd -f $ENV_FILE yarn run hardhat contract:deploy --contract ERC721_TEST --gas-price $GAS_PRICE --wait-num $WAIT_NUM --network $NETWORK_ID
```

#### verify contract
```bash
yarn run env-cmd -f $ENV_FILE yarn run hardhat contract:verify --contract CheapSwapFactory2 --args [] --network $NETWORK_ID

yarn run env-cmd -f $ENV_FILE yarn run hardhat contract:verify --contract CheapSwapAddress --args [\"0xEA20AAa104d17AdfF2fb719c4d855c21F9c5438e\"] --network $NETWORK_ID

yarn run env-cmd -f $ENV_FILE yarn run hardhat contract:verify --contract CheapMintNFT --args [] --network $NETWORK_ID

yarn run env-cmd -f $ENV_FILE yarn run hardhat contract:verify --contract ERC721_TEST --args [] --network $NETWORK_ID
```