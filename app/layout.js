import './globals.css'
import { Inter } from 'next/font/google'
import SupabaseProvider from '@/components/supabase-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TaniPro - Login Only',
  description: 'Tes login Supabase',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
