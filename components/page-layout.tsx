"use client"

import type { ReactNode } from "react"

interface PageLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  showBackButton?: boolean
  onBack?: () => void
}

export function PageLayout({ children, title, description, showBackButton, onBack }: PageLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {(title || showBackButton) && (
        <div className="mb-8">
          {showBackButton && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          {title && (
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
              {description && <p className="text-muted-foreground text-lg">{description}</p>}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
