/* tslint:disable variable-name class-name */

import { flatbuffers } from 'flatbuffers';

declare class header {

  /**
   * \brief: header parsed by rpc engine
   * must be sizeof()'able
   * that is, must be a struct in fbs language
   *
   * layout
   * [ 8bits(compression) + 8bits(bitflags) + 16bits(session) + 32bits(size) + 32bits(checksum) + 32bits(meta) ]
   * total = 128bits == 16bytes
   *
   *
   * @constructor
   */
  constructor();

  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer;

  /**
   * @type {number}
   */
  bb_pos: number;

  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {header}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): header;

  /**
   * @param {flatbuffers.Builder} builder
   * @param {compression_flags} compression
   * @param {header_bit_flags} bitflags
   * @param {number} session
   * @param {number} size
   * @param {number} checksum
   * @param {number} meta
   * @returns {flatbuffers.Offset}
   */
  static createheader(builder: flatbuffers.Builder, compression: compression_flags, bitflags: header_bit_flags, session: number, size: number, checksum: number, meta: number): flatbuffers.Offset;

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {header}
   */
  static getRootAsHeader(bb: flatbuffers.ByteBuffer): header;

  /**
   * @returns {compression_flags}
   */
  compression(): compression_flags;

  /**
   * @returns {header_bit_flags}
   */
  bitflags(): header_bit_flags;

  /**
   * 16 bits for storing the actual session id.
   * used for streaming client and slot allocation
   *
   * @returns {number}
   */
  session(): number;

  /**
   * size of the next payload
   *
   * @returns {number}
   */
  size(): number;

  /**
   * currently we use (xxhash64 & UINT32_MAX)
   *
   * @returns {number}
   */
  checksum(): number;

  /**
   * \brief used for sending and receiving, read carefully.
   *
   * Receiving:
   *
   * Uses the same as HTTP status - on the receiving end
   * We don't want to pay the cost of parsing a header
   * On every response as does HTTP. std::to_string and std::stol()
   * are needlesly expensive
   *
   * Sending:
   *
   * Used with the xor hash of Service::ID() ^ Service::Method::ID()
   * This is how the server multiplexer figures out what function pointer
   * to call
   *
   *
   * @returns {number}
   */
  meta(): number;
}


declare class dynamic_header {

  /**
   * \brief used for extra headers, ala HTTP
   * The use case for the core is to support
   * zipkin/google-Dapper style tracing
   *
   * @constructor
   */
  constructor();

  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer;

  /**
   * @type {number}
   */
  bb_pos: number;

  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {dynamic_header}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): dynamic_header;

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {dynamic_header=} obj
   * @returns {dynamic_header}
   */
  static getRootAsdynamic_header(bb: flatbuffers.ByteBuffer, obj?: dynamic_header): dynamic_header;

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startdynamic_header(builder: flatbuffers.Builder): void;

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} keyOffset
   */
  static addKey(builder: flatbuffers.Builder, keyOffset: flatbuffers.Offset): void;

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} valueOffset
   */
  static addValue(builder: flatbuffers.Builder, valueOffset: flatbuffers.Offset): void;

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static enddynamic_header(builder: flatbuffers.Builder): flatbuffers.Offset;

  /**
   * alows for binary search lookup
   * use with CreateVectorOfSortedTables<> instead of the CreateVector
   *
   * @param {flatbuffers.Encoding=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  key(optionalEncoding?: flatbuffers.Encoding): string | Uint8Array | any /*null*/;

  /**
   * @param {flatbuffers.Encoding=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  value(optionalEncoding?: flatbuffers.Encoding): string | Uint8Array | any /*null*/;
}


declare class payload_headers {

  /**
   * @constructor
   */
  constructor();

  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer;

  /**
   * @type {number}
   */
  bb_pos: number;

  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {payload_headers}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): payload_headers;

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {payload_headers=} obj
   * @returns {payload_headers}
   */
  static getRootAspayload_headers(bb: flatbuffers.ByteBuffer, obj?: payload_headers): payload_headers;

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startpayload_headers(builder: flatbuffers.Builder): void;

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} dynamicHeadersOffset
   */
  static addDynamicHeaders(builder: flatbuffers.Builder, dynamicHeadersOffset: flatbuffers.Offset): void;

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Array.<flatbuffers.Offset>} data
   * @returns {flatbuffers.Offset}
   */
  static createDynamicHeadersVector(builder: flatbuffers.Builder, data: flatbuffers.Offset[]): flatbuffers.Offset;

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} numElems
   */
  static startDynamicHeadersVector(builder: flatbuffers.Builder, numElems: number): void;

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} size
   */
  static addSize(builder: flatbuffers.Builder, size: number): void;

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} checksum
   */
  static addChecksum(builder: flatbuffers.Builder, checksum: number): void;

  /**
   * @param {flatbuffers.Builder} builder
   * @param {compression_flags} compression
   */
  static addCompression(builder: flatbuffers.Builder, compression: compression_flags): void;

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endpayload_headers(builder: flatbuffers.Builder): flatbuffers.Offset;

  /**
   * Headers for forward compat.
   *
   * @param {number} index
   * @param {dynamic_header=} obj
   * @returns {dynamic_header}
   */
  dynamicHeaders(index: number, obj?: dynamic_header): dynamic_header;

  /**
   * @returns {number}
   */
  dynamicHeadersLength(): number;

  /**
   * We need to chain the actual payload
   *
   * @returns {number}
   */
  size(): number;

  /**
   * @returns {number}
   */
  checksum(): number;

  /**
   * @returns {compression_flags}
   */
  compression(): compression_flags;
}


declare class null_type {

  /**
   * \brief, useful when the type is empty
   * i.e.: void foo();
   * rpc my_rpc { null_type MutateOnlyOnServerMethod(int); }
   *
   *
   * @constructor
   */
  constructor();

  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer;

  /**
   * @type {number}
   */
  bb_pos: number;

  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {null_type}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): null_type;

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {null_type=} obj
   * @returns {null_type}
   */
  static getRootAsnull_type(bb: flatbuffers.ByteBuffer, obj?: null_type): null_type;

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startnull_type(builder: flatbuffers.Builder): void;

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endnull_type(builder: flatbuffers.Builder): flatbuffers.Offset;
}


/**
 * \brief: headers that are stored in an int
 * so they need to be inclusive. That is, you can turn on
 * many flags at the same time, i.e.: enable checksum and
 * have the payload be zlib compressed.
 *
 *
 * @enum
 */
type compression_flags = any /*missing*/;

/**
 * @enum
 */
type header_bit_flags = any /*missing*/;
