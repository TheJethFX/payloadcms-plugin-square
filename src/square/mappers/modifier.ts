import type { Square } from 'square'
import type { SquareModifier, SquareModifierList } from 'src/types/index.js'

/**
 * Maps a Square modifier to the plugin format
 * @param object - Square catalog object of type MODIFIER
 * @param modifierListId - ID of the modifier list this modifier belongs to
 * @returns Mapped SquareModifier object
 */
export function mapModifier(
  object: Square.CatalogObjectModifier,
  modifierListId: string,
): SquareModifier {
  return {
    name: object.modifierData?.name || 'N/A',
    modifierListId,
    onByDefault: object.modifierData?.onByDefault ?? undefined,
    ordinal: object.modifierData?.ordinal || 0,
    priceMoney: {
      amount: Number(object.modifierData?.priceMoney?.amount || 0),
      currency: object.modifierData?.priceMoney?.currency || 'USD',
    },
    squareId: object.id || 'N/A',
  }
}

/**
 * Maps a Square modifier list to the plugin format
 * @param object - Square catalog object of type MODIFIER_LIST
 * @param relatedObjects - Array of related catalog objects (includes modifiers)
 * @returns Mapped SquareModifierList object
 */
export function mapModifierList(
  object: Square.CatalogObjectModifierList,
  relatedObjects: Square.CatalogObject[],
): SquareModifierList {
  const modifierIds = object.modifierListData?.modifiers?.map((m) => m.id) || []

  const modifiers = relatedObjects
    .filter((obj) => obj.type === 'MODIFIER' && modifierIds.includes(obj.id))
    .map((obj) => mapModifier(obj as Square.CatalogObjectModifier, object.id))
    .sort((a, b) => a.ordinal - b.ordinal)

  return {
    name: object.modifierListData?.name || 'N/A',
    modifiers,
    ordinal: object.modifierListData?.ordinal || 0,
    selectionType: object.modifierListData?.selectionType || 'SINGLE',
    squareId: object.id || 'N/A',
  }
}

/**
 * Creates a map of modifier list IDs to their data
 * @param relatedObjects - Array of related catalog objects from Square API
 * @returns Map of modifier list ID to SquareModifierList
 */
export function createModifierListMap(
  relatedObjects: Square.CatalogObject[],
): Map<string, SquareModifierList> {
  const modifierLists = relatedObjects.filter((obj) => obj.type === 'MODIFIER_LIST')

  return new Map(
    modifierLists.map((obj) => {
      const modifierList = mapModifierList(obj as Square.CatalogObjectModifierList, relatedObjects)
      return [modifierList.squareId, modifierList]
    }),
  )
}
