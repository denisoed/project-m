import "@stdlib/deploy";
import "./messages";

contract CreateGoal with Deployable {
  owner: Address; // Contract owner
  creator: Address; // Goal creator
  description: String;
  reward: Int;
  confirmed: Bool;
  init(){
    self.owner = sender();
    self.creator = newAddress(0, 0);
    self.description = "";
    self.reward = 0;
    self.confirmed = false;
  }

  receive(msg: MCreateGoal){
    self.creator = msg.creator;
    self.description = msg.description;
    self.reward = msg.reward;
  }

  receive(msg: MConfirmGoal){
    let ctx: Context = context();
    require(!(self.confirmed), "Goal has already been confirmed");
    require(ctx.sender == self.creator, "Only creator can confirm goal");
    self.confirmed = true;
  }

  get fun goal(): MCreateGoal {
    return MCreateGoal{creator: self.creator, description: self.description, reward: self.reward};
  }

  get fun confirmed(): Bool {
    return self.confirmed;
  }
}