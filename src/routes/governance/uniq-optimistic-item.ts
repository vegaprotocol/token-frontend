interface Item {
  id: string
  reference: string
}

export function uniqOptimisticItem(a: Item, b: Item) {
  // ids match so replace the old order with the new one
  if (a.id === b.id) {
    return true
  }

  // no other match criteria so keep both
  return false
}
