import { Err, ERRORS } from "../constants/errors";
import { Logger } from "../common/log";
import { MAX_LOOP_ITERATION } from "../constants/operation";
import { Utility } from "../common/utils";

export interface IOutcome {
  tag?: string | number;
  conditionTag?: string | number;
  outcome: any;
}

export class Outcome implements IOutcome {
  successCondition: any;

  constructor(
    public _outcome: any,
    public _tag?: string | number,
    public _conditionTag?: string,
  ) {
    if (Utility.isEmpty(this._tag)) {
      this._tag = Utility.id();
    }
    this.successCondition = {
      and: [],
      or: []
    };
  }

  public get tag(): string | number{
    return this._tag? this._tag : '';
  }

  public set tag(t: string | number) {
    this._tag = t;
  }

  public get conditionTag(){
    return this._conditionTag? this._conditionTag : '';
  }

  public set conditionTag(ct: string) {
    this._conditionTag = ct;
  }

  public get outcome(){
    return this._outcome;
  }

  public set outcome(o: string | number) {
    this._outcome = o;
  }

  public static EMPTY_OUTCOME() {
    return {outcome: {}, passed: false};
  }
  /* experimental parsing */
  public setSuccessCondition() {

  }

  // (#tag and tag2) or tag3
  /* experimental parsing */
  parseOutcome() {
    if (! this._conditionTag) {
      throw new Err(ERRORS.NO_CONDITION_TAG_FOUND);
    }
    Logger.info('start parse tag', this._conditionTag);
    const tagArr = this.extractFromBrackets2(this._conditionTag);
  }

  /* experimental parsing */
  extractFromBrackets(str: string) {
    try {
      let tagArr: any[] = [];
      let tagInBracket = '';
      const len: number = str.length;
      let pos: number = 0;
      while(pos < len) {
        if (str.charAt(pos) === '(') {
          pos += 1;
          const extracted = this.extractFromInnerBrackets(str, pos);
          Logger.debug(str.charAt(pos));
          tagInBracket = extracted.tagInBracket;
          pos = extracted.pos;

          if (tagInBracket.length > 0) {
            tagArr.push(tagInBracket);
            tagInBracket = '';
          }
        } else {
          const extracted = this.extractFromInnerBrackets(str, pos);
          tagInBracket = extracted.tagInBracket;
          pos = extracted.pos;

          if (tagInBracket.length > 0) {
            tagArr.push(tagInBracket);
            tagInBracket = '';
          }
          Logger.debug(str.charAt(pos));
          pos++;
        }
      }
      Logger.info('tag arr is ', tagArr);
      return tagArr;
    } catch (err) {
      Logger.debug(err);
    }
  }

  extractFromInnerBrackets(str: string, pos: number) {
    try {
      let tagInBracket = '';
      const len = str.length;
      // let openBracketPos = [];
      // let closeBracketPos = [];
      // for (let i = 0; i < str.length; i ++) {
      //   if (str.charAt(i) === '(') {
      //     openBracketPos.push(i);
      //   }
      //   if (str.charAt(i) === ')') {
      //     closeBracketPos.push(i);
      //   }
      // }
      // Logger.debug(openBracketPos);
      // Logger.debug(closeBracketPos);
      // if (openBracketPos.length !== closeBracketPos.length) {
      //   throw new Err(ERRORS.BRACKETS_NOT_MATCH);
      // }
      // for (let i = 0; i < openBracketPos.length; i++) {
      //   for (let n = closeBracketPos.length; n >= 0; n--) {
      //     tagInBracket += str.substring(openBracketPos[i], closeBracketPos[n]);
      //   }
      // }
      for (let pos2 = pos; pos2 < len; pos2++) {
        if (str.charAt(pos2) === '(') {
          break;
        }
        if (str.charAt(pos2) === ')') {
          break;
        }
        tagInBracket += str.charAt(pos);
        pos++;
      }
      return {tagInBracket, pos};
    } catch (err) {
      Logger.debug(err);
      throw new Err(err);
    }
  }

  /* experimental parsing */
  extractFromBrackets2(str: string) {
    try {
      let tagArr: any[] = [];
      let tagInBracket = '';
      const len = str.length;
      let openBracketPos = [];
      let closeBracketPos = [];
      for (let i = 0; i < str.length; i ++) {
        if (str.charAt(i) === '(') {
          openBracketPos.push(i);
        }
        if (str.charAt(i) === ')') {
          closeBracketPos.push(i);
        }
      }
      Logger.debug(openBracketPos);
      Logger.debug(closeBracketPos);
      if (openBracketPos.length !== closeBracketPos.length) {
        throw new Err(ERRORS.BRACKETS_NOT_MATCH);
      }
      for (let i = 0; i < openBracketPos.length; i++) {
        Logger.debug('i = ' + i);
        for (let n = closeBracketPos.length - 1; n >= 0; n--) {
          Logger.debug('n = ' + n);
          tagInBracket = str.substring(openBracketPos[i], closeBracketPos[n]);
        }
        tagArr.push(tagInBracket);
        tagInBracket = '';
        Logger.debug(tagArr);
      }
      tagInBracket = str.substring(openBracketPos[0], closeBracketPos[closeBracketPos.length - 1] + 1);
      Logger.debug(tagInBracket);
    } catch (err) {
      Logger.debug(err);
      throw new Err(err);
    }
  }

  setAndCondition(tag: Array<string> | string) {
    // if (Array.isArray(tag)) {
    //   this.successCondition.and.push(tag);
    // } else {
      this.successCondition.and.push(tag);
    // }
  }

  setOrCondition(tag: Array<string> | string) {
    this.successCondition.or.push(tag);
  }

}