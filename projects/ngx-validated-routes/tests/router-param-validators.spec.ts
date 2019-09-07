import { RouteParamValidators } from '../src/lib/route-param-validators';
import {RouteParamValidator} from '../src/lib/route-param-validator';

describe('RouteParamValidators', () => {

  it('number: should accept number', () => {
    expect(RouteParamValidator.validateParam('1', RouteParamValidators.number)).toBeTruthy();
  });

  it('number: should not accept string', () => {
    expect(RouteParamValidator.validateParam('string', RouteParamValidators.number)).toBeFalsy();
  });

  it('token: should accept only alphanumeric characters', () => {
    expect(RouteParamValidator.validateParam('aAbBcC123', RouteParamValidators.token)).toBeTruthy();
  });

  it('token: should not accept special characters', () => {
    expect(RouteParamValidator.validateParam('aAb&#C123', RouteParamValidators.token)).toBeFalsy();
  });

  it('token: should not accept string', () => {
    expect(RouteParamValidator.validateParam('string', RouteParamValidators.number)).toBeFalsy();
  });

  it('maxLength: should pass if length is equal or less then specified value', () => {
    expect(RouteParamValidator.validateParam('123', RouteParamValidators.maxLength(3))).toBeTruthy();
  });

  it('maxLength: should not pass if length is larger then specified value', () => {
    expect(RouteParamValidator.validateParam('1234', RouteParamValidators.maxLength(3))).toBeFalsy();
  });

  it('and: should pass when all defined conditions are met', () => {
    expect(RouteParamValidator.validateParam('123', RouteParamValidators.and([RouteParamValidators.number, RouteParamValidators.maxLength(6)]))).toBeTruthy();
  });

  it('and: should not pass when at least one of defined conditions is not met', () => {
    expect(RouteParamValidator.validateParam('123', RouteParamValidators.and([RouteParamValidators.number, RouteParamValidators.maxLength(2)]))).toBeFalsy();
  });

  it('or: should pass when at least one of defined conditions is met', () => {
    expect(RouteParamValidator.validateParam('123', RouteParamValidators.or([RouteParamValidators.number, RouteParamValidators.maxLength(2)]))).toBeTruthy();
  });

  it('or: should not pass when none of defined conditions is met', () => {
    expect(RouteParamValidator.validateParam('123a', RouteParamValidators.or([RouteParamValidators.number, RouteParamValidators.maxLength(2)]))).toBeFalsy();
  });

  it('positiveNumber: should pass when positive number is passed', () => {
    expect(RouteParamValidator.validateParam('1', RouteParamValidators.positiveNumber)).toBeTruthy();
  });

  it('positiveNumber: should not pass when zero is passed', () => {
    expect(RouteParamValidator.validateParam('0', RouteParamValidators.positiveNumber)).toBeFalsy();
  });

});
