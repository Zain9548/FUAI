// components/landing/FeaturesSection.tsx
export function FeaturesSection() {
  const features = [
    {
      icon: '⚡',
      title: 'Instant results',
      desc: 'AI processes your text in under 3 seconds. No waiting, no queues.',
    },
    {
      icon: '🔒',
      title: 'Privacy first',
      desc: 'Your content is never stored beyond your history. Delete anytime.',
    },
    {
      icon: '🎯',
      title: 'Tool-specific AI',
      desc: 'Each tool uses a specialized system prompt for best-in-class output.',
    },
    {
      icon: '📊',
      title: 'Usage tracking',
      desc: 'Monitor your monthly usage and upgrade seamlessly when needed.',
    },
    {
      icon: '🕓',
      title: 'Full history',
      desc: 'Every generation is saved. Search, revisit, or delete past results.',
    },
    {
      icon: '🌐',
      title: 'Multi-language',
      desc: 'Translate content into 50+ languages with one click.',
    },
  ]

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Why teams choose FUAI
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Designed for speed, precision, and privacy. Every feature built with real workflows in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 hover:bg-white/8 transition-all group"
            >
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="font-display font-semibold text-white mb-2 group-hover:gradient-text transition-all">
                {f.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
