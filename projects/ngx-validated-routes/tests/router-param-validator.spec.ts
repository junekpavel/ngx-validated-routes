import { RouteParamValidator } from '../src/lib/route-param-validator';

describe('RouteParamValidator', () => {

  it('should return true when param matches param type (RegExp)', () => {
    expect(RouteParamValidator.validateParam('1', /^[\d]+$/)).toBeTruthy();
  });

  it('should return true when param matches param type (function)', () => {
    expect(RouteParamValidator.validateParam('1', p => p.length === 1)).toBeTruthy();
  });

  it('should return false when param does not match param type (RegExp)', () => {
    expect(RouteParamValidator.validateParam('1a', /^[\d]+$/)).toBeFalsy();
  });

  it('should return false when param does not match param type (function)', () => {
    expect(RouteParamValidator.validateParam('123', p => p.length === 1)).toBeFalsy();
  });

  it('should throw an error when unsupported type is specified', () => {
    expect(() => RouteParamValidator.validateParam('1', 'unsupported string type' as any)).toThrowError();
  });

});
