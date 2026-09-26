import type { Project } from '../data/projects'
import Icon from './Icon'
import './project-design.css'

const designProjects = new Set(['engineering-memory', 'ubot', 'planly'])

export function hasProjectDesign(projectId: string) {
  return designProjects.has(projectId)
}

export default function ProjectDesign({ project }: { project: Project }) {
  if (!hasProjectDesign(project.id)) return null
  return (
    <section className="project-design" aria-labelledby="design-title">
      <div className="design-heading">
        <span className="eyebrow">DESIGN AT A GLANCE</span>
        <h2 id="design-title">
          {project.id === 'engineering-memory'
            ? '계산이 끝나도, 저장할 수 있는 것은 아닙니다.'
            : project.id === 'ubot'
              ? '같은 DB 조건을 로컬과 CI에 적용합니다.'
              : '인증 다음에는 리소스의 소유권을 확인합니다.'}
        </h2>
      </div>
      {project.id === 'engineering-memory' && (
        <>
          <div className="design-columns">
            <div className="design-path">
              <span className="design-path-label mono">문서의 상태</span>
              <div className="design-node">
                <strong>문서 v1</strong>
                <span>작업 A가 version · attempt를 캡처</span>
              </div>
              <span className="design-down" aria-hidden="true">
                ↓ 문서 수정
              </span>
              <div className="design-node is-current">
                <strong>문서 v2 · PENDING</strong>
                <span>기존 attempt 해제 · 최신 세대 재색인 대기</span>
              </div>
            </div>
            <div className="design-path">
              <span className="design-path-label mono">비동기 작업</span>
              <div className="design-node">
                <strong>작업 A · 문서 v1 계산</strong>
                <span>문서가 수정되는 동안에도 계산은 진행</span>
              </div>
              <span className="design-down" aria-hidden="true">
                ↓ 계산 완료
              </span>
              <div className="design-node is-rejected">
                <strong>저장 조건 불일치 → 결과 폐기</strong>
                <span>현재 v2와 이전 v1 · attempt를 대조</span>
              </div>
            </div>
          </div>
          <div className="design-conclusion">
            <Icon name="shield" size={18} />
            <p>
              <strong>version · PENDING 상태 · attempt</strong>가 모두 맞을 때만
              chunk 교체와 READY 전환을 하나의 트랜잭션으로 확정합니다.
            </p>
          </div>
        </>
      )}
      {project.id === 'ubot' && (
        <>
          <div className="design-shared">
            <span className="design-path-label mono">
              SHARED DATABASE DEFINITION
            </span>
            <strong>PostgreSQL + pgvector + PostGIS</strong>
            <p>공통 Dockerfile · Flyway로 extension 생성</p>
          </div>
          <div className="design-branch" aria-hidden="true" />
          <div className="design-columns">
            <div className="design-node">
              <span className="design-path-label mono">LOCAL</span>
              <strong>Docker Compose</strong>
              <span>팀의 로컬 개발 환경</span>
            </div>
            <div className="design-node">
              <span className="design-path-label mono">CI</span>
              <strong>Testcontainers</strong>
              <span>테스트용 독립 DB · 같은 확장 구성</span>
            </div>
          </div>
          <div className="design-conclusion">
            <Icon name="check" size={18} />
            <p>
              실제 DB에서 <strong>vector 저장·검색과 PostGIS 공간 함수</strong>
              를 검증합니다. 테스트의 임베딩 모델은 결정적인 대역을 사용합니다.
            </p>
          </div>
        </>
      )}
      {project.id === 'planly' && (
        <>
          <ol className="design-steps">
            <li>
              <span className="mono">01</span>
              <div>
                <strong>인증된 사용자 + Todo ID로 조회</strong>
                <p>사용자 범위에서 찾을 수 없으면 생성 중단</p>
              </div>
            </li>
            <li>
              <span className="mono">02</span>
              <div>
                <strong>기존 Todo–Schedule 연결 확인</strong>
                <p>이미 연결된 Todo에는 중복 생성 거부</p>
              </div>
            </li>
            <li>
              <span className="mono">03</span>
              <div>
                <strong>일정 생성과 연결 저장</strong>
                <p>하나의 트랜잭션 안에서 처리 · DB 유니크 충돌 처리</p>
              </div>
            </li>
          </ol>
          <div className="design-conclusion">
            <Icon name="shield" size={18} />
            <p>
              <strong>로그인 여부, 리소스 소유권, 연결의 중복</strong>을 각각
              확인합니다. 실제 사용자 범위 조회와 연동 구현을 아래 코드에서
              확인할 수 있습니다.
            </p>
          </div>
        </>
      )}
      <a
        className="design-source"
        href={
          project.id === 'engineering-memory'
            ? project.cases[0].evidence?.[0].href
            : project.id === 'ubot'
              ? project.proofs?.[0].href
              : project.cases[0].evidence?.[0].href
        }
        target="_blank"
        rel="noreferrer"
      >
        관련 구현 확인 <Icon name="external" size={13} />
      </a>
    </section>
  )
}
