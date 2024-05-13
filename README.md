# Project "M" - System of management of goals and motivation of employees

## About Project

Our project is an innovative system that allows companies to create motivation strategies for employees using the TON blockchain. The system is based on smart contracts and allows companies to set goals that address strategic business objectives such as increased productivity, profit growth and business development.

### Key Features and Functions

- Companies can create goals that align with their strategy and business objectives and offer employees rewards for achieving them.
- Employees can receive rewards in the form of cryptocurrency for achieving goals, which incentivises them to work more efficiently and contribute to the company's strategic goals.
- The system allows companies to retain and motivate employees by giving them the opportunity to participate in achieving key business goals.

### Project Objective

To provide companies with a tool to effectively manage employee motivation, build business strategy and achieve the company's strategic goals.

### Benefits of the project

- Enable companies to create motivational strategies that align with their business goals.
- Transparency and reliability through the use of blockchain and smart contracts.
- Increased business efficiency through better management of employee motivation and goals.

## Technical Overview

### Architecture

The project is built on the Telegram platform using the TON blockchain for core functionality. Smart contracts written in Tact are deployed on the TON blockchain to manage goal setting and reward distribution.

### User Interaction

Users interact with the system through a Telegram bot interface. They can create goals, track their completion, and receive rewards directly in the Telegram app.

### Target creation

When a goal is created, a smart contract is deployed on the TON blockchain, including a description of the goal, the conditions of fulfilment and the reward amount.

### Tracking Goal Progress

The system tracks the progress of each goal based on user input. For example, if a goal requires 10 articles to be written, the user can update the progress in the Telegram bot as each article is completed.

### Confirmation of goal completion

When a goal is completed, the user sends the goal for confirmation via Telegram bot. Other users in the system can confirm completion by voting in favour.

### Reward distribution

Once enough users have confirmed the completion of a goal, the smart contract automatically distributes rewards to the user's wallet.

### Blockchain Integration

Using the TON blockchain provides transparency and security in the process of setting goals and distributing rewards. All transactions and contract interactions are recorded on the blockchain, ensuring that records of achievements and rewards are immutable.

### Scalability

The system is designed to be scalable, allowing new users and goals to be added without compromising performance. The high throughput and low latency of the TON blockchain ensures that a large number of transactions can be processed efficiently.

#### Conclusion

Using the TON blockchain and smart contracts, the project creates a transparent and efficient system for setting and achieving goals, providing users with a secure and motivating environment for personal and professional growth.

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
