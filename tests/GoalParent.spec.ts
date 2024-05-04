import { Blockchain, SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { GoalParent } from '../wrappers/GoalParent';
import { GoalItem } from '../wrappers/GoalItem';
import '@ton/test-utils';

const CONTRACT_BALANCE = toNano('5');
const REWARD = toNano('1');
const MIN_TRANSACTION_FEE = toNano('0.02');

describe('GoalParent', () => {
  let blockchain: Blockchain;
  let owner: SandboxContract<TreasuryContract>;
  let goalParentContract: SandboxContract<GoalParent>;
  let deployResult: SendMessageResult;
  let ownerInitBalance: bigint;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    goalParentContract = blockchain.openContract(await GoalParent.fromInit());

    owner = await blockchain.treasury('owner');

    ownerInitBalance = await owner.getBalance();

    deployResult = await goalParentContract.send(
      owner.getSender(),
      {
        value: MIN_TRANSACTION_FEE,
      },
      {
        $$type: 'Deploy',
        queryId: 0n,
      },
    );
  });

  it('should deploy', () => {
    expect(deployResult.transactions).toHaveTransaction({
      from: owner.address,
      to: goalParentContract.address,
      deploy: true,
      success: true,
    });
  });

  describe('Default state', () => {
    it('should be owner', async () => {
      const goalParentData = await goalParentContract.getGoalParentData();
      expect(goalParentData.owner.toString()).toEqual(owner.address.toString());
    });

    it('should be balance "0"', async () => {
      const goalParentData = await goalParentContract.getGoalParentData();
      expect(goalParentData.balance).toEqual(0n);
    });

    it('should be nextGoalIndex "0"', async () => {
      const goalParentData = await goalParentContract.getGoalParentData();
      expect(goalParentData.nextGoalIndex).toEqual(0n);
    });
  });

  describe('Main flow', () => {
    let executor: SandboxContract<TreasuryContract>;
    let createdGoal: SendMessageResult;
    let goalItemContract: SandboxContract<GoalItem>;
    let goalItemData: any;

    beforeEach(async () => {
      executor = await blockchain.treasury('executor');
      // Add balance to contract
      await goalParentContract.send(
        owner.getSender(),
        {
          value: CONTRACT_BALANCE,
        },
        null,
      );

      createdGoal = await goalParentContract.send(
        owner.getSender(),
        {
          value: MIN_TRANSACTION_FEE,
        },
        {
          $$type: 'MCreateGoal',
          executor: executor.address,
          description: 'test',
          reward: REWARD,
        },
      );

      const goalAddress = await goalParentContract.getGoalItemAddressByIndex(0n);
      goalItemContract = blockchain.openContract(await GoalItem.fromAddress(goalAddress!));
      goalItemData = await goalItemContract.getGoalData();
    });

    it('should successfully created goal', () => {
      expect(createdGoal.transactions).toHaveTransaction({
        from: owner.address,
        to: goalParentContract.address,
        success: true,
      });
    });

    describe('Create', () => {
      it('should successfully increased balance to "2" coins', async () => {
        const goalParentData = await goalParentContract.getGoalParentData();
        expect(goalParentData.balance).toEqual(CONTRACT_BALANCE);
      });

      it('should successfully de-balanced the owner', async () => {
        const newOwnerBalance = await owner.getBalance();
        expect(newOwnerBalance).toBeLessThan(ownerInitBalance - CONTRACT_BALANCE);
      });

      it('should successfully incremented nextGoalIndex to "1n"', async () => {
        const goalParentData = await goalParentContract.getGoalParentData();
        expect(goalParentData.nextGoalIndex).toEqual(1n);
      });

      it('should be set the address of the owner in the new goal', () => {
        expect(goalItemData.owner?.toString()).toEqual(owner.address.toString());
      });

      it('should be set the address of the executor in the new goal', () => {
        expect(goalItemData.executor?.toString()).toEqual(executor.address.toString());
      });

      it('should be set the description in the new goal', () => {
        expect(goalItemData.description).toEqual('test');
      });

      it('should be set the reward in the new goal', () => {
        expect(goalItemData.reward).toEqual(REWARD);
      });

      it('should be false in state "confirmed" in the new goal', () => {
        expect(goalItemData.confirmed).toBeFalsy();
      });
    });

    describe('Confirm', () => {
      let confirmedGoal: SendMessageResult;

      beforeEach(async () => {
        confirmedGoal = await goalParentContract.send(
          owner.getSender(),
          {
            value: MIN_TRANSACTION_FEE,
          },
          {
            $$type: 'MConfirmGoal',
            index: 0n,
          },
        );
      });

      it('should successfully confirmed', () => {
        expect(confirmedGoal.transactions).toHaveTransaction({
          from: owner.address,
          to: goalParentContract.address,
          deploy: false,
          success: true,
        });
      });

      it('should be true in state "confirmed" in the new goal', async () => {
        goalItemData = await goalItemContract.getGoalData();
        expect(goalItemData.confirmed).toBeTruthy();
      });
    });
  });
});
