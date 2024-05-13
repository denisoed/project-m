import "@stdlib/deploy";
import "./messages";
import "./structs";

contract GoalItem {
  index: Int;
  confirmed: Bool;
  reward: Int as coins;
  owner: Address;
  executor: Address;
  description: String;
  init(index: Int){
    self.index = index;
    self.confirmed = false;
    self.reward = 0;
    self.owner = sender();
    self.executor = newAddress(0, 0);
    self.description = "";
  }

  receive(msg: MCreateGoalItem){
    self.owner = msg.owner;
    self.executor = msg.executor;
    self.description = msg.description;
    self.reward = msg.reward;
  }

  receive("MConfirmGoalItem"){
    require(!(self.confirmed), "Goal has already been confirmed");
    self.confirmed = true;
  }

  get fun goalData(): SGoalItemData {
    return
      SGoalItemData{
        index: self.index,
        owner: self.owner,
        executor: self.executor,
        description: self.description,
        reward: self.reward,
        confirmed: self.confirmed
      };
  }
}