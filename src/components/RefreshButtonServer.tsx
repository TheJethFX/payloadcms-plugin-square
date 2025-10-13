import type { FC } from 'react'

import { RefreshButtonClient } from './RefreshButtonClient.js'

export type RefreshButtonProps = {
  collection: {
    label: string
    slug: string
  }
  label: string
}

export const RefreshButtonServer: FC<RefreshButtonProps> = ({ collection, label }) => {
  return <RefreshButtonClient collection={collection} label={label} />
}
