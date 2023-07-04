import './globals.css'

export const metadata = {
  title: 'D4 Calc',
  description: 'Diablo 4 Item Comparison & Dps Evaluation Tool',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
