import { toNano } from '@ton/core';
import { Goals } from '../wrappers/Goals';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
  const goals = provider.open(await Goals.fromInit());

  await goals.send(
    provider.sender(),
    {
      value: toNano('0.05'),
    },
    {
      $$type: 'Deploy',
      queryId: 0n,
    },
  );

  await provider.waitForDeploy(goals.address);

  // run methods on `goals`
}
