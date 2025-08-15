import './globals.css'
import React from 'react'

export const metadata = { title: 'DubaiCar – Valutatore Import Auto' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <div className="mx-auto max-w-6xl p-4 md:p-8">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">DubaiCar · Valutatore Import Auto</h1>
            <nav className="text-sm text-gray-600 space-x-4">
              <a href="/" className="hover:underline">Dashboard</a>
              <a href="/vehicles" className="hover:underline">Veicoli</a>
              <a href="/vehicles/new" className="hover:underline">Nuovo</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
