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

    createGoal = blockchain.openContract(await CreateGoal.fromInit(0n));

    deployer = await blockchain.treasury('deployer');

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
    let owner: SandboxContract<TreasuryContract>;
    let createdGoal: SendMessageResult;

    beforeEach(async () => {
      owner = await blockchain.treasury('owner');
      createdGoal = await createGoal.send(
        owner.getSender(),
        {
          value: toNano('0.02'),
        },
        {
          $$type: 'MCreateGoal',
          owner: owner.address,
          executor: owner.address,
          description: 'test',
          reward: 1n,
        },
      );
    });

    it('should successfully create goal', async () => {
      expect(createdGoal.transactions).toHaveTransaction({
        from: owner.address,
        to: createGoal.address,
        success: true,
      });
    });

    it('if owner confirm the goal it should be true in state "confirmed"', async () => {
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

    it('if goal already confirmed it should be throw error', async () => {
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

      const confirmGoal = await createGoal.send(
        owner.getSender(),
        {
          value: toNano('0.02'),
        },
        {
          $$type: 'MConfirmGoal',
          owner: owner.address,
        },
      );

      expect(confirmGoal.transactions).toHaveTransaction({
        from: owner.address,
        to: createGoal.address,
        deploy: false,
        success: false,
      });
    });

    it('if not owner confirm the goal it should be false in state "confirmed"', async () => {
      expect(createdGoal.transactions).toHaveTransaction({
        from: owner.address,
        to: createGoal.address,
        deploy: false,
        success: true,
      });

      const notOwner = await blockchain.treasury('not-owner');
      const confirmedGoal = await createGoal.send(
        notOwner.getSender(),
        {
          value: toNano('0.02'),
        },
        {
          $$type: 'MConfirmGoal',
          owner: notOwner.address,
        },
      );

      expect(confirmedGoal.transactions).toHaveTransaction({
        from: notOwner.address,
        to: createGoal.address,
        deploy: false,
        success: false,
      });

      const confirmed = await createGoal.getConfirmed();

      expect(confirmed).toBeFalsy();
    });
  });
});
