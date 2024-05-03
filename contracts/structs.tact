struct SGoalsData {
  owner: Address;
  balance: Int as coins;
  nextGoalIndex: Int;
}
struct SGoalData {
  index: Int;
  creator: Address?;
}