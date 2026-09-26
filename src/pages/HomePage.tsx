import { profile, projects, stack } from '../data/projects'
import type { Project } from '../data/projects'
import Icon from '../components/Icon'
import type { IconName } from '../components/Icon'
import HeroVisual from '../components/HeroVisual'
import SelectedWork from '../components/SelectedWork'
const focusAreas: {
  title: string
  description: string
  icon: IconName
  projectIds: string[]
}[] = [
  {
    title: 'Data Consistency',
    description: '트랜잭션 경계 · DB 제약 · 동시성 제어',
    icon: 'database',
    projectIds: ['engineering-memory', 'concurrency'],
  },
  {
    title: 'Failure Handling',
    description: '비동기 처리 · 장애 복구 · SSE',
    icon: 'activity',
    projectIds: ['engineering-memory', 'petcoupon'],
  },
  {
    title: 'Verification',
    description: '재현 가능한 테스트 · 측정 · 벤치마크',
    icon: 'shield',
    projectIds: ['concurrency', 'vector-db-benchmark'],
  },
  {
    title: 'Backend Infrastructure',
    description: 'Docker · CI/CD · 관측 가능성',
    icon: 'layers',
    projectIds: ['ubot', 'engineering-memory'],
  },
]

// Figures from personal work only; team results stay in their project cards.
const heroProofs = [
  {
    projectId: 'engineering-memory',
    value: '3개',
    unit: '경계',
    label: '색인 덮어쓰기 · 장애 복구 · 사용자 격리를 테스트로 고정',
  },
  {
    projectId: 'concurrency',
    value: '9개',
    unit: '전략',
    label: '동시성 제어를 같은 조건에서 비교하고 원시 결과 공개',
  },
  {
    projectId: 'vector-db-benchmark',
    value: '620회',
    unit: '측정',
    label: 'Vector DB 5종을 같은 자원·정답 기준으로 측정',
  },
]

const projectTitle = (id: string) =>
  projects.find((project) => project.id === id)?.title ?? id

export default function HomePage({
  onOpen,
}: {
  onOpen: (project: Project) => void
}) {
  return (
    <main id="main" className="page-frame">
      <section
        className="hero hero-map-intro section-inset"
        aria-labelledby="hero-title"
      >
        <div className="hero-copy">
          <div className="hero-eyebrow mono">
            <span className="small-cross" aria-hidden="true">
              +
            </span>{' '}
            BACKEND DEVELOPER
          </div>
          <h1 id="hero-title">
            동작을 넘어,
            <br />
            <span>신뢰할 수 있도록.</span>
          </h1>
          <p>
            동시 수정, 비동기 처리, 실시간 스트리밍.
            <br className="desktop-break" /> 데이터와 시스템 상태가 어긋나는
            경계를 파고듭니다.
            <br className="desktop-break" /> 재현 가능한 테스트와 측정으로
            정합성을 확인합니다.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">
              프로젝트 보기
              <Icon name="arrow" size={17} />
            </a>
          </div>
          <a
            className="hero-github text-link"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" size={15} />
            github.com/Catverdose
            <Icon name="external" size={13} />
          </a>
        </div>
        <aside className="hero-proofs" aria-labelledby="hero-proofs-title">
          <span id="hero-proofs-title" className="eyebrow">
            MEASURED, NOT ASSUMED
          </span>
          <ul>
            {heroProofs.map((proof) => (
              <li key={proof.projectId}>
                <a href={`#/projects/${proof.projectId}`}>
                  <strong>
                    {proof.value} <small>{proof.unit}</small>
                  </strong>
                  <span>{proof.label}</span>
                  <span className="hero-proof-project mono">
                    {projectTitle(proof.projectId)}
                    <Icon name="arrow" size={13} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
        <div className="hero-footnote mono">
          <span>JAVA · SPRING BOOT · BACKEND ENGINEERING</span>
        </div>
      </section>

      <HeroVisual onSelectProject={onOpen} />

      <section
        id="about"
        className="about-section"
        aria-labelledby="about-title"
      >
        <div className="about-heading section-inset">
          <div className="section-heading">
            <div>
              <div className="eyebrow">ABOUT / FOCUS</div>
              <h2 id="about-title">개발자로서 집중하는 네 가지.</h2>
              <p>
                Java · Spring Boot 백엔드 개발자입니다. 데이터 흐름을 이해하고,
                안정적인 서비스 개발과 문제 해결에 관심이 있습니다.
              </p>
            </div>
          </div>
        </div>
        <div className="focus-section">
          {focusAreas.map((area, index) => (
            <div className="focus-item" key={area.title}>
              <div className="focus-top">
                <Icon name={area.icon} size={20} />
                <span className="mono">0{index + 1}</span>
              </div>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <p className="focus-projects">
                <span>근거</span>
                {area.projectIds.map((id) => (
                  <a key={id} href={`#/projects/${id}`}>
                    {projectTitle(id)}
                  </a>
                ))}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SelectedWork onOpen={onOpen} />

      <section
        id="stack"
        className="stack-section section-inset"
        aria-labelledby="stack-title"
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">TOOLS, IN CONTEXT</div>
            <h2 id="stack-title">기술은 문제를 푸는 수단.</h2>
            <p>이름을 나열하기보다, 어떤 책임을 맡겼는지 설명합니다.</p>
          </div>
          <Icon name="terminal" size={34} />
        </div>
        <div className="stack-list">
          {stack.map((item, index) => (
            <div className="stack-row" key={item.category}>
              <span className="stack-index mono">0{index + 1}</span>
              <h3>{item.category}</h3>
              <div>
                <p>{item.technologies}</p>
                <span>{item.context}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="contact"
        className="contact-section section-inset"
        aria-labelledby="contact-title"
      >
        <span className="eyebrow">LET’S BUILD RELIABLE SYSTEMS.</span>
        <h2 id="contact-title">
          더 자세한 이야기는
          <br />
          코드에 남겨두었습니다.
        </h2>
        <p>설계의 이유와 검증의 흔적을 저장소에서 확인해 보세요.</p>
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
          <Icon name="arrow" size={17} />
        </a>
        <div className="contact-actions">
          <a
            className="button button-primary"
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="github" size={18} />
            GitHub에서 만나기
            <Icon name="external" size={15} />
          </a>
        </div>
        <span className="contact-signature mono">
          CATVERDOSE / BACKEND DEVELOPER
        </span>
      </section>
      <footer className="site-footer section-inset">
        <a className="footer-brand" href="#">
          catverdose.
        </a>
        <p>문제를 기록하고, 가설을 세우고, 검증합니다.</p>
        <a className="text-link" href="#">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </main>
  )
}
