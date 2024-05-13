import { toNano } from '@ton/core';
import { GoalItem } from '../wrappers/GoalItem';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const goalItem = provider.open(await GoalItem.fromInit());

    await goalItem.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(goalItem.address);

    // run methods on `goalItem`
}
