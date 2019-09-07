import {inject, TestBed} from '@angular/core/testing';
import {convertToParamMap, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

import { ValidatedRouteGuard } from '../src/lib/validated-route-guard.service';
import {validatedRoutesConfigService} from '../src/lib/validated-routes.module';

class MockRouter {
  navigateByUrl(url: string) { return url; }
}

describe('ValidatedRouteGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValidatedRouteGuard,
        {
          provide: validatedRoutesConfigService,
          useValue: {},
        },
      ],
      imports: [
        RouterTestingModule,
      ],
    });
  });

  it('should return true when route has no params and no data', inject([ValidatedRouteGuard], (guard: ValidatedRouteGuard) => {
    const route: any = {
      paramMap: convertToParamMap({}),
    };
    expect(guard.canActivateChild(route)).toBeTruthy();
  }));

  it('should return true when route has params but no data', inject([ValidatedRouteGuard], (guard: ValidatedRouteGuard) => {
    const route: any = {
      paramMap: convertToParamMap({
        teamId: '1',
      }),
    };
    expect(guard.canActivateChild(route)).toBeTruthy();
  }));

  it('should return true when route has no params and has data but no types', inject([ValidatedRouteGuard], (guard: ValidatedRouteGuard) => {
    const route: any = {
      data: {
        foo: 'bar',
      },
      paramMap: convertToParamMap({}),
    };
    expect(guard.canActivateChild(route)).toBeTruthy();
  }));

  it('should return true when router has params and data but no types', inject([ValidatedRouteGuard], (guard: ValidatedRouteGuard) => {
    const route: any = {
      data: {
        foo: 'bar',
      },
      paramMap: convertToParamMap({
        teamId: '1',
      }),
    };
    expect(guard.canActivateChild(route)).toBeTruthy();
  }));

  it('should return true when router has params and data and empty types', inject([ValidatedRouteGuard], (guard: ValidatedRouteGuard) => {
    const route: any = {
      data: {
        foo: 'bar',
        paramValidators: {},
      },
      paramMap: convertToParamMap({
        teamId: '1',
      }),
    };
    expect(guard.canActivateChild(route)).toBeTruthy();
  }));

  it('should return true when more params are specified but only one of them has type', inject([ValidatedRouteGuard], (guard: ValidatedRouteGuard) => {
    const route: any = {
      data: {
        paramValidators: {
          teamId: () => true,
        },
      },
      paramMap: convertToParamMap({
        teamId: '1',
        eventId: '201',
      }),
    };
    expect(guard.canActivateChild(route)).toBeTruthy();
  }));

  it('should throw an error when is specified type for non-existing param', inject([ValidatedRouteGuard], (guard: ValidatedRouteGuard) => {
    const route: any = {
      data: {
        paramValidators: {
          eventId: 'test',
        },
      },
      paramMap: convertToParamMap({
        teamId: '1',
      }),
    };
    expect(() => guard.canActivateChild(route)).toThrowError();
  }));

  it('should throw an error when at least one param type has unsupported data type', inject([ValidatedRouteGuard], (guard: ValidatedRouteGuard) => {
    const route: any = {
      data: {
        foo: 'bar',
        paramValidators: {
          teamId: 'test',
          eventId: () => true,
        },
      },
      paramMap: convertToParamMap({
        teamId: '1',
        eventId: '201',
      }),
    };
    expect(() => guard.canActivateChild(route)).toThrowError();
  }));

  it('should return false when param does not match param type (RegExp)', inject([ValidatedRouteGuard], (guard: ValidatedRouteGuard) => {
    const route: any = {
      data: {
        foo: 'bar',
        paramValidators: {
          teamId: /^[\d]+$/,
        },
      },
      paramMap: convertToParamMap({
        teamId: 'string',
      }),
    };
    expect(guard.canActivateChild(route)).toBeFalsy();
  }));

  it('should return true when param matches param type (RegExp)', inject([ValidatedRouteGuard], (guard: ValidatedRouteGuard) => {
    const route: any = {
      data: {
        foo: 'bar',
        paramValidators: {
          teamId: /^[\d]+$/,
        },
      },
      paramMap: convertToParamMap({
        teamId: '1',
      }),
    };
    expect(guard.canActivateChild(route)).toBeTruthy();
  }));

  it('should return false when param does not match param type (function)', inject([ValidatedRouteGuard], (guard: ValidatedRouteGuard) => {
    const route: any = {
      data: {
        foo: 'bar',
        paramValidators: {
          teamId: (id: string) => id.length > 2,
        },
      },
      paramMap: convertToParamMap({
        teamId: '1',
      }),
    };
    expect(guard.canActivateChild(route)).toBeFalsy();
  }));

  it('should return true when param matches param type (function)', inject([ValidatedRouteGuard], (guard: ValidatedRouteGuard) => {
    const route: any = {
      data: {
        foo: 'bar',
        paramValidators: {
          teamId: (id: string) => id.length > 2,
        },
      },
      paramMap: convertToParamMap({
        teamId: '123',
      }),
    };
    expect(guard.canActivateChild(route)).toBeTruthy();
  }));

  it('should return false when fallback is function', () => {
    TestBed.configureTestingModule({
      providers: [
        ValidatedRouteGuard,
        { provide: validatedRoutesConfigService, useValue: {fallback: () => {}} },
      ],
    });

    const route: any = {
      data: {
        paramValidators: {
          teamId: () => false,
        },
      },
      paramMap: convertToParamMap({
        teamId: '123',
      }),
    };
    expect(TestBed.get(ValidatedRouteGuard).canActivateChild(route)).toBeFalsy();
  });

  it('should navigate to defined URL and return false when fallback is string', () => {
    TestBed.configureTestingModule({
      providers: [
        ValidatedRouteGuard,
        { provide: validatedRoutesConfigService, useValue: {fallback: '/404'} },
        { provide: Router, useClass: MockRouter },
      ],
    });
    const router = spyOn(TestBed.get(Router), 'navigateByUrl');

    const route: any = {
      data: {
        paramValidators: {
          teamId: () => false,
        },
      },
      paramMap: convertToParamMap({
        teamId: '123',
      }),
    };
    expect(TestBed.get(ValidatedRouteGuard).canActivateChild(route)).toBeFalsy();
    const url = router.calls.first().args[0];
    expect(url).toBe('/404');
  });

  it('should throw an error when unsupported fallback is passed', () => {
    TestBed.configureTestingModule({
      providers: [
        ValidatedRouteGuard,
        { provide: validatedRoutesConfigService, useValue: {fallback: 123} },
      ],
    });

    const route: any = {
      data: {
        paramValidators: {
          teamId: () => false,
        },
      },
      paramMap: convertToParamMap({
        teamId: '123',
      }),
    };
    expect(() => TestBed.get(ValidatedRouteGuard).canActivateChild(route)).toThrowError();
  });

  it('should throw an error when types are required for all params and some type in missing', () => {
    TestBed.configureTestingModule({
      providers: [
        ValidatedRouteGuard,
        { provide: validatedRoutesConfigService, useValue: {requireValidators: true} },
      ],
    });

    const route: any = {
      data: {
        paramValidators: {
          teamId: () => false,
        },
      },
      paramMap: convertToParamMap({
        eventId: '456',
        teamId: '123',
      }),
    };
    expect(() => TestBed.get(ValidatedRouteGuard).canActivateChild(route)).toThrowError();
  });

  it('should return true when types are required for all params and all types are passed', () => {
    TestBed.configureTestingModule({
      providers: [
        ValidatedRouteGuard,
        { provide: validatedRoutesConfigService, useValue: {requireValidators: true} },
      ],
    });

    const route: any = {
      data: {
        paramValidators: {
          teamId: () => true,
          eventId: () => true,
        },
      },
      paramMap: convertToParamMap({
        teamId: '123',
        eventId: '456',
      }),
    };
    expect(TestBed.get(ValidatedRouteGuard).canActivateChild(route)).toBeTruthy();
  });

});
