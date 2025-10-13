/**
 * Square data mappers
 *
 * This module exports all mapper functions for transforming Square catalog objects
 * into plugin-compatible data structures.
 */

export { createImageUrlMap, mapSquareImage } from './image.js'
export { createMeasurementUnitMap, mapMeasurementUnit } from './measurement.js'
export { createItemVariationsMap, mapItemVariation } from './variation.js'
