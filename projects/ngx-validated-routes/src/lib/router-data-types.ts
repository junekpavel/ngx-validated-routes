import {ActivatedRouteSnapshot, Data, Route} from '@angular/router';

/**
 * Defines ValidatedRoutesConfig object that can be passed when importing module
 */
export declare interface ValidatedRoutesConfig {

  /**
   * When is set to true, all route parameters must have specified validators
   * Default value is `false`
   */
  requireValidators?: boolean;

  /**
   * Fallback which is executed when route parameter does not mach defined validator
   * Could be string (URL) or callback function:
   *  - when is string (URL), user will be redirected to the passed URL (should be absolute path)
   *  - when is function, this function will be executed (failed route is passed to that function)
   */
  fallback?: string | ((route?: ActivatedRouteSnapshot) => void);
}

/**
 * Definition of Route ParamValidator validator.
 * Can be instance of RegExp or callback function
 */
export declare type ParamValidator = RegExp | ((paramValue: string) => boolean);

/**
 * Defines ParamValidators object. Used in `ValidatedRouteData`
 */
export declare interface ParamValidators {
  [paramName: string]: ParamValidator;
}

/**
 * Extends Angular route data with `paramValidators` property.
 */
export declare interface ValidatedRouteData extends Data {
  paramValidators?: ParamValidators;
}

/**
 * Overrides Angular `Route.data` with `ValidatedRouteData`.
 */
export declare interface ValidatedRoute extends Route {
  data?: ValidatedRouteData;
  children?: ValidatedRoutes;
}

/**
 * An array of `ValidatedRoute` objects.
 * Replaces Angular `Routes`.
 */
export declare type ValidatedRoutes = ValidatedRoute[];
