import React from 'react'
import PropTypes from 'prop-types'
import { AlertTriangle } from 'lucide-react'

function ErrorMessage({ message, onRetry }) {
  return (
    <div
      className="text-center py-10 px-5 bg-card rounded border border-border-gray shadow-card"
      role="alert"
    >
      <AlertTriangle
        size={40}
        className="mx-auto mb-4 text-error-red"
        aria-hidden="true"
      />
      <h2 className="text-[21px] font-bold text-text-primary mb-2">
        Something went wrong
      </h2>
      <p className="text-[14px] text-text-secondary m-0 mb-6">{message}</p>
      {onRetry && (
        <button
          type="button"
          className="bg-brand-orange text-text-primary border border-brand-orange-border rounded-lg py-2 px-2.5 text-[13px] font-bold cursor-pointer min-w-[100px] transition-colors hover:bg-brand-orange-hover focus-ring"
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  )
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
}

export default ErrorMessage
