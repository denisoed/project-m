import "@stdlib/deploy";
import "./goal_item.tact";
import "./messages";
import "./structs";
const minTonsForStorage: Int = ton("0.02");
const gasConsumption: Int = ton("0.02");

contract GoalParent with Deployable {
  owner: Address; // Contract owner
  balance: Int as coins;
  nextGoalIndex: Int;
  init(){
    self.owner = sender();
    self.nextGoalIndex = 0;
    self.balance = 0;
  }

  // Transfer balance to contract
  receive(){
    self.balance = context().value;
  }

  receive(msg: MCreateGoal){
    require(self.owner != msg.executor, "Owner and executor should be different");
    require(msg.reward < self.balance, "Balance should be higher than reward");
    require(msg.reward > 0, "Reward should be higher than 0");
    require(self.nextGoalIndex >= 0, "Goal index is non-sequential");
    self.createGoalItem(self.nextGoalIndex, msg);
  }

  // ----- Private function ----- //

  inline fun createGoalItem(index: Int, msg: MCreateGoal) {
    let goalInit: StateInit = self.goalItemInit(self.nextGoalIndex);
    send(SendParameters{
        to: contractAddress(goalInit),
        value: gasConsumption,
        mode: SendIgnoreErrors,
        code: goalInit.code,
        data: goalInit.data,
        body: MCreateGoalItem{
          owner: self.owner,
          executor: msg.executor,
          description: msg.description,
          reward: msg.reward
        }.toCell()
      }
    );
    self.nextGoalIndex = (self.nextGoalIndex + 1);
  }

  inline fun goalItemInit(index: Int): StateInit {
    return initOf GoalItem(index);
  }

  // ----- Public function ----- //

  get fun goalParentData(): SGoalParentData {
    return SGoalParentData{nextGoalIndex: self.nextGoalIndex, balance: self.balance, owner: self.owner};
  }

  get fun goalItemAddressByIndex(index: Int): Address? {
    let goalInit: StateInit = self.goalItemInit(index);
    return contractAddress(goalInit);
  }
}