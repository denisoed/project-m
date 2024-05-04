message MCreateGoal {
  executor: Address;
  description: String;
  reward: Int as coins;
}
message MConfirmGoal {
  owner: Address;
}
message MCreateGoalItem {
  owner: Address;
  executor: Address;
  description: String;
  reward: Int as coins;
}