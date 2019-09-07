import {InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {ValidatedRoutesConfig} from './router-data-types';
import {ValidatedRouteGuard} from './validated-route-guard.service';

/**
 * Defines Injection token of `ValidatedRoutesConfig` for configuring module
 */
export const validatedRoutesConfigService = new InjectionToken<ValidatedRoutesConfig>('ValidatedRoutesConfig');

/**
 * @usageNotes
 *
 * ValidatedRoutesModule should be imported only once - in AppModule (or AppRoutingModule).
 *
 * The module should be used as follows:
 *
 * ```
 * const routes: ValidatedRoutes = createValidatedRoutes([
 *   {
 *     path: 'team/:teamId',
 *     component: TeamComponent,
 *     data: {
 *       paramValidators: {
 *         teamId: RouteParamValidators.number,
 *       },
 *     },
 *   },
 * ]);
 *
 * const config: ValidatedRoutesConfig = {
 *   fallback: '/404',
 * };
 *
 * @NgModule({
 *   imports: [
 *     ValidatedRoutesModule.forRoot(config),
 *     RouterModule.forRoot(routes),
 *   ],
 * })
 * class AppModule {}
 * ```
 *
 * @description
 * The module adds support for validating Route params.
 *
 */
@NgModule()
export class ValidatedRoutesModule {

  /**
   * Creates and configures Validated Routes module.
   *
   * @param config An `ValidatedRoutesConfig` object that specifies library configuration
   */
  static forRoot(config?: ValidatedRoutesConfig): ModuleWithProviders<ValidatedRoutesModule> {

    return {
      ngModule: ValidatedRoutesModule,
      providers: [
        {
          provide: validatedRoutesConfigService,
          useValue: config || {},
        },
        ValidatedRouteGuard,
      ],
    };

  }

}
