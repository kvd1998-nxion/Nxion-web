import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { cn } from '../../lib/utils'

export function ServiceCard({ service, index }) {
  const Icon = Icons[service.icon] || Icons.Zap

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative p-6 rounded-lg border transition-colors duration-300 cursor-default'
      )}
      style={{
        backgroundColor: '#112240',
        borderColor: 'rgba(136,146,176,0.15)',
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(100,255,218,0.35)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(136,146,176,0.15)'
      }}
    >
      {/* Top-left accent line */}
      <div
        className="absolute top-0 left-0 w-10 h-[2px] rounded-tr rounded-bl-none rounded-br-none"
        style={{ backgroundColor: '#64FFDA' }}
      />

      <div className="mb-4" style={{ color: '#64FFDA' }}>
        <Icon size={28} strokeWidth={1.5} />
      </div>

      <h3 className="text-white font-semibold text-lg mb-2 leading-snug">
        {service.title}
      </h3>
      <p className="text-sm leading-relaxed mb-5" style={{ color: '#8892B0' }}>
        {service.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {service.tags.map(tag => (
          <span
            key={tag}
            className="px-2.5 py-0.5 text-xs rounded-full border font-medium"
            style={{ color: '#64FFDA', borderColor: 'rgba(100,255,218,0.25)' }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
