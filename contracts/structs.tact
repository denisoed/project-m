struct SGoalParentData {
  owner: Address;
  balance: Int as coins;
  nextGoalIndex: Int;
}
struct SGoalItemData {
  index: Int;
  creator: Address?;
  executor: Address?;
  description: String?;
  reward: Int? as coins;
}