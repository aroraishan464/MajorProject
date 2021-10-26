import React from 'react'
import InfoIcon from './icons/InfoIcon'
import SuccessIcon from './icons/SuccessIcon'
import ErrorIcon from './icons/ErrorIcon'
import CloseIcon from './icons/CloseIcon'

const alertStyle = {
  backgroundColor: 'white',
  color: '#252537',
  padding: '5px 10px',
  display: 'flex',
  height: '40px',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 9px 50px hsl(20deg 67% 75% / 31%)',
  borderRadius: "25px",
  fontFamily: 'Arial',
  boxSizing: 'border-box',
  width: 'auto',
}

const buttonStyle = {
  marginLeft: '20px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: '#FFFFFF'
}

const AlertTemplate = ({ message, options, style, close }) => {
  return (
    <div style={{ ...alertStyle, ...style }}>
      {options.type === 'info' && <InfoIcon />}
      {options.type === 'success' && <SuccessIcon />}
      {options.type === 'error' && <ErrorIcon />}
      <span style={{ flex: 2 }}>{message}</span>
      <button onClick={close} style={buttonStyle}>
        <CloseIcon />
      </button>
    </div>
  )
}

export default AlertTemplate