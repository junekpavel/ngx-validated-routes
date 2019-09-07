# ngx-validated-routes

Library for validating Angular Route parameters.

Simple, easy to use library for Angular, that validates format of Route parameters.
It gives you ability to specify route parameter types (validators) with route definition, so you don't need to validate parameters in each component.

## Installation

First you need to install the npm module:

```bash
npm install ngx-validated-routes --save
```

## Usage

You have to import `ValidatedRoutesModule.forRoot()` in your `AppRoutingModule` or `AppModule`.

```typescript
import {NgModule} from '@angular/core';
import {ValidatedRoutesModule, createValidatedRoutes, RouteParamValidators, ValidatedRoutes} from 'ngx-validated-routes';
import {RouterModule} from '@angular/router';
import {TeamComponent} from 'team.component';

const routes: ValidatedRoutes = createValidatedRoutes([
  {
    path: 'team/:teamId',
    component: TeamComponent,
    data: {
      paramValidators: {
        teamId: RouteParamValidators.positiveNumber,
      },
    },
  },
  //...
]);

@NgModule({
  imports: [
    ValidatedRoutesModule.forRoot({
      fallback: '/404',
      requireValidators: true,
      
    }),
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
```

## API

### ValidatedRoutesModule
#### `ValidatedRoutesModule::forRoot(config?: ValidatedRoutesConfig): ModuleWithProviders<ValidatedRoutesModule>`

Creates and configures the module.

#### `ValidatedRoutesConfig`
- `fallback`: string or callback function
  - if string is passed, it's used as redirect URL when parametr does not match given validator, eg:
  ```typescript
  ValidatedRoutesModule.forRoot({
      fallback: '/404',      
    }),
  ],
  ```
  - if callback function is passed, it's called with [ActivatedRouteSnapshot](https://angular.io/api/router/ActivatedRouteSnapshot) that did not pass as parameter, eg:
  ```typescript
  ValidatedRoutesModule.forRoot({
      fallback: (route: ActivatedRouteSnapshot): void => {
        // do something
      },
    }),
  ],
  ```

- `requireValidators`: boolean
  - if is set to true, all params must have specified validators
  - default value: `false`
 

### Basic data types

#### `ValidatedRoute`
Has same signature as [`Route`](https://angular.io/api/router/Route), but property [`data`](https://angular.io/api/router/Route#data) is replaced with `ValidatedRouteData`, which adds optional parameter `paramValidators?: ParamValidators`.

#### `ParamTypes`
Object where you should define validators for `ValidatedRoute` params.

#### `ParamType`
Is validator function or RegExp, that checks `ValidatedRoute` params.

You can provide RegExp or custom callback function which takes `ValidatedRoute` param value as parameter and returns boolean.

```typescript
const route: ValidatedRoute = {
  path: 'team/:teamId/events/:eventId',
  component: TeamEventComponent, // Your component or whatever
  data: {
    paramValidators: {
      // validate teamId parameter with callback function
      teamId: (paramValue: string) => paramValue.length > 1,
      // validate eventId parameter with RegExp, RegExp constructor could be used as well
      eventId: /^[\d]+$/
    },
  },
};
```

Or you can use one of predefined validators:

## RouteParamValidators

Set of predefined useful type validators:

### `RouteParamValidators.number`
- validates that parameter includes only numbers, eg:
```typescript
const data: ValidatedRouteData = {
  paramTypes: {
    teamId: RouteParamValidators.number,
  },
  // ...
},
```

### `RouteParamValidators.positiveNumber`
- validates that parameter includes only numbers and is greater than zero, eg:
```typescript
const data: ValidatedRouteData = {
  paramTypes: {
    teamId: RouteParamValidators.positiveNumber,
  },
  // ...
},
```

### `RouteParamValidators.token`
- validates that parameter includes only alphanumeric characters (a-Z, 0-9)
```typescript
const data: ValidatedRouteData = {
  paramTypes: {
    teamId: RouteParamValidators.token,
  },
  // ...
},
```

### `RouteParamValidators.maxLength(maxLength: number)`
- validates that parameter length is not greater than specified maxLength
```typescript
const data: ValidatedRouteData = {
  paramTypes: {
    teamId: RouteParamValidators.maxLength(10),
  },
  // ...
},
```

### `RouteParamValidators.and(paramTypes: ParamType[])`
- combines two or more type validators, all of them must pass, eg:
```typescript
const data: ValidatedRouteData = {
  paramTypes: {
    teamId: RouteParamValidators.and([RouteParamValidators.number, RouteParamValidators.maxLength(10)]),
  },
  // ...
},
```

### `RouteParamValidators.or(paramTypes: ParamType[])`
- combines two or more type validators, at least on of them must pass, eg:
```typescript
const data: ValidatedRouteData = {
  paramTypes: {
    teamId: RouteParamValidators.or([RouteParamValidators.number, RouteParamValidators.maxLength(10)]),
  },
  // ...
},
```

- validators can be combined, as needed:
```typescript
const data: ValidatedRouteData = {
  paramTypes: {
    teamId: RouteParamValidators.or([
      RouteParamValidators.and([RouteParamValidators.number, RouteParamValidators.maxLength(10)]),
      RouteParamValidators.positiveNumber,
    ]),
  },
  // ...
},
```

## Further information
For further information see tests or type declaration files.
