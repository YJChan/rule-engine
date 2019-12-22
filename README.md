# flow-engine
A configurable process engine written by Typescript. This project is aim to solve simple rule engine problem. Do comment on what you think of this project so that I could improve it in the future. Of course, you are welcome to pull and make a version of yourself. Thanks!

### in experimental stage
npm i && npm run ts

### example code

```javascript

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
```

### output
{outcome: 'delivery witht POS Laju in Malaysia', passed: true}  
similate async function  
evaluate rule of dellivery Malaysia  


