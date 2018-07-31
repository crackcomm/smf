/**
 * @license Apache-2.0
 */
import { flatbuffers } from 'flatbuffers';

/**
 * Method handler type.
 */
export interface MethodHandler {
  (body: string): string;
}

// export function createHeader(): {
//   const buf = new flatbuffers.Builder(32);

// }
