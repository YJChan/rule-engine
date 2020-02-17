# rule-engine
A configurable rule engine written by Typescript. This project is aim to solve simple rule engine problem. Do comment on what you think of this project so that I could improve it in the future. Of course, you are welcome to pull and make a version of yourself. Thanks!

# Conceptual Guide
<ul>
  <li>Condition - used to evaluate data provided by <code>Context</code></li>
  <li>Outcome - object that return when Rule is full filled.</li>
  <li>Rule - set Conditions and Outcome. You can have a combination of <code>
when().orWhen()</code> or <code>when().andWhen()</code>. <br><code>.contextIdentifier()</code> is important, it used to determine when this rule will be applied in the RuleEngine process method.
  </li>
  <li>
    Context - store data that is going to evaluate. <code>id </code> and <code>data</code> is mandatory here, it used by Rule Engine to process with rule defined. There is a pre and post trigger can be setup as well as <code>onEvaluate()</code>. The sequence for these function is preTrigger, onEvaluate, postTrigger.
  </li>
  <li>
    ContextTrigger - function that is trigger by specific context is being evaluate. 
  </li>
  <li>
    Rule Engine - setup multiple context and data, then set <code>currentContext</code> and call <code>process()</code>.
  </li>
</ul>

# Try on this library
npm i && npm run ts

# Example code

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
simulate async function  
evaluate rule of dellivery Malaysia  

# Todo
<ul>
  <li>
    setup rules with json file
  </li>
  <li>
    complete test case
  </li>
  <li>
    scenario & examples
  </li>
  <li>
    relase to npm
  </li>
</ul>



