import React from 'react'

export default function Section({ id, title, children, subtitle }) {
  return (
    <section id={id} className="relative mx-auto w-full">
      <div className="rounded-2xl border border-white/10 bg-gray-800/50 shadow-lg">
        <div className="p-6 sm:p-10">
          {title && (
            <header className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
              {subtitle && <p className="mt-2 text-gray-400">{subtitle}</p>}
            </header>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
