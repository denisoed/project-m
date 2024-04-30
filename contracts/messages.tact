message MCreateGoal {
  id: Int;
  owner: Address;
  description: String;
  confirmations: Int;
  reward: Int;
  confirmed: Bool;
}
message MConfirmGoal {
  confirmer: Address;
}