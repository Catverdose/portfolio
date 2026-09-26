export type ProjectKind = 'PERSONAL' | 'TEAM' | 'EXPERIMENT'

export interface CaseStudy {
  title: string
  problem: string
  decision: string
  verification: string
}

export interface Project {
  id: string
  number: string
  title: string
  kind: ProjectKind
  typeLabel: string
  description: string
  role: string
  technologies: string[]
  highlights: string[]
  github: string
  live?: string
  overview: string
  cases: CaseStudy[]
  limitations: string
  evidence?: { label: string; href: string }
}

export const profile = {
  name: 'Catverdose',
  github: 'https://github.com/Catverdose',
  pdf: '/catverdose-portfolio.pdf',
  live: 'https://memory.catverdose.xyz',
  // 2026-09-26 확인: ENOTFOUND. 도메인 연결을 확인한 뒤 true로 변경합니다.
  liveAvailable: false,
}

export const projects: Project[] = [
  {
    id: 'engineering-memory',
    number: '01',
    title: 'Engineering Memory',
    kind: 'PERSONAL',
    typeLabel: '개인 프로젝트',
    description: '개발 기록을 근거로 답하는 RAG 지식 어시스턴트',
    role: '설계 · 구현 · 인프라 · 문서 전체',
    technologies: ['Spring Boot', 'Go', 'PostgreSQL', 'pgvector', 'Ollama'],
    highlights: [
      '비동기 색인의 stale write 차단',
      '서버 장애 이후 대화 상태 복구',
    ],
    github: 'https://github.com/Catverdose/engineering-memory',
    live: profile.liveAvailable ? profile.live : undefined,
    overview:
      '프로젝트 문서, 장애 기록, 기술 결정과 학습 노트를 저장하고 그 기록을 근거로 답합니다. 연결과 트래픽 제어는 nginx·Go Gateway가, 데이터 정합성과 도메인 규칙은 Spring Boot·PostgreSQL이 책임집니다. GCP L4 Spot 환경에 Docker와 NVIDIA runtime을 구성해 배포하고 색인·검색을 E2E로 검증했습니다.',
    cases: [
      {
        title: '늦게 끝난 색인이 최신 문서를 덮어쓰지 않도록',
        problem:
          '등록 API가 202 Accepted를 반환한 뒤 비동기 색인이 진행됩니다. 이 사이 문서가 수정되면 이전 작업의 embedding이 새 문서를 덮어쓸 수 있습니다.',
        decision:
          '저장 직전에 version·status·attempt UUID를 확인합니다. 일치하지 않으면 결과를 버리고 재색인을 예약합니다. 기존 chunk 삭제, 새 chunk 삽입, READY 전환은 한 트랜잭션으로 처리합니다.',
        verification:
          '문서 단위 bounded queue, 작업 coalescing, 재기동 복구를 구성했습니다. 단위·통합 테스트로 상태 전이와 저장 경계를 검증합니다.',
      },
      {
        title: '답변 생성 도중 서버가 멈춰도 상태는 남도록',
        problem:
          'LLM 생성은 오래 걸릴 수 있습니다. 서버가 재기동되면 사용자가 끝나지 않는 답변을 보게 될 수 있습니다.',
        decision:
          'beginTurn에서 사용자 메시지와 GENERATING 답변을 먼저 저장합니다. completeTurn에서 답변과 근거를 확정하고, 기동 시 남은 GENERATING은 FAILED로 복구합니다.',
        verification:
          '유사도 0.45 이상인 근거가 없으면 NO_CONTEXT를 저장하고 LLM 호출을 생략합니다. 근거 없는 답변과 불필요한 GPU 사용을 함께 제한합니다.',
      },
      {
        title: '사용자 데이터 격리를 DB까지 이어가기',
        problem:
          '하나의 DB를 공유하는 환경에서는 조회 조건의 실수 하나가 다른 사용자의 기록 노출로 이어질 수 있습니다.',
        decision:
          'owner ID는 인증 principal에서만 가져옵니다. 모든 조회에 owner 조건을 적용하고 (id, owner_id) 복합 FK로 교차 사용자 참조를 DB에서 거부합니다.',
        verification:
          '벡터 검색의 owner·READY·version·model 필터를 정렬·LIMIT 전에 적용합니다. 애플리케이션 조건과 DB 제약을 함께 두어 격리를 검증합니다.',
      },
    ],
    limitations:
      '제출 PDF의 Phase 1 기준으로 실패한 색인은 수동 재색인으로 복구하며, 마이그레이션 도구는 미도입 상태입니다. 운영 변경 사항은 저장소 문서를 기준으로 확인할 수 있습니다.',
    evidence: {
      label: '아키텍처 문서',
      href: 'https://github.com/Catverdose/engineering-memory/blob/main/docs/architecture.md',
    },
  },
  {
    id: 'petcoupon',
    number: '02',
    title: 'PetCoupon',
    kind: 'TEAM',
    typeLabel: '팀 · 백엔드 6명',
    description: '반려동물 이벤트 기반 선착순 쿠폰 발급 시스템',
    role: '이벤트·쿠폰 관리 · 관리자 API · 스케줄러 · 모니터링',
    technologies: ['Spring Boot', 'JPA', 'MySQL', 'Redis', 'SSE'],
    highlights: [
      '관리자 수정과 발급·스케줄러의 경합 제어',
      'SSE 모니터링 오류의 자기증폭 차단',
    ],
    github: 'https://github.com/PetCare-Platform/petcoupon-backend',
    overview:
      '대량 요청에서도 초과 발급 없이 사용자당 한 장을 발급하는 팀 프로젝트입니다. Redis·Kafka 발급 파이프라인은 팀원이 담당했고, 저는 파이프라인이 참조하는 이벤트·쿠폰 관리와 관리자 운영·모니터링을 맡았습니다. 제출 PDF 기준 병합 PR 24개, 통합 테스트 시나리오 16개입니다.',
    cases: [
      {
        title: '여러 갱신 경로가 같은 데이터를 만날 때',
        problem:
          '관리자 수정, 발급 처리, 상태 스케줄러가 같은 이벤트·쿠폰을 동시에 갱신합니다. 변경 유실과 락 순서 차이에 따른 교착 가능성이 있습니다.',
        decision:
          '관리자 수정 경로를 PESSIMISTIC_WRITE로 직렬화하고 락 획득 순서를 통일했습니다. 상태 전이는 현재 상태를 조건에 둔 UPDATE로 중복 적용을 막았습니다.',
        verification:
          '통합 테스트로 경합 시나리오를 확인하고 조회 SQL 수를 고정했습니다. 팀 공동 부하 테스트에서는 20,000 요청, 초과·중복 발급 0건, 1,030 TPS를 기록했습니다. 이는 발급 파이프라인을 포함한 팀 전체 성과입니다.',
      },
      {
        title: '모니터링 장애가 비즈니스 요청을 막지 않도록',
        problem:
          'SSE 연결 종료 → 예외 로깅 → 로그 재전송 → 전송 실패가 반복되며 오류가 스스로 증폭됐습니다. 느린 구독자도 로그를 쓰는 요청에 영향을 줄 수 있었습니다.',
        decision:
          'feedback loop를 끊고 구독자마다 bounded queue를 분리했습니다. 큐가 차면 비즈니스 요청을 차단하는 대신 모니터링 이벤트를 버립니다.',
        verification:
          '손실은 events-dropped 이벤트와 monitoring.sse.events.dropped 지표로 노출합니다. 로그 마스킹 비용에도 상한을 두어 서비스 가용성을 우선했습니다.',
      },
    ],
    limitations:
      'Redis Stream DLQ의 관리자 조회·재처리 API는 남은 과제입니다. 현재 XRANGE로 수동 확인하며, 처리 절차를 먼저 정의해야 합니다.',
    evidence: {
      label: '직접 기여한 PR',
      href: 'https://github.com/PetCare-Platform/petcoupon-backend/pulls?q=is%3Apr+is%3Amerged+author%3ACatverdose',
    },
  },
  {
    id: 'concurrency',
    number: '03',
    title: 'Coupon Concurrency',
    kind: 'EXPERIMENT',
    typeLabel: '개인 실험 · 팀 실험 확장',
    description: '초과 발급이 없어도 깨지는 동시성 제어의 경계',
    role: '9개 전략 설계 · 구현 · 측정 · 분석',
    technologies: ['Java 21', 'MySQL', 'Redis', 'k6'],
    highlights: [
      'lost update·정상 회원 탈락·연결 고갈 재현',
      '응답·재고 원장·대상자 발급을 함께 검증',
    ],
    github: 'https://github.com/Catverdose/concurrency-strategies',
    overview:
      '같은 발급 흐름에서 재고 예약 전략만 바꿔 비교했습니다. 회원당 한 번의 요청에서 드러나지 않는 문제를 찾기 위해, 10,000명이 서로 다른 requestId로 세 번씩 요청하는 시나리오로 확장했습니다.',
    cases: [
      {
        title: '최종 재고가 맞아도 정상 회원은 탈락할 수 있다',
        problem:
          'REDIS_DECR와 LUA는 중복 회원을 확인하기 전에 재고를 예약합니다. DB 유니크 충돌을 보상하기 전까지 일시적으로 품절이 됩니다.',
        decision:
          '초과 발급 여부뿐 아니라 대상자 전원 발급, 응답 분류, 재고 원장의 세 기준을 분리해 검사했습니다.',
        verification:
          'VU 50에서 DECR는 9,999명, LUA는 9,998명에게 발급됐습니다. 최종 원장은 일치했지만 정상 회원의 탈락을 확인했습니다.',
      },
      {
        title: 'WATCH 재시도가 연결을 소진하는 구조',
        problem:
          '충돌 재시도마다 Redis 연결을 새로 만들고 닫으면서 TIME_WAIT가 약 14,900개까지 증가했습니다. 로컬 동적 포트 16,384개에 근접했습니다.',
        decision:
          '다른 전략의 실험을 오염시키지 않도록 WATCH만 단독 실행해 원인을 분리했습니다.',
        verification:
          'VU 10·50·100·200에서 재현했습니다. VU 50에서는 30,000 요청 중 26,991건이 응답을 받지 못했습니다. 역순 재실행에서도 실패 유형은 같았습니다.',
      },
    ],
    limitations:
      '로컬 단일 호스트의 1차 실험입니다. 조건별 1회와 역순 재실행 결과로 성능 순위를 확정하지 않았습니다. JVM_LOCK의 통과도 단일 인스턴스 조건에 한정됩니다.',
  },
  {
    id: 'vector-db-benchmark',
    number: '04',
    title: 'Vector DB Benchmark',
    kind: 'EXPERIMENT',
    typeLabel: 'UBot 팀 내 실험',
    description: '같은 검색 품질, 같은 자원 조건에서의 비교',
    role: 'Benchmark harness 구현 · 측정 설계',
    technologies: ['pgvector', 'Qdrant', 'Milvus', 'Weaviate', 'OpenSearch'],
    highlights: [
      '5개 DB · 14개 구성 · 620 measurements',
      'Recall을 먼저 확인하고 지연·처리량 비교',
    ],
    github: 'https://github.com/ureca-UBot/UBot-VertorDBTest',
    overview:
      'RAG 서비스의 Vector DB 후보를 비교하는 harness입니다. 합성 10k chunk, BGE-M3 dense 1024d, cosine Top-10 조건에서 DB별 4 vCPU·8 GiB를 고정하고, 검색 설정 124개를 독립 재구축 5회로 측정했습니다.',
    cases: [
      {
        title: '비교 전에 입력과 정답부터 고정',
        problem:
          '입력 데이터나 검색 품질이 다르면 latency 비교만으로는 서비스에 적합한 DB를 결정할 수 없습니다.',
        decision:
          '입력은 SHA-256으로 검증하고 Java exact cosine search를 Ground Truth로 사용했습니다. Calibration query와 evaluation query를 분리했습니다.',
        verification:
          'Recall@10, latency, QPS, CPU, RAM, index readiness를 함께 수집했습니다. 각 측정점에서 자원 샘플을 30개 이상 기록했습니다.',
      },
      {
        title: '불리한 측정도 결과에서 지우지 않기',
        problem:
          '이상치와 warm-up 미달을 제거하면 실제 변동성이 가려지고 특정 구성이 과대평가될 수 있습니다.',
        decision:
          '원시 JSON·CSV와 warning 170건을 보존했습니다. 근거 없는 Recall·p95·RAM 임계값을 탈락 판정에 사용하지 않았습니다.',
        verification:
          'Milvus DISKANN은 5회 관찰에서 Recall 변동이 있었습니다. 실제 1k~10k chunk → pgvector baseline → 독립 holdout → 운영 복잡도 검토를 다음 검증 단계로 정의했습니다.',
      },
    ],
    limitations:
      '합성 10k·Top-10·동시성 10의 탐색 결과이며 제품 선택의 최종 근거가 아닙니다. Recall이 다른 구성을 속도만으로 줄 세우지 않았습니다.',
  },
  {
    id: 'ubot',
    number: '05',
    title: 'UBot Backend',
    kind: 'TEAM',
    typeLabel: '팀 프로젝트',
    description: '통신사 고객 상담용 RAG 챗봇의 개발·테스트 기반',
    role: '로컬·CI 환경 구성 · 테스트 격리 · 배포 이미지',
    technologies: [
      'PostgreSQL',
      'PostGIS',
      'Flyway',
      'Testcontainers',
      'Docker',
    ],
    highlights: [
      '로컬·CI가 같은 PostgreSQL 이미지 사용',
      '실제 vector 검색과 공간 함수를 CI에서 검증',
    ],
    github: 'https://github.com/ureca-UBot/UBot-BE',
    overview:
      'FAQ 벡터 검색과 LLM 답변, PostGIS 매장 근접 검색을 제공하는 서비스입니다. 핵심 기능이 PostgreSQL 확장에 의존하므로 팀 누구나 같은 환경에서 실행하고 검증하는 기반을 구성했습니다.',
    cases: [
      {
        title: '내 컴퓨터와 CI에서 같은 기능을 검증하기',
        problem:
          'pgvector와 PostGIS를 다른 DB로 대체하면 실제 확장 함수의 동작과 환경 차이를 검증할 수 없습니다.',
        decision:
          '로컬 Compose와 CI가 같은 PostgreSQL Dockerfile을 사용합니다. Extension 생성은 Flyway로 통일하고 Testcontainers로 독립 DB를 생성합니다.',
        verification:
          'CI에서 실제 vector 저장·검색과 PostGIS spatial function을 실행합니다. Java 21 multi-stage 이미지로 빌드 도구와 실행 환경도 분리했습니다.',
      },
    ],
    limitations:
      '이 프로젝트에서 제 기여는 팀 개발·테스트 실행 기반입니다. RAG와 상담 기능 전체를 개인 성과로 주장하지 않습니다.',
  },
  {
    id: 'planly',
    number: '06',
    title: 'Planly',
    kind: 'PERSONAL',
    typeLabel: '3인 팀 → 개인 확장',
    description: 'Todo와 공유 Calendar를 연결한 일정 관리 서비스',
    role: '팀 프로젝트 인수 · 구조 재편 · 기능 확장',
    technologies: ['Spring Boot', 'JWT', 'MySQL', 'React'],
    highlights: [
      'Todo–Schedule 연동과 리소스 소유권 검증',
      '검색·필터·페이지네이션·하위 Todo 계층',
    ],
    github: 'https://github.com/Catverdose/planly-web',
    overview:
      '3인 팀 미니 프로젝트를 개인 저장소로 이어받아 재구성했습니다. 단일 Spring Boot 프로젝트를 backend/frontend로 분리하고 React SPA를 구성했습니다.',
    cases: [
      {
        title: '기본 CRUD에서 권한과 관계를 가진 서비스로',
        problem:
          '공유 일정과 개인 Todo가 연결되면서 인증 여부만으로는 각 리소스에 대한 접근 권한을 판단할 수 없었습니다.',
        decision:
          'JWT 인증에 리소스 소유권 검증을 추가했습니다. Todo–Schedule 연동, 이메일 기반 멤버 관리, 하위 Todo와 Eisenhower Matrix 분류로 확장했습니다.',
        verification:
          '기존 팀 범위인 기본 CRUD·완료 처리·JWT 인증과, 개인 확장 범위인 구조 분리·소유권·검색·분류·일정 연동을 구분해 저장소에 정리했습니다.',
      },
    ],
    limitations:
      '기존 팀 프로젝트와 개인 확장 범위를 구분해 기재했습니다. 기능별 구현과 최신 상태는 저장소에서 확인할 수 있습니다.',
  },
]

export const concurrencyResults = [
  ['JVM_LOCK', '10,000', '일치', '일치', '통과'],
  ['PESSIMISTIC', '10,000', '중복 2건 → SOLD_OUT', '일치', '실패'],
  ['CONDITIONAL', '10,000', '중복 2건 → SOLD_OUT', '일치', '실패'],
  ['DIRECT', '10,000', '일치', '차감 2,502 / 발급 10,000', '실패'],
  ['REDIS_DECR', '9,999', '일시 SOLD_OUT 13건', '일치', '실패'],
  ['REDIS_LUA', '9,998', '일시 SOLD_OUT 13건', '일치', '실패'],
  ['REDIS_LOCK', '9,999', '한도 초과 287건', '일치', '실패'],
  ['OPTIMISTIC', '9,997', '한도 초과 11건', '일치', '실패'],
  ['REDIS_WATCH', '946', '무응답 26,991건', '일치', '실패'],
]

export const stack = [
  {
    category: 'Backend',
    technologies: 'Java 21 · Spring Boot · JPA · Go',
    context: '트랜잭션 경계와 도메인 규칙, 연결·트래픽 제어',
  },
  {
    category: 'Database',
    technologies: 'PostgreSQL · MySQL · Redis · pgvector · PostGIS',
    context: 'DB 제약과 동시성 제어, 벡터·공간 검색',
  },
  {
    category: 'Infrastructure',
    technologies: 'Docker · Testcontainers · GitHub Actions · Nginx · GCP',
    context: '로컬·CI 환경 일치, 컨테이너 배포와 GPU runtime',
  },
  {
    category: 'AI / RAG',
    technologies: 'Ollama · bge-m3 · EXAONE · Vector Search',
    context: '문서 색인, 근거 검색과 답변 생성의 상태 관리',
  },
  {
    category: 'Verification',
    technologies: 'JUnit · k6 · Integration Test · Benchmark Harness',
    context: '경합 재현, 회귀 검증과 공정한 비교 실험',
  },
]
