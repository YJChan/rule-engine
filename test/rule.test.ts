import { expect } from 'chai';
import { Rule }  from '../lib/model/rule.model';
import { Condition } from '../lib/model/condition.model';
import { Outcome } from '../lib/model/outcome.model';
import { Logger } from '../lib/common/log';
import { AssertionError, equal } from 'assert';

describe('Rule with one condition', () => {
  it('should return outcome', () => {
    const param1 = 'M';
    const param2 = 'M';
    const result = new Rule()
      .when(new Condition(`${param1} == ${param2}`))
      .thenReturn(new Outcome('TRUE'))
      .verify();
    const outcome = result?.outcome
    expect(outcome).to.equal('TRUE');
  });

  it('should return false', () => {
    const param1 = 1;
    const param2 = 2;
    const result = new Rule()
      .when(new Condition(`${param1} > ${param2}`))
      .thenReturn(new Outcome(false))
      .verify();
    const outcomePassed = result?.passed
    expect(outcomePassed).equal(false);
  });
}); 

describe('Multiple AND condition in one rule', () => {
  it('should return true', () => {
    const param1 = 10;
    const param2 = 10.2;
    const result = new Rule()
      .when(new Condition(`${param1} < ${param2}`))
      .andWhen(new Condition(`${param1} == 10`))
      .thenReturn(new Outcome(true))
      .verify();
    const outcome = result?.outcome;
    expect(outcome).true;
  });

  it('should return false', () => {
    const param1 = 10;
    const param2 = 10.2;
    const result = new Rule()
      .when(new Condition(`${param1} > ${param2}`))
      .andWhen(new Condition(`${param1} != 10`))
      .thenReturn(new Outcome(true))
      .verify();
    const failOutcome = result?.passed;
    expect(failOutcome).false;
  });
});

describe('Multiple AND, OR condition in one rule', () => {
  it('all the and condition must be true to return result', () => {
    const param = {
      age: 19,
      gender: 'F',
      nationality: 'MY',
      race: 'Chinese'
    };
    const result = new Rule()
      .contextIdentifier('nationalService')
      .when(new Condition(`${param.age} > 18`))
      .orWhen(new Condition(`${param.gender} == M`))
      .andWhen(new Condition(`${param.nationality} == MY`))
      .thenReturn(new Outcome(true))
      .verify();
    const outcome = result?.outcome;
    expect(outcome).true;
  });

  it('any condition is true to return true', () => {
    const param = {
      age: 19,
      nationality: 'MY',
      race: 'Chinese'
    };
    const result = new Rule()
      .contextIdentifier('voting right')
      .when(new Condition(`${param.age} > 18`))
      .orWhen(new Condition(`${param.race} == Malay`))
      .orWhen(new Condition(`${param.nationality} == MY`))
      .thenReturn(new Outcome(true))
      .verify();
    const outcome = result?.outcome;
    expect(outcome).true;
  });
});

describe('Engine processing rule', () => {
  before(() => {

  });


  after(() => {

  });
})