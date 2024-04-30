import "@stdlib/deploy";
import "./messages";

contract CreateGoal with Deployable {
  id: Int;
  owner: Address;
  description: String;
  reward: Int;
  confirmations: Int;
  confirmed: Bool;

  confirmers: map<Address, Bool>;
  confirmersLength: Int = 0;

  init(id: Int){
    self.id = id;
    self.owner = sender();
    self.description = "";
    self.reward = 0;
    self.confirmed = false;
    self.confirmations = 0;
  }

  receive(msg: MCreateGoal){
    self.owner = msg.owner;
    self.description = msg.description;
    self.confirmations = msg.confirmations;
    self.reward = msg.reward;
  }

  receive(msg: MConfirmGoal){
    require(!(self.confirmed), "Goal has already been confirmed");
    repeat(self.confirmations) {
      require(self.confirmers.get(msg.confirmer), "You have already confirmed this goal");
    }
    self.confirmers.set(msg.confirmer, true);
    self.confirmersLength += 1;
    if ((self.confirmations - 1) == self.confirmersLength) {
      self.confirmed = true;
    }
  }

  get fun id(): Int {
    return self.id;
  }

  get fun goal(): MCreateGoal {
    return
      MCreateGoal{id: self.id, owner: self.owner, description: self.description, reward: self.reward, confirmations: self.confirmations, confirmed: self.confirmed};
  }
}