import { Rule } from './lib/model/rule.model';
import { Condition } from './lib/model/condition.model';
import { Outcome } from './lib/model/outcome.model';
import { RuleEngine } from './lib/engine';
import { EngineContext } from './lib/context/context';
import { EngineContextTrigger } from './lib/context/trigger.context';
import { Utility } from './lib/common/utils';

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

const data = {
  country: {
    name: 'Malaysia',
    logisticOption: 'lorry',
  },
  logisticVendor: null,
  deliveryWeightInKg: 2
};

const ruleEngine: RuleEngine = new RuleEngine();

const appContext: EngineContext = new EngineContext();

ruleEngine.addRule(rule1);
ruleEngine.addRule(rule2);
ruleEngine.setContext(appContext);
ruleEngine.context.setData(data);
ruleEngine.context.currentContext = 'deliveryInMalaysia';

const trigger: EngineContextTrigger = new EngineContextTrigger(Utility.id(), 'deliveryInMalaysia', () => {
  setTimeout(() => {
    console.log('evaluate rule of delivery in Malaysia');
  }, 1000);
});
ruleEngine.context.trigger.push(trigger);

ruleEngine.context.onEvaluate(async () => {
  const promiseFn = new Promise((resolve, rejcet) => {
    setTimeout(() => {
      resolve(console.log('simulate async function'));
    }, 1000);
  });
  return await promiseFn;
});

const outcome =ruleEngine.process();

console.log(outcome);