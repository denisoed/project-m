import "@stdlib/deploy";
import "./messages";
import "./structs";

contract GoalItem with Deployable {
  index: Int;
  confirmed: Bool;
  reward: Int as coins;
  owner: Address?;
  executor: Address?;
  description: String?;
  init(index: Int){
    self.index = index;
    self.confirmed = false;
    self.reward = 0;
  }

  receive(msg: MCreateGoalItem){
    self.owner = msg.owner;
    self.executor = msg.executor;
    self.description = msg.description;
    self.reward = msg.reward;
  }

  receive(msg: MConfirmGoalItem){
    let ctx: Context = context();
    require(!(self.confirmed), "Goal has already been confirmed");
    require(ctx.sender == self.owner, "Only owner can confirm goal");
    require(self.reward < msg.balance, "Balance should be higher than reward");
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