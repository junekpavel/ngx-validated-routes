import {ParamValidator} from './router-data-types';
import {RouteParamValidator} from './route-param-validator';

/**
 * @usageNotes
 *
 * Static properties or functions that can be directly passed into paramValidators object in ValidatedRoute data.
 *
 * ```
 * const route: ValidatedRoute = {
 *   path: '/team/:teamId/',
 *   component: TeamDetailComponent,
 *   data: {
 *     foo: 'bar',
 *     paramValidators: {
 *       teamId: RouteParamValidators.number,
 *     },
 *   },
 * };
 * ```
 *
 * @description
 * Set of predefined useful ValidatedRoute's validators.
 *
 */
export class RouteParamValidators {

  /**
   * Validates that given string contains only numbers
   */
  static number: ParamValidator = new RegExp('^[0-9]+$');

  /**
   * Validates that given string contains only alphanumeric characters
   */
  static token: ParamValidator = new RegExp('^[a-zA-Z0-9]+$');

  /**
   * Validates that given string length is not larger then specified max length
   */
  static maxLength(maxLength: number): ParamValidator {
    const validatorFunction = (paramValue: string) => {
      return paramValue.length <= maxLength;
    };
    return validatorFunction;
  }

  /**
   * Validates that given string meets all given conditions (ParamValidators)
   */
  static and(paramValidators: ParamValidator[]): ParamValidator {
    const validatorFunction = (paramValue: string) => {
      for (const type of paramValidators) {
        if (!RouteParamValidator.validateParam(paramValue, type)) {
          return false;
        }
      }
      return true;
    };
    return validatorFunction;
  }

  /**
   * Validates that given string meets at least one of given conditions (ParamValidators)
   */
  static or(paramValidators: ParamValidator[]): ParamValidator {
    const validatorFunction = (paramValue: string) => {
      for (const type of paramValidators) {
        if (RouteParamValidator.validateParam(paramValue, type)) {
          return true;
        }
      }
      return false;
    };
    return validatorFunction;
  }

  /**
   * Validates that given string is number that is greater than zero
   */
  static positiveNumber(paramValue: string): boolean {
    const paramTypeFunction = RouteParamValidators.and([RouteParamValidators.number, (value: string) => +value > 0]) as (paramValue: string) => boolean;
    return paramTypeFunction(paramValue);
  }

}
