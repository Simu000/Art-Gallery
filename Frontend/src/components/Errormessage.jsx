import './ErrorMessage.css'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-wrap">
      <div className="error-icon">!</div>
      <p className="error-text">{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button className="error-retry" onClick={onRetry}>Try Again</button>
      )}
    </div>
  )
}