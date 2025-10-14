import type { SquareEnvironment } from 'square'

/**
 * Configuration options for the Square plugin
 */
export type SquarePluginOptions = {
  /**
   * Square API Access Token
   * @required
   */
  accessToken: string

  /**
   * Enable or disable debug mode
   * @default false
   */
  debug?: boolean

  /**
   * Enable or disable the plugin
   * @default true
   */
  enabled?: boolean

  /**
   * Square API Environment
   * @default SquareEnvironment.Sandbox
   */
  environment?: SquareEnvironment

  /**
   * Webhook configuration for real-time updates from Square
   */
  webhooks?: {
    /**
     * Enable webhook support
     * @default false
     */
    enabled: boolean

    /**
     * Events to subscribe to
     * @default ['catalog.version.updated', 'inventory.count.updated']
     */
    events?: string[]

    /**
     * Webhook signature key from Square Developer Dashboard
     * Used to verify webhook authenticity
     * @required if webhooks.enabled is true
     */
    signatureKey: string

    /**
     * The URL where webhooks will be received
     * Should be your Payload CMS URL + /api/square-webhook
     * @required if webhooks.enabled is true
     */
    url: string
  }
}

/**
 * Represents a Square image object
 */
export type SquareImage = {
  /**
   * The Square ID of the image
   */
  squareId: string

  /**
   * The URL of the image
   */
  url?: string
}

/**
 * Represents a measurement unit from Square
 */
export type SquareMeasurementUnit = {
  /**
   * Precision of the measurement
   */
  precision: number

  /**
   * Square ID of the measurement unit
   */
  squareId: string

  /**
   * The type of measurement unit
   */
  type: string

  /**
   * Weight unit (if applicable)
   */
  weightUnit: string
}

/**
 * Represents price money from Square
 */
export type SquarePriceMoney = {
  /**
   * Amount in the smallest currency unit
   */
  amount: number

  /**
   * Currency code (e.g., 'CAD', 'USD')
   */
  currency: string
}

/**
 * Represents an item variation from Square
 */
export type SquareItemVariation = {
  /**
   * Whether to display this variation
   */
  display?: boolean

  /**
   * Images associated with the variation
   */
  images: SquareImage[]

  /**
   * Measurement unit for the variation
   */
  measurementUnit: SquareMeasurementUnit

  /**
   * Name of the variation
   */
  name: string

  /**
   * Display order
   */
  ordinal: number

  /**
   * Price information
   */
  priceMoney: SquarePriceMoney

  /**
   * Pricing type (e.g., 'FIXED_PRICING', 'VARIABLE_PRICING')
   */
  pricingType: string

  /**
   * Square ID reference
   */
  squareId: string
}

/**
 * Represents a modifier from Square
 */
export type SquareModifier = {
  /**
   * Modifier list ID this modifier belongs to
   */
  modifierListId: string

  /**
   * Name of the modifier
   */
  name: string

  /**
   * Whether this modifier is selected by default
   */
  onByDefault?: boolean

  /**
   * Display order
   */
  ordinal: number

  /**
   * Price information for the modifier
   */
  priceMoney: SquarePriceMoney

  /**
   * Square ID of the modifier
   */
  squareId: string
}

/**
 * Represents a modifier list from Square
 */
export type SquareModifierList = {
  /**
   * Modifiers in this list
   */
  modifiers: SquareModifier[]

  /**
   * Name of the modifier list
   */
  name: string

  /**
   * Display order
   */
  ordinal: number

  /**
   * Selection type for the modifiers
   */
  selectionType: 'MULTIPLE' | 'SINGLE'

  /**
   * Square ID of the modifier list
   */
  squareId: string
}

/**
 * Represents an inventory count from Square
 */
export type SquareInventoryCount = {
  /**
   * Timestamp when the inventory count was calculated
   */
  calculatedAt: string

  /**
   * The catalog object ID (usually a variation ID)
   */
  catalogObjectId: string

  /**
   * Location ID where this inventory is tracked
   */
  locationId: string

  /**
   * Quantity as a string (Square uses string for decimal precision)
   */
  quantity: string

  /**
   * Inventory state
   */
  state:
    | 'IN_STOCK'
    | 'ORDERED_FROM_VENDOR'
    | 'RECEIVED_FROM_VENDOR'
    | 'RESERVED_FOR_SALE'
    | 'RETURNED_BY_CUSTOMER'
    | 'SOLD'
    | 'SOLD_ONLINE'
}
