// components/landing/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-xs font-bold font-display">
            F
          </span>
          <span className="font-display font-bold text-white">FUAI</span>
          <span className="text-slate-600 text-xs ml-2">© {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-slate-500">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
