import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { CreateGoal } from '../wrappers/CreateGoal';
import '@ton/test-utils';

describe('CreateGoal', () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let createGoal: SandboxContract<CreateGoal>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    createGoal = blockchain.openContract(await CreateGoal.fromInit());

    deployer = await blockchain.treasury('deployer');

    const deployResult = await createGoal.send(
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
      to: createGoal.address,
      deploy: true,
      success: true,
    });
  });

  it('should deploy', async () => {
    // the check is done inside beforeEach
    // blockchain and createGoal are ready to use
  });

  it('should set description', async () => {
    const owner = await blockchain.treasury('owner');

    const descriptionBefore = await createGoal.getDescription();

    expect(descriptionBefore).toBe('');

    const createdGoal = await createGoal.send(
      owner.getSender(),
      {
        value: toNano('0.02'),
      },
      {
        $$type: 'Goal',
        description: 'test',
      },
    );

    expect(createdGoal.transactions).toHaveTransaction({
      from: owner.address,
      to: createGoal.address,
      success: true,
    });

    const descriptionAfter = await createGoal.getDescription();

    expect(descriptionAfter).toBe('test');
  });
});
