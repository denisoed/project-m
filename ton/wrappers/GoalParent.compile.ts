import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'tact',
  target: 'contracts/goal_parent.tact',
  options: {
    debug: true,
  },
};
