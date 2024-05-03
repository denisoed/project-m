import "@stdlib/deploy";
import "./messages";
import "./structs";

contract GoalItem with Deployable {
  index: Int;
  creator: Address?;
  executor: Address?;
  description: String?;
  reward: Int? as coins;
  init(index: Int){
    self.index = index;
  }

  receive(msg: MCreateGoalItem){
    self.creator = msg.creator;
    self.executor = msg.executor;
    self.description = msg.description;
    self.reward = msg.reward;
  }

  get fun goalData(): SGoalItemData {
    return
      SGoalItemData{
        index: self.index,
        creator: self.creator,
        executor: self.executor,
        description: self.description,
        reward: self.reward
      };
  }
}