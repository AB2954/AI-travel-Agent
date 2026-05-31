import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Voyage AI — Next-Gen Travel Agent',
  description: 'Your intelligent copilot for world exploration.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="bg-zinc-950 text-zinc-50 antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
