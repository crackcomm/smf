/**
 * @license Apache-2.0
 */
import 'jest';
import { SmfStorage, SmfStorageService } from './example-gen';

const serviceImpl: SmfStorageService = {
  Get: (body: string): string => {
    console.log(body);
    return 'test';
  }
}

describe('example', () => {
  it('should build storage', async () => {
    const c = new SmfStorage(serviceImpl);
    expect(c.id).toEqual(212494116);
    expect(c.name).toEqual("SmfStorage");
    expect(c.handler(212494116 ^ 1719559449)).toEqual(serviceImpl.Get);
  });
});
