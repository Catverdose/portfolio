import type { Project } from '../data/projects'

export default function Contribution({ project }: { project: Project }) {
  if (!project.contribution?.length) return null
  return (
    <ul className="contribution-list" aria-label="기여 규모">
      {project.contribution.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
