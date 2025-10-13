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
