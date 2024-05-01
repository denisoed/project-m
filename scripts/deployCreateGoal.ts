import { toNano } from '@ton/core';
import { CreateGoal } from '../wrappers/CreateGoal';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
  const createGoal = provider.open(await CreateGoal.fromInit());

  await createGoal.send(
    provider.sender(),
    {
      value: toNano('0.05'),
    },
    {
      $$type: 'Deploy',
      queryId: 0n,
    },
  );

  await provider.waitForDeploy(createGoal.address);

  // run methods on `createGoal`
}
