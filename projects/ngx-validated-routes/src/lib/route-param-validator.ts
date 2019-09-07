import {ParamValidator} from './router-data-types';

export class RouteParamValidator {

  /**
   * @param param - parameter value
   * @param paramValidator - can be function or RegExp
   * @return true when param passes defined validator
   */
  static validateParam(param: string, paramValidator: ParamValidator): boolean {

    if (typeof paramValidator === 'function') {
      return paramValidator(param);
    }

    if (paramValidator instanceof RegExp) {
      return paramValidator.test(param);
    }

    throw new Error(`Unsupported route validator '${typeof paramValidator}'`);

  }

}
