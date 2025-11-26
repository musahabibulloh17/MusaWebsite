import React from 'react'
import './Card.css'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  padding?: 'none' | 'small' | 'medium' | 'large'
  className?: string
  onClick?: () => void
  hoverable?: boolean
  interactive?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  className = '',
  onClick,
  hoverable = false,
  interactive = false
}) => {
  const cardClasses = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    hoverable ? 'card-hoverable' : '',
    interactive ? 'card-interactive' : '',
    onClick ? 'card-clickable' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

export default Card




