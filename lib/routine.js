/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable no-restricted-syntax, no-invalid-this */

'use strict';

// MODULES //

var setReadOnly = require( '@stdlib/utils-define-nonenumerable-read-only-property' );
var inherits = require( '@stdlib/utils-inherit' );
var stride2offset = require( '@stdlib/strided-base-stride2offset' );
var Memory = require( '@stdlib/wasm-memory' );
var arrays2ptrs = require( '@stdlib/wasm-base-arrays2ptrs' );
var strided2object = require( '@stdlib/wasm-base-strided2object' );
var Module = require( './module.js' );


// MAIN //

/**
* Routine constructor.
*
* @private
* @constructor
* @returns {Routine} routine instance
*
* @example
* var Float32Array = require( '@stdlib/array-float32' );
*
* // Create a new routine:
* var dsdot = new Routine();
*
* // Initialize the module:
* dsdot.initializeSync();
*
* // Define strided arrays:
* var x = new Float32Array( [ 1.0, 2.0, 3.0, 4.0, 5.0 ] );
* var y = new Float32Array( [ 1.0, 1.0, 1.0, 1.0, 1.0 ] );
*
* // Perform operation:
* var dot = dsdot.main( x.length, x, 1, y, 1 );
* // returns 15.0
*
* @example
* var Float32Array = require( '@stdlib/array-float32' );
*
* // Create a new routine:
* var dsdot = new Routine();
*
* // Initialize the module:
* dsdot.initializeSync();
*
* // Define strided arrays:
* var x = new Float32Array( [ 1.0, 2.0, 3.0, 4.0, 5.0 ] );
* var y = new Float32Array( [ 1.0, 1.0, 1.0, 1.0, 1.0 ] );
*
* // Perform operation:
* var dot = dsdot.ndarray( x.length, x, 1, 0, y, 1, 0 );
* // returns 15.0
*/
function Routine() {
	if ( !( this instanceof Routine ) ) {
		return new Routine();
	}
	Module.call( this, new Memory({
		'initial': 0
	}));
	return this;
}

// Inherit from the parent constructor:
inherits( Routine, Module );

/**
* Computes the dot product of `x` and `y` with extended accumulation and result.
*
* @name main
* @memberof Routine.prototype
* @readonly
* @type {Function}
* @param {PositiveInteger} N - number of indexed elements
* @param {Float32Array} x - first input array
* @param {integer} strideX - `x` stride length
* @param {Float32Array} y - second input array
* @param {integer} strideY - `y` stride length
* @returns {number} dot product
*
* @example
* var Float32Array = require( '@stdlib/array-float32' );
*
* // Create a new routine:
* var dsdot = new Routine();
*
* // Initialize the module:
* dsdot.initializeSync();
*
* // Define strided arrays:
* var x = new Float32Array( [ 1.0, 2.0, 3.0, 4.0, 5.0 ] );
* var y = new Float32Array( [ 1.0, 1.0, 1.0, 1.0, 1.0 ] );
*
* // Perform operation:
* var dot = dsdot.main( x.length, x, 1, y, 1 );
* // returns 15.0
*/
setReadOnly( Routine.prototype, 'main', function dsdot( N, x, strideX, y, strideY ) {
	return this.ndarray( N, x, strideX, stride2offset( N, strideX ), y, strideY, stride2offset( N, strideY ) ); // eslint-disable-line max-len
});

/**
* Computes the dot product of `x` and `y` with extended accumulation and result using alternative indexing semantics.
*
* @name ndarray
* @memberof Routine.prototype
* @readonly
* @type {Function}
* @param {PositiveInteger} N - number of indexed elements
* @param {Float32Array} x - first input array
* @param {integer} strideX - `x` stride length
* @param {NonNegativeInteger} offsetX - starting index for `x`
* @param {Float32Array} y - second input array
* @param {integer} strideY - `y` stride length
* @param {NonNegativeInteger} offsetY - starting index for `y`
* @returns {number} dot product
*
* @example
* var Float32Array = require( '@stdlib/array-float32' );
*
* // Create a new routine:
* var dsdot = new Routine();
*
* // Initialize the module:
* dsdot.initializeSync();
*
* // Define strided arrays:
* var x = new Float32Array( [ 1.0, 2.0, 3.0, 4.0, 5.0 ] );
* var y = new Float32Array( [ 1.0, 1.0, 1.0, 1.0, 1.0 ] );
*
* // Perform operation:
* var dot = dsdot.ndarray( x.length, x, 1, 0, y, 1, 0 );
* // returns 15.0
*/
setReadOnly( Routine.prototype, 'ndarray', function dsdot( N, x, strideX, offsetX, y, strideY, offsetY ) {
	var ptrs;
	var p0;
	var p1;

	// Convert the input arrays to "pointers" in the module's memory:
	ptrs = arrays2ptrs( this, [
		strided2object( N, x, strideX, offsetX ),
		strided2object( N, y, strideY, offsetY )
	]);
	p0 = ptrs[0];
	p1 = ptrs[1];

	// Perform computation by calling the corresponding parent method:
	return Module.prototype.ndarray.call( this, N, p0.ptr, p0.stride, p0.offset, p1.ptr, p1.stride, p1.offset ); // eslint-disable-line max-len
});


// EXPORTS //

module.exports = Routine;
