import { Rule } from './lib/model/rule.model';
import { Condition } from './lib/model/condition.model';
import { Outcome } from './lib/model/outcome.model';

const rule = new Rule()
  .id('test1')
  .describe('testing rulle')
  .when(new Condition('#tag', '1 = 1'))
  .when(new Condition('#tag2', '2 = 2'))
  .expected(new Outcome('#out1', {pageId: 'A1', user: 'system'}))
  .verify();

// const cond = new Condition('#tag', '=', 1, 1);

console.log(rule);