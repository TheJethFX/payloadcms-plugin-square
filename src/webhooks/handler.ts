import type { PayloadRequest } from 'payload'
import type { SquarePluginOptions } from 'src/types/index.js'

import { WebhooksHelper } from 'square'
import { syncCategories } from 'src/sync/categories.js'
import { syncInventory } from 'src/sync/inventory.js'
import { syncItems } from 'src/sync/items.js'
import { syncModifiers } from 'src/sync/modifiers.js'

/**
 * Handles incoming webhooks from Square
 * Verifies signature and processes catalog/inventory update events
 * @param req - Payload request object containing webhook data
 * @param options - Plugin configuration options
 * @returns Response with success/error status
 */
export async function handleSquareWebhook(
  req: PayloadRequest,
  options: SquarePluginOptions,
): Promise<Response> {
  // Check if webhooks are enabled
  if (!options.webhooks?.enabled) {
    return Response.json({ error: 'Webhooks not enabled' }, { status: 400 })
  }

  // Verify webhook signature
  const signature = req.headers.get('x-square-hmacsha256-signature')
  if (!signature) {
    if (options.debug) {
      // eslint-disable-next-line no-console
      console.log('Webhook rejected: Missing signature header')
    }
    return Response.json({ error: 'Missing signature' }, { status: 401 })
  }

  try {
    // Read the raw body text from the request
    // Cast to access Next.js Request methods
    const nextReq = req as unknown as Request
    const requestBody = await nextReq.text()
    const event = JSON.parse(requestBody) as { type?: string }

    if (options.debug) {
      // eslint-disable-next-line no-console
      console.log('Webhook received:', {
        event_type: event.type,
        notification_url: options.webhooks.url,
      })
    }

    // Verify the webhook signature using Square's WebhooksHelper
    const isValid = await WebhooksHelper.verifySignature({
      notificationUrl: options.webhooks.url,
      requestBody,
      signatureHeader: signature,
      signatureKey: options.webhooks.signatureKey,
    })

    if (!isValid) {
      if (options.debug) {
        // eslint-disable-next-line no-console
        console.log('Webhook rejected: Invalid signature', {
          body_preview: requestBody.substring(0, 100),
          notification_url: options.webhooks.url,
          signature_key_configured: !!options.webhooks.signatureKey,
        })
      }
      return Response.json({ error: 'Invalid signature' }, { status: 401 })
    }

    if (options.debug) {
      // eslint-disable-next-line no-console
      console.log('Webhook signature verified successfully')
    }

    // Process the webhook event
    const { payload } = req

    if (options.debug) {
      // eslint-disable-next-line no-console
      console.log('Processing Square webhook event:', event.type)
    }

    // Handle different event types
    switch (event.type) {
      case 'catalog.version.updated':
        // Catalog has been updated - resync categories, modifiers, and items
        if (options.debug) {
          // eslint-disable-next-line no-console
          console.log('Catalog updated, resyncing...')
        }
        await syncCategories(payload, options)
        await syncModifiers(payload, options)
        await syncItems(payload, options)
        break

      case 'inventory.count.updated':
        // Inventory counts have changed - resync inventory
        if (options.debug) {
          // eslint-disable-next-line no-console
          console.log('Inventory updated, resyncing...')
        }
        await syncInventory(payload, options)
        break

      default:
        if (options.debug) {
          // eslint-disable-next-line no-console
          console.log('Unhandled webhook event type:', event.type)
        }
    }

    return Response.json({ success: true })
  } catch (error) {
    if (options.debug) {
      // eslint-disable-next-line no-console
      console.error('Webhook processing error:', error)
    }
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Processing failed',
        message: 'Failed to process webhook',
      },
      { status: 500 },
    )
  }
}
