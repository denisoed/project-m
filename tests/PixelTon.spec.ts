import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { PixelTon } from '../wrappers/PixelTon';
import '@ton/test-utils';

describe('PixelTon', () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let pixelTon: SandboxContract<PixelTon>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    pixelTon = blockchain.openContract(await PixelTon.fromInit(0n));

    deployer = await blockchain.treasury('deployer');

    const deployResult = await pixelTon.send(
      deployer.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Deploy',
        queryId: 0n,
      },
    );

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: pixelTon.address,
      deploy: true,
      success: true,
    });
  });

  it('should deploy', async () => {
    // the check is done inside beforeEach
    // blockchain and pixelTon are ready to use
  });

  it('should increase counter', async () => {
    const increaseTimes = 3;
    for (let i = 0; i < increaseTimes; i++) {
      console.log(`increase ${i + 1}/${increaseTimes}`);

      const increaser = await blockchain.treasury('increaser' + i);

      const counterBefore = await pixelTon.getCounter();

      console.log('counter before increasing', counterBefore);

      const increaseBy = BigInt(Math.floor(Math.random() * 100));

      console.log('increasing by', increaseBy);

      const increaseResult = await pixelTon.send(
        increaser.getSender(),
        {
          value: toNano('0.05'),
        },
        {
          $$type: 'Add',
          queryId: 0n,
          amount: increaseBy,
        },
      );

      expect(increaseResult.transactions).toHaveTransaction({
        from: increaser.address,
        to: pixelTon.address,
        success: true,
      });

      const counterAfter = await pixelTon.getCounter();

      console.log('counter after increasing', counterAfter);

      expect(counterAfter).toBe(counterBefore + increaseBy);
    }
  });
});
