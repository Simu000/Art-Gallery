import './LoadingSpinner.css'

export default function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <p className="spinner-text">{message}</p>
    </div>
  )
}