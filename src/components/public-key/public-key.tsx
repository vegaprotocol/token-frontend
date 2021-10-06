import './public-key.scss'

import * as React from 'react'

import { Tooltip } from '@blueprintjs/core'
import { useCopyToClipboard } from '../../hooks/use-copy-to-clipboard'

const END_CHARACTERS = 6
export const CHAR_WIDTH_DELTA = 0.6

interface IPublicKeyProps {
  publicKey: string // The 64 character public key for the user
  width: number
  fontSize?: number
}

export function PublicKey({
  publicKey,
  width,
  fontSize = 12
}: IPublicKeyProps) {
  // NOTE: this calculation probably only works for the 'Roboto Mono' font
  const charWidth = fontSize * CHAR_WIDTH_DELTA
  const key = truncate(publicKey, Math.floor(width / charWidth))
  return (
    <div className='public-key' data-testid='public-key'>
      <div title={publicKey} style={{ width, fontSize }}>
        {key}
      </div>
    </div>
  )
}

PublicKey.displayName = 'PublicKey'

interface CopyPublicKeyProps {
  publicKey: string
  width: number
  fontSize?: number
}

export function CopyPublicKey({
  publicKey,
  width,
  fontSize = 12
}: CopyPublicKeyProps) {
  const lineHeight = fontSize + 4
  const input = React.useRef<HTMLInputElement | null>(null)
  const [hovered, setHovered] = React.useState(false)
  const { copy, copied } = useCopyToClipboard()

  // NOTE: this calculation probably only works for the 'Roboto Mono' font
  const charWidth = fontSize * CHAR_WIDTH_DELTA
  const key = truncate(publicKey, Math.floor(width / charWidth))

  // on hover we select the text so users can easily manually ctrl-c to copy
  React.useEffect(() => {
    if (hovered) {
      input.current?.focus()
      input.current?.select()
    }
  }, [hovered])

  return (
    <Tooltip
      isOpen={copied}
      content={"copied"}
      targetTagName='div'
      wrapperTagName='div'>
      <div
        className='copy-public-key'
        onClick={() => copy(publicKey)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        {hovered ? (
          <input
            type='text'
            value={publicKey}
            ref={input}
            className='copy-public-key__input'
            readOnly={true}
            style={{
              fontSize,
              lineHeight: `${lineHeight}px`,
              minHeight: lineHeight
            }}
          />
        ) : (
          <div
            className='copy-public-key__text'
            style={{
              fontSize,
              lineHeight: `${lineHeight}px`,
              minHeight: lineHeight
            }}>
            {key}
          </div>
        )}
      </div>
    </Tooltip>
  )
}

CopyPublicKey.displayName = 'CopyPublicKey'

/**
 * Truncates a string based on a limit of available characters, inserting the
 * ellipsis END_CHARACTERS from the end of the string
 */
export function truncate(s: string, chars: number) {
  const ellipsis = '\u2026'

  if (chars >= s.length) {
    return s
  }

  if (chars <= END_CHARACTERS) {
    return s.slice(0, chars - 1) + ellipsis
  }

  let start = s.slice(0, chars - END_CHARACTERS - 1)
  let end = s.slice(-END_CHARACTERS)

  if (start.length <= END_CHARACTERS) {
    start = s.slice(0, END_CHARACTERS)
    const remainingEndChars = chars - start.length - 1

    if (remainingEndChars <= 0) {
      end = ''
    } else {
      end = s.slice(-remainingEndChars)
    }
  }

  return start + ellipsis + end
}
