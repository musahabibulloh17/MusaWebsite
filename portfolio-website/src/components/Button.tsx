import React from 'react'
import './Button.css'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  icon,
  iconPosition = 'left'
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    disabled ? 'btn-disabled' : '',
    className
  ].filter(Boolean).join(' ')

  const iconElement = icon && (
    <span className={`btn-icon ${iconPosition === 'right' ? 'btn-icon-right' : ''}`}>
      {icon}
    </span>
  )

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {iconPosition === 'left' && iconElement}
      <span className="btn-text">{children}</span>
      {iconPosition === 'right' && iconElement}
    </button>
  )
}

export default Button



