/**
 * @license Apache-2.0
 */
import { header, compression_flags, header_bit_flags } from './rpc';
import { flatbuffers } from 'flatbuffers';

/**
 * Creates RPC Header.
 */
export function createHeader(compression: compression_flags, bitflags: header_bit_flags, session: number, size: number, checksum: number, meta: number): Uint8Array {
  const fbb = new flatbuffers.Builder(32);
  const offset = header.createheader(fbb, compression, bitflags, session, size, checksum, meta);
  fbb.finish(0);
  return fbb.asUint8Array().slice(4);
}
