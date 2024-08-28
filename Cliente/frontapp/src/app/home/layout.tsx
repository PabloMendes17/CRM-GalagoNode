import ThemeProvider from '../components/ThemeProvider';

export const metadata = {
  title: 'CRM Gálago',
  description: 'Ferramenta para registro de atendimento Gálago',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
