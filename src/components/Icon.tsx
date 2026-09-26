import type { CSSProperties } from 'react'

export type IconName =
  | 'arrow'
  | 'external'
  | 'download'
  | 'github'
  | 'code'
  | 'database'
  | 'layers'
  | 'check'
  | 'close'
  | 'menu'
  | 'shield'
  | 'activity'
  | 'terminal'
  | 'branch'

const paths: Record<IconName, React.ReactNode> = {
  arrow: (
    <>
      <path d="M4 12h15m-6-6 6 6-6 6" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6m0-6L10 14" />
      <path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5M4 15v5h16v-5" />
    </>
  ),
  github: (
    <>
      <path d="M9 19c-4 1-4-2-6-2m12 5v-4c0-1 .1-1.7-.5-2.4 3.4-.4 6.5-1.6 6.5-6.1 0-1.4-.5-2.6-1.4-3.6.1-.4.6-1.7-.1-3.4 0 0-1.1-.4-3.6 1.3a12 12 0 0 0-6.5 0C6.9 2.1 5.8 2.5 5.8 2.5c-.7 1.7-.2 3-.1 3.4A5 5 0 0 0 4.3 9.5c0 4.5 3.1 5.7 6.5 6.1-.5.5-.8 1.3-.8 2.4v4" />
    </>
  ),
  code: (
    <>
      <path d="m8 5-7 7 7 7m8-14 7 7-7 7m-3-17-2 20" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 10 6-10 6L2 9l10-6Zm-10 12 10 6 10-6M2 12l10 6 10-6" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  shield: (
    <>
      <path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6l9-4Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  activity: <path d="M2 12h4l3-8 6 16 3-8h4" />,
  terminal: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m6 8 4 4-4 4m7 0h5" />
    </>
  ),
  branch: (
    <>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M6 7v10m12-10v2c0 4-12 3-12 7" />
    </>
  ),
}

export default function Icon({
  name,
  size = 18,
  style,
}: {
  name: IconName
  size?: number
  style?: CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {paths[name]}
    </svg>
  )
}
