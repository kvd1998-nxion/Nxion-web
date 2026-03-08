import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { meta: {}, content: raw }

  const meta = {}
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) return
    const key = line.slice(0, colonIdx).trim()
    let val = line.slice(colonIdx + 1).trim()
    // Strip surrounding quotes
    val = val.replace(/^["']|["']$/g, '')
    // Parse arrays like ["a", "b"]
    if (val.startsWith('[')) {
      try {
        meta[key] = JSON.parse(val)
      } catch {
        meta[key] = val
      }
    } else {
      meta[key] = val
    }
  })

  return { meta, content: match[2] }
}

export function slugify(filename) {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}
