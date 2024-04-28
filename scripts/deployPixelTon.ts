import { toNano } from '@ton/core';
import { PixelTon } from '../wrappers/PixelTon';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
  const pixelTon = provider.open(await PixelTon.fromInit(BigInt(Math.floor(Math.random() * 10000))));

  await pixelTon.send(
    provider.sender(),
    {
      value: toNano('0.05'),
    },
    {
      $$type: 'Deploy',
      queryId: 0n,
    },
  );

  await provider.waitForDeploy(pixelTon.address);

  console.log('ID', await pixelTon.getId());
}
