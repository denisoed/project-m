# Blueprint Project

## Project structure

- `contracts` - source code of all smart contracts of the project and their dependencies.
- `wrappers` - wrapper classes (implementing `Contract` from ton-core) for contracts, including any [de]serialisation primitives and compilation functions.
- `tests` - tests for contracts.
- `scripts` - scripts used in the project, mainly deployment scripts.

## Design development

### Build

`npx blueprint build` or `yarn blueprint build`

### Testing

`npx blueprint test` or `yarn blueprint test`

### Run in debug mode

`npx blueprint run` or `yarn blueprint run`

### Creating a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`
