import type { EvidenceLink } from '../data/projects'
import Icon from './Icon'

export default function EvidenceLinks({
  links,
  compact = false,
}: {
  links?: EvidenceLink[]
  compact?: boolean
}) {
  if (!links?.length) return null
  return (
    <ul className={`evidence-links${compact ? ' is-compact' : ''}`}>
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noreferrer">
            <span>
              <strong>{link.label}</strong>
              {!compact && link.detail && <span>{link.detail}</span>}
            </span>
            <Icon name="external" size={14} />
          </a>
        </li>
      ))}
    </ul>
  )
}
