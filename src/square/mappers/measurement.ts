import type { Square } from 'square'

import type { SquareMeasurementUnit } from '../../types/index.js'

/**
 * Maps a Square measurement unit to the plugin format
 * @param object - Square catalog object of type MEASUREMENT_UNIT
 * @returns Mapped SquareMeasurementUnit object
 */
export function mapMeasurementUnit(
  object: Square.CatalogObjectMeasurementUnit,
): SquareMeasurementUnit {
  return {
    type: object.measurementUnitData?.measurementUnit?.type || 'N/A',
    precision: Number(object.measurementUnitData?.precision || 0),
    squareId: object.id || 'N/A',
    weightUnit: object.measurementUnitData?.measurementUnit?.weightUnit || 'N/A',
  }
}

/**
 * Creates a map of measurement unit IDs to their data
 * @param relatedObjects - Array of related catalog objects from Square API
 * @returns Map of measurement unit ID to SquareMeasurementUnit
 */
export function createMeasurementUnitMap(
  relatedObjects: Square.CatalogObject[],
): Map<string, SquareMeasurementUnit> {
  return new Map(
    relatedObjects
      .filter((item) => item.type === 'MEASUREMENT_UNIT')
      .map((item) => {
        const unit = mapMeasurementUnit(item as Square.CatalogObjectMeasurementUnit)
        return [unit.squareId, unit]
      }),
  )
}
