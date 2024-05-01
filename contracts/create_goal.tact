import "@stdlib/deploy";
import "./messages";

contract CreateGoal with Deployable {
  id: Int;
  owner: Address;
  description: String;
  reward: Int;
  confirmed: Bool;
  init(id: Int){
    self.id = id;
    self.owner = sender();
    self.description = "";
    self.reward = 0;
    self.confirmed = false;
  }

  receive(msg: MCreateGoal){
    self.owner = msg.owner;
    self.description = msg.description;
    self.reward = msg.reward;
  }

  receive(msg: MConfirmGoal){
    let ctx: Context = context();
    require(!(self.confirmed), "Goal has already been confirmed");
    require(ctx.sender == self.owner, "Only owner can confirm goal");
    self.confirmed = true;
  }

  get fun id(): Int {
    return self.id;
  }

  get fun goal(): MCreateGoal {
    return MCreateGoal{owner: self.owner, description: self.description, reward: self.reward};
  }

  get fun confirmed(): Bool {
    return self.confirmed;
  }
}