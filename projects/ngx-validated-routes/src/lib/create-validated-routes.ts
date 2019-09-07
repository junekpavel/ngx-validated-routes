import {Routes} from '@angular/router';
import {ValidatedRoutes} from './router-data-types';
import {ValidatedRouteGuard} from './validated-route-guard.service';

/**
 * Transforms given `Routes` to Array of `ValidatedRoute` and enables param validation on them
 * @param routes - app root routes
 */
export function createValidatedRoutes(routes: Routes): ValidatedRoutes {
  return [
    {
      path: '',
      canActivateChild: [ValidatedRouteGuard],
      children: routes,
    },
  ];
}
