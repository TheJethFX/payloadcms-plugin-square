import type { SquareItemVariation, SquareMeasurementUnit } from 'src/types/index.js'

import { Square } from 'square'

/**
 * Maps a Square item variation to the plugin format
 * @param variation - Square catalog object item variation
 * @param imageUrlMap - Map of image IDs to URLs
 * @param measurementUnitMap - Map of measurement unit IDs to units
 * @returns Mapped SquareItemVariation object
 */
export function mapItemVariation(
  variation: Square.CatalogObjectItemVariation,
  imageUrlMap: Map<string, string>,
  measurementUnitMap: Map<string, SquareMeasurementUnit>,
): SquareItemVariation {
  const defaultMeasurementUnit: SquareMeasurementUnit = {
    type: 'N/A',
    precision: 0,
    squareId: 'N/A',
    weightUnit: 'N/A',
  }

  return {
    name: variation?.itemVariationData?.name || 'N/A',
    display: variation?.isDeleted,
    images:
      variation?.itemVariationData?.imageIds?.map((imageId) => ({
        squareId: imageId,
        url: imageUrlMap.get(imageId),
      })) || [],
    measurementUnit: variation?.itemVariationData?.measurementUnitId
      ? measurementUnitMap.get(variation.itemVariationData.measurementUnitId) ||
        defaultMeasurementUnit
      : defaultMeasurementUnit,
    ordinal: variation?.itemVariationData?.ordinal || 0,
    priceMoney: {
      amount: Number(variation?.itemVariationData?.priceMoney?.amount || 0),
      currency: variation?.itemVariationData?.priceMoney?.currency || 'CAD',
    },
    pricingType: variation?.itemVariationData?.pricingType || 'FIXED_PRICING',
    squareId: variation.itemVariationData?.itemId || 'N/A',
  }
}

/**
 * Maps all variations for items and creates a lookup map
 * @param items - Array of Square catalog items
 * @param imageUrlMap - Map of image IDs to URLs
 * @param measurementUnitMap - Map of measurement unit IDs to units
 * @returns Map of item ID to array of variations
 */
export function createItemVariationsMap(
  items: Square.CatalogObjectItem[],
  imageUrlMap: Map<string, string>,
  measurementUnitMap: Map<string, SquareMeasurementUnit>,
): Map<string, SquareItemVariation[]> {
  return new Map(
    items.map((item) => {
      const variations =
        (item.itemData?.variations?.filter(
          (v) => v.type === Square.CatalogObjectType.ItemVariation,
        ) as Square.CatalogObjectItemVariation[]) ?? []

      const mappedVariations = variations.map((variation) =>
        mapItemVariation(variation, imageUrlMap, measurementUnitMap),
      )

      return [item.id, mappedVariations]
    }),
  )
}
