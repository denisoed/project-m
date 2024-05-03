import { Blockchain, SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { GoalParent } from '../wrappers/GoalParent';
import { GoalItem } from '../wrappers/GoalItem';
import '@ton/test-utils';

const BALANCE = toNano('2');

describe('GoalParent', () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let goalParent: SandboxContract<GoalParent>;
  let deployResult: SendMessageResult;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    goalParent = blockchain.openContract(await GoalParent.fromInit());

    deployer = await blockchain.treasury('deployer');

    deployResult = await goalParent.send(
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

  it('should deploy', async () => {
    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: goalParent.address,
      deploy: true,
      success: true,
    });
  });

  describe('Default state', () => {
    it('should be owner "deployer"', async () => {
      const goalParentData = await goalParent.getGoalParentData();
      expect(goalParentData.owner.toString()).toEqual(deployer.address.toString());
    });

    it('should be balance "0"', async () => {
      const goalParentData = await goalParent.getGoalParentData();
      expect(goalParentData.balance).toEqual(0n);
    });

    it('should be nextGoalIndex "0"', async () => {
      const goalParentData = await goalParent.getGoalParentData();
      expect(goalParentData.nextGoalIndex).toEqual(0n);
    });
  });

  describe('Create goal', () => {
    let creator: SandboxContract<TreasuryContract>;
    let executor: SandboxContract<TreasuryContract>;
    let createdGoal: SendMessageResult;

    beforeEach(async () => {
      creator = await blockchain.treasury('creator');
      executor = await blockchain.treasury('executor');
      // Add balance to contract
      await goalParent.send(
        creator.getSender(),
        {
          value: BALANCE,
        },
        null,
      );

      createdGoal = await goalParent.send(
        creator.getSender(),
        {
          value: toNano('0.02'),
        },
        {
          $$type: 'MCreateGoal',
          creator: creator.address,
          executor: executor.address,
          description: 'test',
          reward: toNano('0.04'),
        },
      );
    });

    it('should successfully created goal', async () => {
      expect(createdGoal.transactions).toHaveTransaction({
        from: creator.address,
        to: goalParent.address,
        success: true,
      });
    });

    it('should successfully incremented nextGoalIndex to "1n"', async () => {
      const goalParentData = await goalParent.getGoalParentData();
      expect(goalParentData.nextGoalIndex).toEqual(1n);
    });

    it('should successfully increased balance to "2" coins', async () => {
      const goalParentData = await goalParent.getGoalParentData();
      expect(goalParentData.balance).toEqual(BALANCE);
    });

    it('should be set the address of the creator in the new goal', async () => {
      const goalAddress = await goalParent.getGoalItemAddressByIndex(0n);
      const goalItem = blockchain.openContract(await GoalItem.fromAddress(goalAddress!));
      const goalItemData = await goalItem.getGoalData();
      expect(goalItemData.creator?.toString()).toEqual(creator.address.toString());
    });
  });
});
