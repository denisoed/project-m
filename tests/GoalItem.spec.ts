import { Blockchain, SandboxContract, TreasuryContract, SendMessageResult } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { GoalItem } from '../wrappers/GoalItem';
import '@ton/test-utils';

describe('GoalItem', () => {
  let blockchain: Blockchain;
  let owner: SandboxContract<TreasuryContract>;
  let goalItem: SandboxContract<GoalItem>;
  let deployResult: SendMessageResult;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    goalItem = blockchain.openContract(await GoalItem.fromInit(0n));

    owner = await blockchain.treasury('owner');

    deployResult = await goalItem.send(
      owner.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Deploy',
        queryId: 0n,
      },
    );
  });

  it('should deploy', async () => {
    expect(deployResult.transactions).toHaveTransaction({
      from: owner.address,
      to: goalItem.address,
      deploy: true,
      success: true,
    });
  });
});
