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

  get fun goalData(): SGoalData {
    return SGoalData{index: self.index, creator: self.creator};
  }
}