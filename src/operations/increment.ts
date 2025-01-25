/*
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License.
 */

import { separator } from '../constants/characters';
import { maxVectorLengthV1, maxVectorLengthV2 } from '../constants/lengths';
import { immutable } from '../properties/immutable';
import { version } from '../properties/version';
import { split } from '../utilities/split';

/**
 * Increments the current extension by one. Do this before passing the value to an
 * outbound message header.
 * @param {string} cv The current correlation vector string.
 * @returns {string} the new value as a string that you can add to the outbound message header
 * indicated by {@link CorrelationVector#headerName}.
 */
export const increment = (cv: string): string => {
  const [base, extension] = split(cv);
  const v = version(cv);
  if (immutable(cv)) {
    return cv;
  }
  if (extension === Number.MAX_SAFE_INTEGER) {
    return cv;
  }
  const next: number = extension + 1;

  const size: number =
    base.length + 1 + (next > 0 ? Math.floor(Math.log10(next)) : 0) + 1;
  if (
    (v === 'v1' && size > maxVectorLengthV1) ||
    (v === 'v2' && size > maxVectorLengthV2)
  ) {
    return cv;
  }

  return `${base}${separator}${next}`;
};
