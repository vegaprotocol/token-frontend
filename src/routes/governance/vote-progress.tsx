import './vote-progress.scss'

import React from 'react'

export const VoteProgress = ({
  progress,
  threshold
}: {
  threshold: number
  progress: number
}) => {
  return (
    <>
      <div
        data-testid='vote-progress-indicator'
        className='proposal-toast__vote-progress-indicator'
        style={{ left: `${threshold}%` }}></div>
      <div className='bp3-progress-bar bp3-no-stripes proposal-toast__vote-progress-container'>
        <div
          className='bp3-progress-meter proposal-toast__vote-progress-bar'
          data-testid='vote-progress-bar'
          style={{
            width: `${progress}%`
          }}></div>
      </div>
    </>
  )
}
