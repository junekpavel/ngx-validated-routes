import {Inject, Injectable} from '@angular/core';
import {CanActivateChild, ActivatedRouteSnapshot, ParamMap, Router} from '@angular/router';
import {ValidatedRouteData, ValidatedRoutesConfig} from './router-data-types';
import {RouteParamValidator} from './route-param-validator';
import {validatedRoutesConfigService} from './validated-routes.module';

@Injectable()
export class ValidatedRouteGuard implements CanActivateChild {

  constructor(
    @Inject(validatedRoutesConfigService) private config: ValidatedRoutesConfig,
    private router: Router,
  ) {

  }

  canActivateChild(next: ActivatedRouteSnapshot): boolean {

    const data: ValidatedRouteData = next.data;
    const paramMap: ParamMap = next.paramMap;

    if ((!this.config.requireValidators && (typeof data === 'undefined' || typeof data.paramValidators === 'undefined')) || paramMap.keys.length === 0) {
      return true;
    }

    if (!!this.config.requireValidators) {
      if (typeof data === 'undefined' || typeof data.paramValidators === 'undefined' || !paramMap.keys.sort().every((v, i) => v === Object.keys(data.paramValidators).sort()[i])) {
        throw new Error(`Validators are required for all route params`);
      }
    }

    for (const paramName in data.paramValidators) {
      if (typeof data.paramValidators[paramName] !== 'undefined' && paramMap.has(paramName)) {
        const paramValidator = data.paramValidators[paramName];
        const param = paramMap.get(paramName);
        if (!RouteParamValidator.validateParam(param, paramValidator)) {
          return this.resolveFallback(next);
        }
      } else {
        throw new Error(`Parameter '${paramName}' not found in route '${next}'`);
      }

    }

    return true;
  }

  private resolveFallback(route: ActivatedRouteSnapshot): boolean {
    const fallback = this.config.fallback;

    if (typeof fallback !== 'undefined') {

      if (typeof fallback === 'string') {
        this.router.navigateByUrl(fallback);
        return false;
      }

      if (typeof fallback === 'function') {
        fallback(route);
        return false;
      }

      throw new Error(`Fallback ${typeof fallback} is unsupported`);

    }
    return false;
  }

}
