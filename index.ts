import { Rule } from './lib/model/rule.model';
import { Condition } from './lib/model/condition.model';
import { Outcome } from './lib/model/outcome.model';
import { RuleEngine } from './lib/engine';
import { EngineContext } from './lib/context/context';
import { EngineContextTrigger, PrePost, IEngineContextTrigger } from './lib/context/trigger.context';
import { Utility } from './lib/common/utils';
import { Logger } from './lib/common/log';

const rule1 = new Rule()
  .id('test2')
  .describe('country delivery rule')
  .contextIdentifier('deliveryInMalaysia')
  .when(new Condition('country.name == Malaysia'))
  .andWhen(new Condition('deliveryWeightInKg <= 2'))
  .thenReturn(new Outcome('delivery with POS Laju in Malaysia'));

const rule2 = new Rule()
  .id('test2')
  .describe('country delivery rule')
  .contextIdentifier('deliveryInMalaysia')
  .when(new Condition('logisticVendor == DHL'))
  .andWhen(new Condition('country.name == Malaysia'))
  .andWhen(new Condition('deliveryWeightInKg > 2'))
  .thenReturn(new Outcome('delivery with DHL in Malaysia'));

const rule3 = new Rule()
  .id('test3')
  .describe('leave application rule')
  .contextIdentifier('leave')
  .when(new Condition('leaveBalance > 0'))
  .thenReturn(new Outcome(true));

  const rule4 = new Rule()
    .id('test4')
    .describe('leave application rule')
    .contextIdentifier('leave')
    .when(new Condition('isActive == true'))
    .thenReturn(new Outcome(true));

const data = {
  country: {
    name: 'Malaysia',
    logisticOption: 'lorry',
  },
  logisticVendor: null,
  deliveryWeightInKg: 2
};

const data2 = {
  employeeId: Utility.id(10),
  leaveBalance: 3,
  isActive: true
};

const ruleEngine: RuleEngine = new RuleEngine();
ruleEngine.addRule(rule1);
ruleEngine.addRule(rule2);
ruleEngine.addRule(rule3);

const trigger: EngineContextTrigger = new EngineContextTrigger('deliveryInMalaysia', PrePost.POST, (self: any) => {
  // console.log(self);
  setTimeout(() => {
    console.log('evaluate rule of delivery in Malaysia');
  }, 1000);
});
const trigger2: EngineContextTrigger = new EngineContextTrigger('deliveryInMalaysia', PrePost.POST, () => {
  // second trigger function
  console.log('trigger some function');
});

const trigger3: EngineContextTrigger = new EngineContextTrigger('deliveryInMalaysia', PrePost.PRE, (self: any) => {
  // console.log(self);
  console.log('trigger a function before evaluate rule of delivery in Malaysia');
});
const trigger4: EngineContextTrigger = new EngineContextTrigger('deliveryInMalaysia', PrePost.POST, () => {
  // second trigger function
  console.log('trigger some function');
});
const appContext: EngineContext = new EngineContext('deliveryInMalaysia');
appContext.setTrigger(trigger);
appContext.setTrigger(trigger2);
appContext.setTrigger(trigger3);
ruleEngine.setContext(appContext);
ruleEngine.currentContext = 'deliveryInMalaysia';
ruleEngine.getContext('deliveryInMalaysia').data = data;

const appContext2: EngineContext = new EngineContext('leave');
ruleEngine.setContext(appContext2);
ruleEngine.getContext('leave').data = data2;

ruleEngine.getContext('leave').setOnEvalFn(() => {
  console.log('leave function call');
});

const outcome = ruleEngine.process();
console.log(outcome);

ruleEngine.currentContext = 'leave'
Logger.info('context now is ' + ruleEngine.currentContext);
const leaveOutcome = ruleEngine.process();

console.log(leaveOutcome);