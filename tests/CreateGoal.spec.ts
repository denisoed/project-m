import { Blockchain, SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { CreateGoal } from '../wrappers/CreateGoal';
import '@ton/test-utils';

describe('CreateGoal', () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let createGoal: SandboxContract<CreateGoal>;
  let deployResult: SendMessageResult;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    deployer = await blockchain.treasury('deployer');

    createGoal = blockchain.openContract(await CreateGoal.fromInit());

    deployResult = await createGoal.send(
      deployer.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Deploy',
        queryId: 0n,
      },
    );
  });

  it('should deploy', () => {
    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: createGoal.address,
      deploy: true,
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

  describe('Create & Confirm goal', () => {
    let creator: SandboxContract<TreasuryContract>;
    let createdGoal: SendMessageResult;

    beforeEach(async () => {
      creator = await blockchain.treasury('creator');
      createdGoal = await createGoal.send(
        creator.getSender(),
        {
          value: toNano('0.02'),
        },
        {
          $$type: 'MCreateGoal',
          creator: creator.address,
          description: 'test',
          reward: 1n,
        },
      );
    });

    it('should successfully create goal', async () => {
      expect(createdGoal.transactions).toHaveTransaction({
        from: creator.address,
        to: createGoal.address,
        success: true,
      });
    });

    it('if creator confirm the goal it should be true in state "confirmed"', async () => {
      expect(createdGoal.transactions).toHaveTransaction({
        from: creator.address,
        to: createGoal.address,
        deploy: false,
        success: true,
      });

      const confirmedGoal = await createGoal.send(
        creator.getSender(),
        {
          value: toNano('0.02'),
        },
        {
          $$type: 'MConfirmGoal',
          creator: creator.address,
        },
      );

      expect(confirmedGoal.transactions).toHaveTransaction({
        from: creator.address,
        to: createGoal.address,
        deploy: false,
        success: true,
      });

      const confirmed = await createGoal.getConfirmed();

      expect(confirmed).toBeTruthy();
    });

    it('if goal already confirmed it should be throw error', async () => {
      expect(createdGoal.transactions).toHaveTransaction({
        from: creator.address,
        to: createGoal.address,
        deploy: false,
        success: true,
      });

      const confirmedGoal = await createGoal.send(
        creator.getSender(),
        {
          value: toNano('0.02'),
        },
        {
          $$type: 'MConfirmGoal',
          creator: creator.address,
        },
      );

      expect(confirmedGoal.transactions).toHaveTransaction({
        from: creator.address,
        to: createGoal.address,
        deploy: false,
        success: true,
      });

      const confirmed = await createGoal.getConfirmed();

      expect(confirmed).toBeTruthy();

      const confirmGoal = await createGoal.send(
        creator.getSender(),
        {
          value: toNano('0.02'),
        },
        {
          $$type: 'MConfirmGoal',
          creator: creator.address,
        },
      );

      expect(confirmGoal.transactions).toHaveTransaction({
        from: creator.address,
        to: createGoal.address,
        deploy: false,
        success: false,
      });
    });

    it('if not creator confirm the goal it should be false in state "confirmed"', async () => {
      expect(createdGoal.transactions).toHaveTransaction({
        from: creator.address,
        to: createGoal.address,
        deploy: false,
        success: true,
      });

      const notCreator = await blockchain.treasury('not-creator');
      const confirmedGoal = await createGoal.send(
        notCreator.getSender(),
        {
          value: toNano('0.02'),
        },
        {
          $$type: 'MConfirmGoal',
          creator: notCreator.address,
        },
      );

      expect(confirmedGoal.transactions).toHaveTransaction({
        from: notCreator.address,
        to: createGoal.address,
        deploy: false,
        success: false,
      });

      const confirmed = await createGoal.getConfirmed();

      expect(confirmed).toBeFalsy();
    });
  });
});
