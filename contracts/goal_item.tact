import "@stdlib/deploy";
import "./messages";
import "./structs";

contract GoalItem with Deployable {
  index: Int;
  owner: Address?;
  executor: Address?;
  description: String?;
  reward: Int? as coins;
  init(index: Int){
    self.index = index;
  }

  receive(msg: MCreateGoalItem){
    self.owner = msg.owner;
    self.executor = msg.executor;
    self.description = msg.description;
    self.reward = msg.reward;
  }

  get fun goalData(): SGoalItemData {
    return
      SGoalItemData{
        index: self.index,
        owner: self.owner,
        executor: self.executor,
        description: self.description,
        reward: self.reward
      };
  }
}