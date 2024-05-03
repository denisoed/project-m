import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { GoalItem } from '../wrappers/GoalItem';
import '@ton/test-utils';

describe('GoalItem', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let goalItem: SandboxContract<GoalItem>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        goalItem = blockchain.openContract(await GoalItem.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await goalItem.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: goalItem.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and goalItem are ready to use
    });
});
