import React from 'react'
import PropTypes from 'prop-types'

function Loading({ message = 'Loading...' }) {
  return (
    <div
      className="text-center py-10 px-5"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div
        className="w-10 h-10 border-4 border-bg-light border-t-brand-orange rounded-full animate-spin mx-auto mb-4"
        aria-hidden="true"
      />
      <p className="text-[14px] text-text-secondary">{message}</p>
    </div>
  )
}

Loading.propTypes = {
  message: PropTypes.string,
}

export default Loading
