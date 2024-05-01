message MCreateGoal {
  creator: Address;
  executor: Address;
  description: String;
  reward: Int;
}
message MConfirmGoal {
  creator: Address;
}