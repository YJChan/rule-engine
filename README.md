# rule-engine
A configurable rule engine written by Typescript. This project is aim to solve simple rule engine problem. Do comment on what you think of this project so that I could improve it in the future. Of course, you are welcome to pull and make a version of yourself. Thanks!

### in experimental stage
npm i && npm run ts

### example code

```javascript
const rule1 = new Rule()
  .id('test1')
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
ruleEngine.addRule(rule1);
ruleEngine.addRule(rule2);

const trigger: EngineContextTrigger = new EngineContextTrigger('deliveryInMalaysia', PrePost.POST, (self: any) => {
  console.log(self);
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

const appContext: EngineContext = new EngineContext('deliveryInMalaysia');
appContext.setTrigger(trigger);
appContext.setTrigger(trigger2);
appContext.setTrigger(trigger3);
ruleEngine.setContext(appContext);
ruleEngine.currentContext = 'deliveryInMalaysia';
ruleEngine.getContext('deliveryInMalaysia').data = data;

const outcome = ruleEngine.process();
console.log(outcome);
```

### output
{outcome: 'delivery witht POS Laju in Malaysia', passed: true}  
similate async function  
evaluate rule of dellivery Malaysia  


