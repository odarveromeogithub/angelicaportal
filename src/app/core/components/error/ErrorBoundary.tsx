import React from 'react'

type ErrorBoundaryProps = {
  fallback?: React.ReactNode
  children: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: unknown) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl shadow-sm p-6 text-center">
            <h2 className="text-xl font-semibold text-red-700">Something went wrong</h2>
            <p className="text-sm text-gray-600 mt-2">Please try refreshing the page or contact support.</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
