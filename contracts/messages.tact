message MCreateGoal {
  creator: Address;
  executor: Address;
  description: String;
  reward: Int as coins;
}
message MConfirmGoal {
  creator: Address;
}
message MCreateGoalItem {
  creator: Address;
  executor: Address;
  description: String;
  reward: Int as coins;
}