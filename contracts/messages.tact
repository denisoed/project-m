message MCreateGoal {
  executor: Address;
  description: String;
  reward: Int as coins;
}
message MConfirmGoal {
  index: Int;
}
message MCreateGoalItem {
  owner: Address;
  executor: Address;
  description: String;
  reward: Int as coins;
}