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

    createGoal = blockchain.openContract(await CreateGoal.fromInit(0n));

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

  it('should successfully create goal', async () => {
    const owner = await blockchain.treasury('owner');
    const createdGoal = await createGoal.send(
      owner.getSender(),
      {
        value: toNano('0.02'),
      },
      {
        $$type: 'MCreateGoal',
        owner: owner.address,
        description: 'test',
        reward: 1n,
      },
    );

    expect(createdGoal.transactions).toHaveTransaction({
      from: owner.address,
      to: createGoal.address,
      success: true,
    });
  });

  describe('Default state', () => {
    it('should be false "confirmed"', async () => {
      const confirmed = await createGoal.getConfirmed();
      expect(confirmed).toBe(false);
    });

    it('should be empty string "description"', async () => {
      const goalDefault = await createGoal.getGoal();
      expect(goalDefault.description).toBe('');
    });
  });

  describe('Confirm goal', () => {
    it('if owner confirm the goal it should be true in state "confirmed"', async () => {
      const owner = await blockchain.treasury('owner');
      const createdGoal = await createGoal.send(
        owner.getSender(),
        {
          value: toNano('0.02'),
        },
        {
          $$type: 'MCreateGoal',
          owner: owner.address,
          description: 'test',
          reward: 1n,
        },
      );

      expect(createdGoal.transactions).toHaveTransaction({
        from: owner.address,
        to: createGoal.address,
        deploy: false,
        success: true,
      });

      const confirmedGoal = await createGoal.send(
        owner.getSender(),
        {
          value: toNano('0.02'),
        },
        {
          $$type: 'MConfirmGoal',
          owner: owner.address,
        },
      );

      expect(confirmedGoal.transactions).toHaveTransaction({
        from: owner.address,
        to: createGoal.address,
        deploy: false,
        success: true,
      });

      const confirmed = await createGoal.getConfirmed();

      expect(confirmed).toBeTruthy();
    });
  });
});
