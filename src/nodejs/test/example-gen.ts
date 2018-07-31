/**
 * Example generated storage service.
 */
import { MethodHandler } from '../src/index';

/**
 * smf storage service interface.
 */
export interface SmfStorageService {
  // Get - method description.
  Get: MethodHandler;
}

/**
 * smf storage class.
 */
export class SmfStorage {
  // name - smf service name.
  public name: string = "SmfStorage";

  // id - smf service ID.
  public id: number = 212494116;

  // service - smf service implementation.
  public service: SmfStorageService;

  constructor(service: SmfStorageService) {
    this.service = service;
  }

  // handler - Returns method handle for request ID.
  // The handle is nil if the request ID is not recognized.
  public handler(id: number): MethodHandler | null {
    switch (id) {
      case 212494116 ^ 1719559449:
        return this.service.Get
      default:
        return null
    }
  }
}
