/**
 * @license Apache-2.0
 */
import 'jest';

import { header } from '../src/rpc';
import { createHeader } from '../src/header';
import { flatbuffers } from 'flatbuffers';

describe('header', () => {
  it('should build header', async () => {
    const hdr = createHeader(0, 0, 0, 0, 0, 0);
    expect(hdr.length).toBe(16);
  });
  it('should decode header', async () => {
    const buf = new flatbuffers.ByteBuffer(createHeader(1, 2, 3, 4, 5, 6));
    const hdr = header.getRootAsHeader(buf);
    expect(hdr.compression()).toBe(1);
    expect(hdr.bitflags()).toBe(2);
    expect(hdr.session()).toBe(3);
    expect(hdr.size()).toBe(4);
    expect(hdr.checksum()).toBe(5);
    expect(hdr.meta()).toBe(6);
  });
});
