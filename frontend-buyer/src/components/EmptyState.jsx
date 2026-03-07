import React from 'react'
import PropTypes from 'prop-types'

function EmptyState({ icon, title = 'No results found', description }) {
  return (
    <div className="text-center py-10 px-5 bg-card rounded border border-border-gray shadow-card">
      {icon != null && (
        <div className="flex justify-center mb-4 text-text-muted" aria-hidden="true">
          {icon}
        </div>
      )}
      <h2 className="text-[21px] font-bold text-text-primary mb-2">{title}</h2>
      {description && (
        <p className="text-[14px] text-text-secondary m-0">{description}</p>
      )}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
}

export default EmptyState
