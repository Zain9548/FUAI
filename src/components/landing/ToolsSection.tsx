// components/landing/ToolsSection.tsx
import Link from 'next/link'
import { TOOLS } from '@/lib/ai'

export function ToolsSection() {
  return (
    <section id="tools" className="py-24 px-4 relative">
      {/* Section glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Six tools, endless possibilities
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Each tool is purpose-built with specialized AI prompts to deliver professional-grade output.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {TOOLS.map((tool) => (
            <Link
              href="/signup"
              key={tool.id}
              className="group relative glass rounded-2xl p-6 hover:border-white/20 transition-all overflow-hidden"
            >
              {/* Background glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`} />

              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} text-lg mb-4`}>
                {tool.icon}
              </div>

              <h3 className="font-display font-semibold text-white mb-1">{tool.label}</h3>
              <p className="text-sm text-slate-400">{tool.description}</p>

              <div className="mt-4 text-xs text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Try it free →
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Create free account to access all tools →
          </Link>
        </div>
      </div>
    </section>
  )
}
