import "@stdlib/deploy";
import "./messages";
import "./structs";

contract GoalItem with Deployable {
  index: Int;
  creator: Address?;
  init(index: Int){
    self.index = index;
  }

  receive(msg: MCreateGoalItem){
    self.creator = msg.creator;
  }

  get fun goalData(): SGoalItemData {
    return SGoalItemData{index: self.index, creator: self.creator};
  }
}