import { Rule } from './lib/model/rule.model';
import { Condition } from './lib/model/condition.model';
import { Outcome } from './lib/model/outcome.model';

const param1 = 'A';
const param2 = 'B';

const ruleOutcome = new Rule()
  .id('test1')
  .describe('testing rule')
  .when(new Condition('#tag', '1 == 1'))
  .andWhen(new Condition('#tag2', `${param1} != ${param2}`))
  .orWhen(new Condition('#tag3', `${param1} > ${param2}`))
  .thenReturn(new Outcome('#out1', {url: 'https://xyz.com/process-after-rule?x=a&y=12', user: 'system'}))
  .verify();

console.log(ruleOutcome);