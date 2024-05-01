import "@stdlib/deploy";
import "./messages";

contract CreateGoal with Deployable {
  owner: Address; // Contract owner
  creator: Address; // Goal creator
  description: String;
  reward: Int;
  confirmed: Bool;
  balance: Int as coins;
  init(){
    self.owner = sender();
    self.creator = newAddress(0, 0);
    self.description = "";
    self.confirmed = false;
    self.reward = 0;
    self.balance = 0;
  }

  receive(){
    self.balance = context().value;
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
    require(self.reward < self.balance, "Balance should be higher than reward");
    self.confirmed = true;
  }

  get fun goal(): MCreateGoal {
    return MCreateGoal{creator: self.creator, description: self.description, reward: self.reward};
  }

  get fun confirmed(): Bool {
    return self.confirmed;
  }

  get fun balance(): Int {
    return self.balance;
  }
}