'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-white text-2xl font-bold mb-4">エラーが発生しました</h1>
            <p className="text-gray-400 mb-6">
              申し訳ございません。予期しないエラーが発生しました。
              ページを再読み込みしてお試しください。
            </p>
            
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center space-x-2 bg-amber-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              <span>ページを再読み込み</span>
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                  エラー詳細 (開発モード)
                </summary>
                <pre className="mt-2 p-4 bg-gray-800 rounded text-red-400 text-sm overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}