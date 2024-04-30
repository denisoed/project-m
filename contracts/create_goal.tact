import "@stdlib/deploy";
import "./messages";

contract CreateGoal with Deployable {
  description: String;
  init(){
    self.description = "";
  }

  receive(msg: Goal){
    self.description = msg.description;
  }

  get fun description(): String {
    return self.description;
  }
}