/**
 * Copyright 2019 Google LLC
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 3 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 */

/**
 * https://jsfiddle.net/5zzh8Ljg/4/
 */
function sigmoidFactory(k){
	function base(t){
		return (1 / (1 + Math.exp(-k * t))) - 0.5
	}

	var correction = 0.5 / base(1)

	return function(t){
		t = clamp(t, 0, 1)
		return correction * base(2 * t - 1) + 0.5
	}
}

function clamp(val, lower, upper){
	return Math.max(Math.min(val, upper), lower)
}

export const Sigmoid = sigmoidFactory
