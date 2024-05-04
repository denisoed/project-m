import { toNano } from '@ton/core';
import { GoalParent } from '../wrappers/GoalParent';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
  const goalParent = provider.open(await GoalParent.fromInit());

  await goalParent.send(
    provider.sender(),
    {
      value: toNano('0.05'),
    },
    {
      $$type: 'Deploy',
      queryId: 0n,
    },
  );

  await provider.waitForDeploy(goalParent.address);

  // run methods on `goalParent`
}
