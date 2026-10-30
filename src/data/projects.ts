export type ProjectKind = 'PERSONAL' | 'TEAM' | 'EXPERIMENT'

export interface EvidenceLink {
  label: string
  href: string
  detail?: string
}

/** 기능 단위 기록. 기획 → 개발 → 마무리 순서로 읽습니다. */
export interface Feature {
  title: string
  /** 상세 페이지에서 기능을 묶는 이름 */
  group?: string
  /** 상세 페이지에서 먼저 보이는 요약. 전체 과정은 펼쳐야 보입니다. */
  brief?: { plan: string; build: string[]; outcome: string }
  /** 기획: 풀어야 했던 문제와 어떻게 풀려고 했는지 */
  plan: string
  /** 개발: 실제로 만든 것과 그렇게 판단한 이유 */
  build: string
  /** 마무리: 결과와 확인한 방법 */
  outcome: string
  /** 남은 한계나 선택의 비용 */
  limit?: string
  evidence?: EvidenceLink[]
}

export interface Project {
  id: string
  number: string
  title: string
  kind: ProjectKind
  tier: 'featured' | 'experiment' | 'supporting'
  typeLabel: string
  period: string
  /** 프로젝트 지도와 카드에 쓰는 한 줄 질문 */
  question: string
  description: string
  role: string
  /** Team projects only: size of my share, verifiable on GitHub */
  contribution?: string[]
  technologies: string[]
  highlights: string[]
  github: string
  live?: string
  overview: string
  features: Feature[]
  limitations: string
  proofs?: EvidenceLink[]
  relatedProjectIds?: string[]
}

export const profile = {
  name: 'Catverdose',
  github: 'https://github.com/Catverdose',
  email: 'eongpup@gmail.com',
  live: 'https://memory.catverdose.xyz',
  // 도메인을 붙여 배포했다가 지금은 서버를 내려 둔 상태입니다. 다시 올리면 true로 변경합니다.
  liveAvailable: false,
}

const ubotBe = 'https://github.com/ureca-UBot/UBot-BE'
const ubotFe = 'https://github.com/ureca-UBot/UBot-FE'
const ubotServerTest = 'https://github.com/ureca-UBot/UBot-ServerTest'
const ubotVectorDb = 'https://github.com/ureca-UBot/UBot-VectorDBTest'
const petcoupon = 'https://github.com/PetCare-Platform/petcoupon-backend'

export const projects: Project[] = [
  {
    id: 'ubot',
    number: '01',
    title: 'UBot',
    kind: 'TEAM',
    tier: 'featured',
    typeLabel: '팀 프로젝트',
    period: '2026.09 ~ 2026.10',
    question: '모델이 멈추면 접수된 질문은 어디로 갈까?',
    description:
      '통신 상담 RAG 챗봇에서 AWS 인프라와 배포, 답변의 비동기 처리와 장애 복구를 맡다',
    role: 'AWS 인프라 설계·CI/CD · 비동기 채팅·장애 복구 · 운영 지표·알림 · 상담사 연결·입력 보호 · 모델 서버 전환·FAQ 검색',
    contribution: [
      '백엔드 Merged PR 34개',
      '프론트 Merged PR 15개',
      '팀원 PR 리뷰 49건',
    ],
    technologies: [
      'Spring Boot',
      'PostgreSQL',
      'pgvector',
      'Redis Streams',
      'vLLM',
      'AWS',
      'Terraform',
      'Prometheus',
    ],
    highlights: [
      'FE·BE·State·GPU로 나눈 AWS 구성과 보안 그룹 경계, Spot GPU ASG를 Terraform으로 관리',
      '질문은 202로 접수하고 Worker가 생성, 로컬에서 장애 4종을 주입해도 작업 유실 0건',
      'AWS 실서비스 경로로 6,000건 재시험, 시스템 오류 4건',
    ],
    github: ubotBe,
    overview:
      'FAQ 검색과 LLM 답변, 상담사 연결, 매장 지도를 제공하는 통신사 상담 챗봇이고, AWS에 배포해 2026년 10월까지 운영한 팀 프로젝트입니다. 저는 AWS 인프라 설계와 배포, 답변 생성의 비동기 처리와 장애 복구, 운영 지표와 알림, 상담사 연결, 채팅 앞단(금지어, 비회원), 모델 서버 전환과 FAQ 검색을 맡았습니다. 이 밖에 본인 회선 통신정보 조회 API(#165), 상품 4종 관리(#157), 프론트 구조 분리(FE #64)도 구현했습니다. 회원 인증(JWT), FAQ 관리, 매장 지도 검색은 팀원이 담당했습니다.',
    features: [
      {
        group: 'AWS 인프라',
        title: '서버를 나누고, 필요한 곳에만 열기',
        brief: {
          plan: 'FE, BE, DB·Redis, GPU가 서로 다른 서버로 나뉘면서 각 서버가 어디서 오는 요청만 받을지 정해야 했습니다.',
          build: [
            '외부 요청은 FE Nginx(HTTPS)로만 받고, /api는 VPC 사설 주소로 BE에 전달',
            '보안 그룹으로 BE HTTP는 FE만, PostgreSQL·Redis는 API·Worker만, GPU 추론 포트는 내부 NLB만 허용',
            'BE Nginx는 FE 사설 IP가 전달한 클라이언트 IP만 신뢰하고, 그 IP와 회원 토큰 기준으로 채팅 접수 제한',
          ],
          outcome: '#306, #261, FE #72 병합. 보안 그룹 규칙까지 Terraform 코드로 확인할 수 있습니다.',
        },
        plan: '처음에는 EC2 한 대에 백엔드와 DB, 모델 서버를 함께 올렸습니다. FE, BE, DB·Redis, GPU가 서로 다른 서버로 나뉘면서 어떤 서버가 어디서 오는 요청을 받을지 정해야 했습니다. 외부에 여는 곳은 FE 하나로 두고, 나머지는 바로 앞 단계에서 오는 요청만 받게 하기로 했습니다.',
        build:
          '외부 요청은 FE Nginx가 HTTPS로 받고, /api는 VPC 사설 주소로 BE Nginx에 전달합니다. BE의 80번은 FE 보안 그룹에서만 받습니다. Worker는 BE 서버에서 함께 돌지만 보안 그룹을 따로 붙였습니다. State 서버의 PostgreSQL과 Redis는 API와 Worker 보안 그룹에서만 받습니다. GPU 앞에는 내부 NLB를 두고, 채팅(8000)은 Worker만, 임베딩(8001)은 API와 Worker만 부를 수 있게 했습니다. GPU의 8000, 8001번은 NLB 보안 그룹에서만 받습니다. FE를 거치면 클라이언트 IP가 FE 주소로 보이므로, BE Nginx는 FE 사설 IP가 전달한 X-Forwarded-For만 믿습니다. 이 IP와 회원 토큰으로 Nginx에서, 회원 ID로 백엔드에서 채팅 접수를 제한합니다(기본 60초 30회).',
        outcome:
          '#306, #261과 프론트 #72가 병합됐습니다. 기존 보안 그룹 6개를 규칙째 Terraform으로 가져와, 누가 어디에 접근할 수 있는지를 코드로 확인할 수 있습니다. BE와 FE 모두 실제 AWS 배포를 확인했습니다.',
        limit:
          'FE, BE, GPU 보안 그룹에는 관리용 SSH가 특정 IP로 열려 있습니다. NAT가 없어 GPU는 퍼블릭 서브넷에서 공인 IP로 뜨고(추론 포트는 NLB에서만 받음), g6.xlarge를 쓸 수 있으면서 인터넷이 되는 서브넷이 하나뿐이라 한 가용 영역에 있습니다.',
        evidence: [
          {
            label: 'AWS Terraform 스택 (#306)',
            href: `${ubotBe}/pull/306`,
            detail: 'VPC · 서버 · 보안 그룹 · 내부 NLB',
          },
          {
            label: 'AWS 구성 문서',
            href: `${ubotBe}/blob/develop/infra/terraform/aws-poc.md`,
          },
          {
            label: 'Nginx 접수 제한 (#261)',
            href: `${ubotBe}/pull/261`,
            detail: '게스트 IP · 회원 토큰 · 회원 ID',
          },
          {
            label: 'FE Nginx와 /api 전달 (FE #72)',
            href: `${ubotFe}/pull/72`,
          },
        ],
      },
      {
        group: 'AWS 인프라',
        title: 'GPU 서버 수를 사용률에 맞춰 조절하기',
        brief: {
          plan: '모델 서버는 부팅과 모델 적재에 약 5분이 걸려, 일반 서버처럼 바로 늘리고 줄이면 준비 중인 서버가 잘못 판단될 수 있었습니다.',
          build: [
            'Docker, NVIDIA, vLLM, 모델 캐시를 미리 담은 AMI로 부팅',
            '평균 GPU 사용률 60%를 목표로 최대 3대까지 조절하고 NLB 대상에 자동 등록',
            '준비 시간 420초로 적재 중 축소를 막고, 연결 종료 유예 120초와 용량 재조정으로 교체에 대비',
          ],
          outcome: 'AWS 6,000건 시험을 기존 GPU 1대와 Spot GPU 2대로 NLB 뒤에서 처리했습니다. 자동 확장 자체는 실제 트래픽으로 검증하지 않았습니다.',
        },
        plan: 'LLM 실험에서 초당 8건 기준선을 넘은 것은 L4 GPU였고, 이 GPU를 g6.xlarge Spot으로 쓰기로 했습니다. 모델 서버는 부팅과 모델 적재에 약 5분이 걸립니다. 이 사이 GPU 사용률이 낮게 나오면 축소 대상이 될 수 있고, 준비되지 않은 서버로 요청이 가면 안 됩니다.',
        build:
          'Docker, NVIDIA 런타임, vLLM, 모델 캐시와 자동 시작을 미리 담은 AMI를 만들고, 인스턴스는 이 AMI로 부팅합니다. CloudWatch 에이전트가 보내는 GPU 사용률의 평균 60%를 목표로 ASG가 대수를 조절합니다(최대 3대). 준비 시간 420초로 적재 중 축소를 막고, NLB의 /health 검사를 10초 간격으로 3회 통과해야 요청을 받습니다. 연결 종료 유예 120초는 백엔드의 LLM 읽기 제한과 같게 두어 처리 중인 답변이 끝날 수 있게 했고, 용량 재조정을 켜 Spot 중단에 대비했습니다. 스냅샷에서 복원한 볼륨은 모델을 늦게 읽어 볼륨 초기화 속도를 지정했습니다. 관리자 분석용 On-Demand GPU는 분석 중에 NLB 대상에서 빠졌다가 끝나면 다시 등록되는 구성을 선택적으로 넣었습니다.',
        outcome:
          '#306이 병합됐습니다. AWS 6,000건 시험은 기존 GPU 1대와 Spot GPU 2대를 NLB 뒤에 두고 진행했습니다. 시험 중 드러난 모델 컨텍스트 한도는 기존 AMI로 뜨는 Spot GPU에도 같은 값이 적용되게 고쳤습니다(#318).',
        limit:
          '자동 확장과 Spot 교체는 실제 트래픽으로 검증하지 않았습니다. 2026-10-26 plan 당시 ASG 크기는 0이었고 On-Demand 전환은 꺼져 있었습니다. 서버 수별 처리량이나 비용 비교 결과는 없습니다.',
        evidence: [
          {
            label: 'AWS Terraform 스택 (#306)',
            href: `${ubotBe}/pull/306`,
            detail: 'GPU AMI · Spot ASG · 내부 NLB',
          },
          {
            label: 'GPU 확장·준비·제거 설정',
            href: `${ubotBe}/blob/develop/infra/terraform/aws-poc.md`,
            detail: '목표 60% · 준비 420초 · 유예 120초',
          },
          {
            label: '시험에 쓴 GPU 구성 (ServerTest)',
            href: `${ubotServerTest}/blob/main/chat-e2e/results/20261026-aws/README.md`,
          },
        ],
      },
      {
        group: 'AWS 인프라',
        title: '콘솔에서 만든 AWS 자원을 코드로 옮기기',
        brief: {
          plan: '서버, GPU, 배포 권한이 콘솔에서 만든 자원에 걸쳐 있어 구성과 변경 범위를 코드로 확인하기 어려웠습니다.',
          build: [
            '실험용 GPU 서버는 bootstrap, network, gpu-test로 나눠 GPU만 지워도 네트워크가 남게 구성',
            '기존 VPC, 서버, ECR, IAM, 보안 그룹을 원격 state로 가져오고 FE·BE·State에 prevent_destroy',
            'GitHub OIDC 배포 역할의 권한을 지정한 ECR과 인스턴스로 제한',
          ],
          outcome: '#133 #306 병합. 원격 plan으로 생성 0·변경 1·삭제 0을 확인했습니다(이 plan은 적용하지 않음).',
        },
        plan: 'LLM 실험에 GPU가 필요했는데 AWS 계정의 vCPU 상한 때문에 제가 서버를 더 만들 수 없어, 팀원이 같은 환경을 재현할 수 있게 코드로 만들었습니다(#133). 이후 서비스 자원도 FE, BE, State 서버와 GPU, 배포 권한이 콘솔에서 만든 자원에 걸쳐 있어 구성과 변경 범위를 코드로 보기로 했습니다.',
        build:
          '#133은 bootstrap(원격 state용 S3), network, gpu-test로 나눠 GPU만 지워도 네트워크가 남게 했습니다. SSH 포트 없이 Session Manager로만 접속하고, Terraform과 AWS CLI는 Docker로 실행합니다. #306은 기존 VPC, 서버, ECR, IAM, 보안 그룹을 원격 state로 가져오고 NLB, GPU AMI 빌더, Spot ASG, 선택적 On-Demand GPU까지 코드로 정리했습니다. FE, BE, State와 VPC에는 prevent_destroy를 걸었고, CD 역할은 지정한 ECR과 인스턴스에만 쓸 수 있습니다. 환경별 값(terraform.tfvars, backend.hcl)은 저장소에 넣지 않았습니다.',
        outcome:
          '#133, #306이 병합됐습니다. #133은 apply 성공, Session Manager 접속과 nvidia-smi로 L4 확인, gpu-test를 지운 뒤 network 유지를 확인했습니다. #306은 fmt, validate를 통과했고 2026-10-26 원격 plan은 생성 0, 변경 1, 삭제 0이었습니다.',
        limit:
          '이 스택으로 AWS 전체를 처음부터 만든 것이 아니라 기존 자원을 가져온 것입니다. plan의 변경 1건은 시작 템플릿 user_data의 주석 차이였고, 이 plan은 적용하지 않았습니다.',
        evidence: [
          {
            label: 'AWS Terraform 스택 (#306)',
            href: `${ubotBe}/pull/306`,
            detail: '기존 자원 가져오기 · prevent_destroy · plan 결과',
          },
          {
            label: 'GPU 테스트 인프라 (#133)',
            href: `${ubotBe}/pull/133`,
            detail: 'bootstrap · network · gpu-test 분리',
          },
        ],
      },
      {
        group: 'AWS 인프라',
        title: '배포가 실패해도 서비스가 돌아오도록',
        brief: {
          plan: 'EC2 수동 배포로 시작했지만 FE와 BE 서버가 나뉘면서 배포도 서버별로 자동화해야 했고, 배포가 중간에 실패하면 Worker가 꺼진 채 남을 수 있었습니다.',
          build: [
            'develop CI가 통과하면 OIDC로 ECR에 올리고 SSM으로 BE에 배포',
            'FE는 current 링크를 바꾼 뒤 새 버전이 안 뜨면 이전 릴리스로 자동 복구',
            '배포가 Worker를 멈춘 채 실패하면 독립 systemd 타이머가 같은 이미지로 복구',
          ],
          outcome: '실제 AWS 배포 성공(Flyway V41, Prometheus 대상 5개 up). 배포 강제 종료 뒤 Worker 복구는 로컬 Linux에서 확인.',
        },
        plan: '처음에는 백엔드 이미지와 배포 Compose를 만들고(#56, #58) GitHub Actions 수동 CD로 EC2 한 대에 배포했습니다. 502가 30번 넘게 반복되던 문제는 배포 전 점검 단계를 넣어 하나씩 해결했습니다(#77, #88). Redis와 Prometheus 기반을 붙이고(#120), LLM 실험용 GPU 서버는 Terraform으로 필요할 때만 만들고 지우게 했습니다(#133). 이후 FE, BE, GPU 서버가 나뉘면서 배포를 서버별로 자동화하고, 배포가 실패했을 때 돌아올 길을 만들어야 했습니다.',
        build:
          'BE는 develop CI가 성공하면 OIDC 역할로 ECR에 이미지를 올리고 SSM으로 EC2에 배포합니다(#261). FE는 서버에서 같은 커밋을 빌드해 current 링크를 바꾸고, 새 버전이 뜨지 않으면 이전 릴리스로 되돌립니다(FE #72). 그런데 CD가 Worker를 멈춘 뒤 실패하면, API는 질문을 받는데 답변할 Worker가 없는 상태가 됩니다. SSM, Worker와 독립된 systemd 타이머가 30초마다 확인해 API가 정상이면 같은 이미지 digest로 Worker를 복구하게 했습니다. 배포 잠금으로 배포와 동시에 돌지 않게 하고, API 비정상이나 점검 중에는 복구를 보류합니다(#318).',
        outcome:
          '#261, #318과 프론트 #72가 병합됐습니다. BE는 실제 AWS 배포에서 Flyway V41 적용과 Prometheus 대상 5개 up을, FE는 실제 서비스 반영(검증 38초, 배포 49초)을 확인했습니다. 배포 스크립트를 Worker 정지 직후 강제 종료(SIGKILL)했을 때 외부 복구가 되는 것은 로컬 Linux에서 확인했고, AWS에는 타이머를 설치한 뒤 기존 Worker를 유지한 채 새 질문이 정상 처리되는 것을 확인했습니다.',
        limit:
          '강제 종료 시험은 AWS가 아니라 로컬 Linux에서 했습니다. #318 커밋 전체를 CD로 다시 배포하는 것은 PR 시점에 실행하지 않았습니다.',
        evidence: [
          {
            label: 'AWS Worker 자동 복구 (#318)',
            href: `${ubotBe}/pull/318`,
            detail: '독립 systemd 타이머 · 배포 잠금 · 같은 이미지 digest',
          },
          {
            label: 'AWS BE CI/CD와 Prometheus (#261)',
            href: `${ubotBe}/pull/261`,
            detail: 'OIDC → ECR → SSM',
          },
          {
            label: 'AWS FE CD와 자동 되돌리기 (FE #72)',
            href: `${ubotFe}/pull/72`,
          },
          {
            label: '초기 수동 CD의 Compose 충돌 수정 (#88)',
            href: `${ubotBe}/pull/88`,
            detail: '프로젝트 이름 통일 · 배포 전 점검 · Nginx 재생성 순서',
          },
        ],
      },
      {
        group: 'AWS 인프라',
        title: '장애를 사용자보다 먼저 알기',
        brief: {
          plan: 'Worker로 나누고 나니 대기열이 밀리는지, LLM이 느려졌는지 로그만으로는 알기 어려웠습니다.',
          build: [
            'Chat Job, LLM, 검색, 임베딩, DB, Redis 지표를 역할 태그와 함께 수집',
            '알림 규칙 6개를 Discord, Slack으로 보내고 알림마다 런북 연결',
            '알림 설정 생성 스크립트는 값이 틀리면 아무것도 바꾸지 않고 실패',
          ],
          outcome: '#268 #274 병합. 로컬에서 실제 Discord·Slack으로 장애(FIRING)와 복구(RESOLVED) 알림 수신.',
        },
        plan: '접수와 생성을 나누자 대기열이 밀리는지, LLM이 느려졌는지, Worker가 작업을 회수하고 있는지를 로그만으로는 알기 어려웠습니다. 지표를 먼저 정하고, 장애는 사용자보다 먼저 알 수 있게 하기로 했습니다.',
        build:
          'Chat Job의 실행 시간과 대기 시간, 회수 사유, LLM 호출 시간과 동시 호출 수, 임베딩과 벡터 검색 시간, DB 커넥션 사용 시간, Redis 스트림 적체를 지표로 남기고 모든 지표에 role 태그를 붙였습니다(#268). Backend, Worker, PostgreSQL, Redis 장애와 Chat Job 대기 지연, LLM 시간 초과 비율에 알림 규칙 6개를 두고 Alertmanager로 Discord와 Slack에 보냅니다. 알림마다 런북을 연결했고, 알림 설정 생성 스크립트는 기준값이나 Webhook이 틀리면 아무것도 바꾸지 않고 실패합니다(#274).',
        outcome:
          '#268, #274가 병합됐습니다. 적체 집계 SQL은 Testcontainers PostgreSQL로, exporter의 지표 이름은 실제 컨테이너로 확인했습니다. 로컬에서 실제 Discord와 Slack으로 장애(FIRING)와 복구(RESOLVED) 알림을 받았습니다.',
        limit:
          '알림 수신은 로컬에서 확인했고, PR 시점에 AWS 배포 연결은 후속 작업으로 남겨 두었습니다.',
        evidence: [
          {
            label: '운영 모니터링 지표 (#268)',
            href: `${ubotBe}/pull/268`,
            detail: 'Chat Job · LLM · 검색 · 임베딩 · DB · Redis',
          },
          {
            label: 'Prometheus 장애 알림 Discord·Slack 전송 (#274)',
            href: `${ubotBe}/pull/274`,
            detail: '알림 규칙 6개 · 런북 · 설정 검증',
          },
        ],
      },
      {
        group: '채팅 백엔드',
        title: '모델이 느려도 질문이 실패하지 않도록',
        brief: {
          plan: '요청 스레드가 LLM 답변을 끝까지 기다리는 구조라, 질문이 몰리면 시간 초과로 실패했습니다.',
          build: [
            '질문은 202와 jobId로 바로 접수하고 답변은 별도 Worker가 생성',
            '작업 원본은 DB의 chat_jobs, Redis Streams는 Worker를 깨우는 신호만',
            'Worker 동시 실행 수와 LLM 동시 호출 수에 상한',
          ],
          outcome: '로컬 동시 1,000건에서 시간 초과·실패가 321건에서 0건으로 줄었습니다(#214).',
        },
        plan: '채팅 API의 요청 스레드가 LLM 답변이 끝날 때까지 기다렸습니다. 질문이 몰리면 요청이 시간 초과로 실패하고, 실패한 질문은 사용자가 다시 보내야 했습니다. 질문 접수와 답변 생성을 나눠, 몰린 요청은 실패시키지 않고 차례로 처리하기로 했습니다.',
        build:
          '질문, 재시도, 재검색 API는 202와 jobId를 바로 돌려주고, 프론트는 GET /chat/jobs/{jobId}로 상태(QUEUED → RUNNING → SUCCEEDED 또는 FAILED)와 진행 단계를 조회합니다. 작업의 원본은 DB의 chat_jobs 테이블이고, Redis Streams는 Worker를 깨우는 신호만 맡습니다. 실행 역할(APP_ROLE)을 api와 worker로 나눠 따로 띄우고, Worker의 동시 실행 수와 LLM 동시 호출 수에 상한을 뒀습니다. 프론트에는 1.5초 간격 폴링과 429·5xx 백오프를 붙였습니다(FE #52). 이후 823줄이던 Worker를 실행과 복구 책임으로 나눠 159줄로 줄였습니다(#289).',
        outcome:
          '#214, #289와 프론트 #52가 병합됐습니다. 로컬에서 동시 1,000건을 보내자 기존 동기 구조는 321건이 시간 초과·실패했고 Worker 구조는 0건이었습니다. 정상 답변은 348건에서 625건으로 늘었습니다. #289 시점에 전체 테스트 4,635개가 통과했습니다(PR 기록).',
        limit:
          '실패 대신 기다리게 한 구조라 1,000건의 전체 완료 시간은 133초에서 373초로 늘었습니다. 로컬 GPU 한 대의 LLM 처리량이 한계였습니다.',
        evidence: [
          {
            label: '채팅 답변 생성을 비동기 Worker로 분리 (#214)',
            href: `${ubotBe}/pull/214`,
            detail: '202 접수 · DB 작업 원장 · 동시 1,000건 비교',
          },
          {
            label: 'Worker 실행·복구 책임 분리 (#289)',
            href: `${ubotBe}/pull/289`,
          },
          {
            label: '작업 상태 폴링 연동 (FE #52)',
            href: `${ubotFe}/pull/52`,
          },
        ],
      },
      {
        group: '채팅 백엔드',
        title: '서버가 멈춰도 작업이 사라지지 않도록',
        brief: {
          plan: 'Worker가 답변 도중 죽거나 Redis 메시지가 사라지면, 접수된 질문이 영영 끝나지 않을 수 있었습니다.',
          build: [
            'heartbeat가 끊긴 작업은 다른 Worker가 넘겨받고, 늦게 끝난 이전 실행은 펜싱으로 버림',
            'Redis ACK는 DB 커밋 뒤에, 메시지가 유실되면 DB 기준으로 다시 발행',
            'vLLM 연결 실패·5xx는 Worker 안에서 재시도, 실행 마감은 하나로 계산',
          ],
          outcome: 'Worker, Redis, PostgreSQL, vLLM을 하나씩 강제 종료해도 각 100건이 모두 완료, 유실·중복 저장 0건(로컬).',
        },
        plan: '접수와 생성을 나누자 새 실패 경계가 생겼습니다. Worker가 답변 도중 죽거나, Redis 메시지가 사라지거나, 늦게 끝난 이전 실행이 새 결과를 덮어쓸 수 있었습니다. 작업의 상태는 DB를 기준으로 두고, 경계마다 실행과 복구의 책임을 정하기로 했습니다.',
        build:
          'Worker는 실행 중 heartbeat를 갱신하고, heartbeat가 끊긴 작업은 다른 Worker가 넘겨받습니다. 이전 실행이 늦게 끝나도 started_at 펜싱으로 그 결과를 버립니다. Redis ACK는 DB 커밋 뒤에 보내고, 메시지가 유실되면 DB를 기준으로 다시 발행합니다. 종료할 때 실행 중인 작업은 마무리하거나 대기열로 돌려놓습니다. 이후 vLLM 연결 실패와 5xx는 Worker 안에서 같은 요청만 5초 간격으로 다시 보내고, 실행 마감은 min(선점 + 180초, 접수 + 10분) 하나로 계산하게 했습니다. DB가 멈췄을 때 작업 조회가 매달리지 않도록 요청별 시간 예산(1.5초)을 두고, 넘기면 503으로 답합니다(#281).',
        outcome:
          '#214, #281이 병합됐습니다. 로컬에서 실제 모델(Qwen3-4B, BGE-M3)로 작업 100건을 접수한 뒤 Worker, Redis, PostgreSQL, vLLM을 하나씩 강제 종료하고 복구했습니다. 네 경우 모두 100건이 완료됐고 유실, 중복 저장, 실패, 타임아웃은 0건이었습니다. DB를 멈춘 상태의 작업 조회가 2초 안에 503을 돌려주는 것은 통합 테스트로 확인했습니다.',
        limit:
          '장애마다 로컬에서 한 번씩 실행한 결과라, AWS에서의 긴 장애나 여러 장애가 겹치는 경우로 확대하지 않습니다. 중복 0은 저장된 답변 기준이며 모델 계산이 한 번만 일어났다는 뜻은 아닙니다.',
        evidence: [
          {
            label: '채팅 작업 장애 대응 개선 (#281)',
            href: `${ubotBe}/pull/281`,
            detail: 'vLLM 재시도 · 실행 마감 단일화 · 조회 시간 예산',
          },
          {
            label: '장애 4종 주입 시험 결과 (ServerTest)',
            href: `${ubotServerTest}/blob/main/fault-recovery/README.md`,
            detail: 'Worker · Redis · PostgreSQL · vLLM 각 100건',
          },
        ],
      },
      {
        group: '채팅 백엔드',
        title: '실서비스 경로로 6,000건을 보내 보기',
        brief: {
          plan: '로컬 결과만으로는 AWS의 실제 경로(FE Nginx → BE → Worker → GPU)에서 버티는지 알 수 없었습니다.',
          build: [
            'k6로 합성 회원 3,000명이 서로 다른 질문을 동시에 보내는 시험을 두 번',
            '실패마다 원인을 찾아 설정에 반영: 대기·실행 한도, 모델 컨텍스트, Nginx 연결 한도',
            '받은 작업 ID 6,000개를 DB와 하나씩 대조',
          ],
          outcome: '최종 6,000건 모두 접수. 답변 5,666건, 정상 거절 330건, 시스템 오류 4건.',
        },
        plan: '로컬 부하 시험은 GPU 한 대 기준이라 실제 서비스 경로의 동작을 보여 주지 못했습니다. 운영 중인 서비스의 FE Nginx부터 BE, Worker, GPU 서버까지 실제 경로로 보내 보기로 했습니다.',
        build:
          'k6로 합성 회원 3,000명이 서로 다른 질문을 같은 시각에 보내는 시험을 만들었습니다. 질문은 FAQ 1,498개에서 만든 서로 다른 6,000개입니다. 첫 시험(10월 25일)은 6,000건 중 1,235건이 시스템 오류였고, 대부분이 대기·실행 시간 초과(CHAT-016 873건)와 모델 컨텍스트 초과(LLM-003 357건)였습니다. 대기 한도는 1시간, 실행 한도는 10분으로 늘렸습니다. LLM-003은 출력 검사에 질문, 답변, FAQ, 조회 자료가 함께 들어가고 출력 1,024토큰을 예약하면서 모델 한도 4,096토큰을 넘긴 것이 원인이라, 컨텍스트를 8,192토큰으로 바꾸고 기존 AMI로 뜨는 Spot GPU도 같은 값으로 기동하게 했습니다. 재시험 첫 실행에서는 502가 2,499건 났는데, BE Nginx의 연결 한도 512가 고갈된 것이라 8,192로 올렸습니다. 시험 도구의 HTTP 제한도 120초에서 300초로 늘렸습니다.',
        outcome:
          '최종 재시험(10월 26일)에서 6,000건을 모두 접수했고 답변 5,666건, 정상 거절 330건, 시스템 오류 4건(LLM-005)이 나왔습니다. 연결 시간 초과, 대기·실행 시간 초과(CHAT-016), LLM-003은 0건이었습니다. HTTP로 받은 작업 ID 6,000개를 DB와 대조해 누락과 불일치가 0건임을 확인했습니다.',
        limit:
          '답변 완료까지는 큐 대기가 포함돼 p95가 444초, 645초로 깁니다. 성공 답변 중 같은 일반 보류 문구가 908건이라, 성공이 곧 충분한 답변을 뜻하지는 않습니다. 답변의 사실 일치는 6,000건 전체를 채점하지 않았습니다.',
        evidence: [
          {
            label: 'AWS 채팅 재시험 결과 (ServerTest)',
            href: `${ubotServerTest}/blob/main/chat-e2e/results/20261026-aws/README.md`,
            detail: '6,000건 · 중간 실행의 실패 원인과 설정 반영 · DB 대조',
          },
          {
            label: '시험 결과를 반영한 설정 (#318)',
            href: `${ubotBe}/pull/318`,
            detail: 'Nginx 연결 수 · 모델 컨텍스트 8,192',
          },
        ],
      },
      {
        group: '채팅 백엔드',
        title: 'AI 대화를 상담사에게 넘기되, 다른 대화는 보이지 않게',
        brief: {
          plan: '회원이 AI 대화를 상담사에게 넘길 때 다른 대화나 허용되지 않은 메시지가 노출되면 안 됐고, 재배정과 재접속에도 이력이 맞아야 했습니다.',
          build: [
            '서버에 저장된 해당 대화의 AI 문답과 FAQ 선택만 인계 이력으로 생성',
            '역할은 현재 DB 기준으로 확인하고, 재배정 뒤 이전 상담사의 접근 차단',
            '메시지는 PENDING으로 저장한 뒤 검사를 통과한 것만 전달하고, 재전송은 clientMessageId로 멱등 처리',
          ],
          outcome: '백엔드 #244, 프론트 #68 #76 병합. 실제 두 계정으로 연결, 양방향 전송, 차단, 이력 복원을 확인했습니다(PR 기록).',
        },
        plan: '회원이 AI 대화를 상담사에게 넘길 때 다른 대화의 내용이나 허용되지 않은 메시지가 노출되면 안 됐습니다. 상담사가 바뀌거나 다시 접속해도, 메시지를 두 번 보내도 이력은 맞아야 했습니다. 클라이언트가 보낸 대화 본문은 믿지 않기로 했습니다.',
        build:
          '서버에 저장된 해당 대화의 AI 문답과 FAQ 선택만 인계 이력으로 만들고, 상담 생성과 이력, 배정을 한 트랜잭션으로 처리합니다. 역할은 현재 DB 기준으로 확인하고 재배정 뒤 이전 상담사의 접근을 막습니다. 메시지는 PENDING으로 저장한 뒤 금지어와 임베딩 유사도를 검사해 ALLOWED만 전달하고, 모델 검사 중에는 DB 잠금을 쥐지 않으며 검사 실패를 허용으로 바꾸지 않습니다. clientMessageId로 재전송을 멱등 처리하고, AI와 상담을 합친 이력과 보관 정책을 넣었습니다. 프론트는 고객, 상담사, 관리자 화면과 상태 조회, 재배정 안내를 구현했습니다.',
        outcome:
          '백엔드 #244와 프론트 #68, #76이 병합됐습니다. 자동 검증 869건 중 864건 통과, 실패 0건(환경 조건으로 제외 5건)이었고 실제 두 계정 브라우저로 연결, 이전 내역, 양방향 전송, 차단, 이력 복원을 확인했습니다. #76에서 AWS CD 성공과 데모 고객·상담사의 양방향 메시지를 확인했습니다(PR 기록).',
        limit:
          '상담 의미 판정의 실제 오탐률은 평가 전입니다. 배포할 때 상담 임베딩 Worker와 초기 금지 문장 색인이 필요하고, 프론트는 2초 폴링입니다.',
        evidence: [
          {
            label: '상담사 연결과 상담 보호·이력 관리 (#244)',
            href: `${ubotBe}/pull/244`,
            detail: '인계 이력 · 재배정 · 메시지 판정 · 보관 정책',
          },
          {
            label: '상담사 연결과 상담 관리 화면 (FE #68)',
            href: `${ubotFe}/pull/68`,
          },
          {
            label: '상담 화면 적용과 실제 연동 확인 (FE #76)',
            href: `${ubotFe}/pull/76`,
          },
        ],
      },
      {
        group: '채팅 백엔드',
        title: 'LLM을 부르기 전에 걸러야 하는 질문',
        brief: {
          plan: '금지어가 든 질문도 임베딩과 LLM 호출까지 그대로 가고 있어, 비용이 큰 호출 앞에서 먼저 거르기로 했습니다.',
          build: [
            '관리자 금지어 API 4개와 관리 화면',
            '활성 금지어를 서버 메모리에 두고 커밋 뒤에 갱신',
            '임베딩 전에 검사해 400으로 차단, 걸린 단어는 비공개',
            '상담 메시지는 금지어 다음에 금지 문장과의 임베딩 유사도로 한 번 더 검사',
          ],
          outcome: '백엔드 #104 #244, 프론트 #23 병합. 상담 검사는 실제 Worker와 vLLM으로 확인했습니다(PR 기록).',
        },
        plan: '금지어가 든 질문도 임베딩, FAQ 검색, LLM 호출까지 그대로 진행되고 있었습니다. 금지어의 특성상 모델을 부를 필요가 없는 질문이 많을 것이라고 보고, 비용이 큰 호출 앞에서 먼저 거르기로 했습니다. 금지어가 Redis에 둘 만큼 많지는 않을 것이라 서버 메모리 캐시를 쓰기로 했습니다.',
        build:
          '관리자 금지어 API 4개(등록, 목록, 단어 수정, 상태 변경)를 만들고, 활성 금지어를 서버 시작 때 메모리에 올립니다. 캐시는 변경 트랜잭션이 커밋된 뒤에 새 목록으로 통째로 바꿔, 캐시와 DB가 어긋나지 않게 했습니다. 채팅에서는 임베딩 전에 금지어를 검사해 400으로 차단하고, 걸린 단어는 응답에 드러내지 않습니다. 관리자 동시 수정은 행 잠금으로 막았고, 단어와 상태는 바꾸려는 것만 수정하도록 엔드포인트를 나눴습니다. 프론트에는 금지어 관리 화면을 만들었습니다. 이후 상담사 연결(#244)에서도 같은 금지어 필터를 먼저 적용하고, 통과한 메시지만 Worker가 관리자가 등록한 금지 문장과 임베딩 유사도로 한 번 더 비교해 허용된 메시지만 상담사에게 전달하게 했습니다.',
        outcome:
          '백엔드 #104와 프론트 #23이 병합됐습니다. 단위, 통합, E2E 테스트를 작성했고 당시 전체 테스트 379개가 통과했습니다(PR 기록). 상담 검사(#244)는 자동 검증 869건 중 864건 통과, 실패 0건(환경 조건으로 제외 5건)이었고, 실제 두 계정으로 금지어·유사도 차단을 확인했습니다.',
        limit:
          '캐시는 서버 한 대 기준입니다. 검사는 단순 포함 여부라 띄어쓰기나 변형으로 우회하는 입력은 막지 못합니다. 차단 건수나 LLM 호출 절감은 측정하지 않았습니다.',
        evidence: [
          {
            label: '금지어 관리 API와 채팅 입력 필터 (#104)',
            href: `${ubotBe}/pull/104`,
            detail: '로컬 캐시 · 커밋 후 갱신 · LLM 호출 전 차단',
          },
          {
            label: '상담사 연결과 상담 메시지 검사 (#244)',
            href: `${ubotBe}/pull/244`,
            detail: '금지어 필터 → 금지 문장 임베딩 유사도',
          },
          {
            label: '관리자 금지어 관리 화면 (FE #23)',
            href: `${ubotFe}/pull/23`,
          },
        ],
      },
      {
        group: '채팅 백엔드',
        title: '로그인하지 않은 사용자에게 채팅을 열되, 횟수는 지키기',
        brief: {
          plan: 'JWT 로그인 없이도 채팅을 열되, LLM 비용 때문에 횟수는 제한해야 했습니다.',
          build: [
            '게스트는 HttpSession으로 구분, 기존 JWT 코드는 그대로',
            '대화 행을 잠근 뒤 횟수를 세어 동시 요청도 상한 유지',
            '오류와 재시도는 횟수에서 제외, Nginx에서 비로그인 요청만 속도 제한',
          ],
          outcome: '백엔드 #113 #131, 프론트 #27 #28 병합. 당시 전체 테스트 442개 통과(PR 기록).',
        },
        plan: '로그인 인증은 JWT라 로그인하지 않은 사용자는 채팅을 쓸 수 없었습니다. 비회원에게도 열되 LLM 호출 비용 때문에 횟수는 제한해야 했습니다. 게스트는 JWT를 발급받지 않으므로 구분할 수단으로 HttpSession을 쓰고, 기존 JWT 인증 코드는 건드리지 않기로 했습니다.',
        build:
          '게스트 기능을 처음 쓸 때만 세션을 만들고 조회 때는 만들지 않습니다. 질문 횟수는 대화 행을 잠근 뒤 세어, 동시에 보낸 질문도 상한을 넘지 못하게 했습니다. 정상 답변과 FAQ 미발견만 횟수를 쓰고, 시스템 오류와 재시도는 서버가 책임질 일이라 횟수에서 뺐습니다. Nginx에는 Authorization 헤더가 없는 요청에만 IP 기준 속도 제한을 걸었습니다. 로그인하면 게스트 대화를 회원에게 넘기는 기능은 팀 회의에서 나온 아이디어를 구현한 것입니다.',
        outcome:
          '백엔드 #113, #131과 프론트 #27, #28이 병합됐습니다. 게스트 통합 테스트를 추가했고 당시 전체 442개가 통과했습니다(PR 기록). 프론트에서는 횟수를 넘기면 로그인 버튼을 보여 주고, 로그인해도 화면의 대화가 유지되도록 채팅 상태를 라우트 바깥으로 옮겼습니다.',
        limit:
          '세션은 서버 메모리에 있어, 서버가 여러 대가 되면 세션 저장소를 따로 둬야 합니다.',
        evidence: [
          {
            label: '게스트 HttpSession 상태 관리 (#113)',
            href: `${ubotBe}/pull/113`,
          },
          {
            label: '게스트 대화 연결과 질문 횟수 제한 (#131)',
            href: `${ubotBe}/pull/131`,
            detail: '행 잠금 후 횟수 검사 · 대화 승계 · Nginx 속도 제한',
          },
          {
            label: '비회원 AI 채팅 화면 (FE #28)',
            href: `${ubotFe}/pull/28`,
          },
        ],
      },
      {
        group: '채팅 백엔드',
        title: '실험 결과를 코드로: 모델 서버 바꿔 끼우기',
        brief: {
          plan: '서빙 실험에서 답변과 임베딩 모두 vLLM이 앞섰지만 백엔드는 Ollama 호출에 묶여 있었습니다.',
          build: [
            '설정값으로 LLM과 임베딩 클라이언트 구현체를 선택',
            '두 구현체가 같은 동작을 하는지 공통 계약 테스트로 확인',
            '벡터를 모델별 Profile로 나눠 저장하고 빠진 벡터는 백필',
          ],
          outcome: '#138 #144 #146 #150 #153 병합. 전체 테스트는 534개에서 766개 통과로 늘었습니다(PR 기록).',
        },
        plan: '서빙 실험에서 답변 모델은 vLLM이 기준선을 넘었고, 임베딩도 vLLM의 처리량이 Ollama보다 높았습니다. 하지만 백엔드는 Ollama 호출에 묶여 있었습니다. 임베딩 서버를 바꾸면 이미 저장된 벡터와 새 벡터가 섞이는 문제도 있었습니다. 기존 Ollama 경로는 그대로 두고 구현체를 하나 더 추가하는 방향으로 잡았습니다.',
        build:
          '먼저 채팅 서비스를 요청 검증, 비동기 실행, 답변 처리 세 클래스로 나눴습니다(#144). 그 위에 설정값으로 LLM 클라이언트 구현체를 고르는 구조를 만들고 OpenAI 호환 클라이언트(vLLM)를 추가했습니다. 두 구현체가 같은 동작을 하는지 확인하는 공통 계약 테스트를 두었습니다(일반 응답, 도구 실행과 호출 한도, 타임아웃, 연결 거부, 빈 응답). 임베딩도 같은 방식으로 분리했고, 응답 벡터가 1024차원이 아니면 저장하지 않습니다. 벡터는 임베딩 서버와 모델별 Profile로 나눠 저장하고 검색하며, 지금 Profile에 없는 벡터를 채우는 백필 API와 스크립트를 만들었습니다. 모델 서버는 .env의 AI_MODE 하나로 정합니다.',
        outcome:
          '#138, #144, #146, #150, #153이 병합됐습니다. #144는 기존 테스트의 검증문을 바꾸지 않고 534개가 통과했고, 이후 전체 테스트는 576개, 648개, 766개 통과로 늘었습니다(PR 기록). FAQ 1,024건 백필은 로컬에서 Ollama 약 80초, vLLM 약 24초였습니다(1회 기록). 스테이징 서버에서 CD 실행을 확인했습니다.',
        limit:
          '엔진을 바꾸는 배포에서 새 모델 서버가 실패하면 기존 모델 서버가 멈춘 채 남는 한계가 있어 후속 이슈로 남겼습니다. 백필 시간은 로컬 1회 기록이라 속도 배수로 일반화하지 않습니다.',
        evidence: [
          {
            label: 'LLM Provider 전환 구조와 vLLM Client (#146)',
            href: `${ubotBe}/pull/146`,
            detail: '구현체 선택 · 두 구현체 공통 계약 테스트',
          },
          {
            label: 'Embedding Provider 전환 구조 (#150)',
            href: `${ubotBe}/pull/150`,
          },
          {
            label: '실행 환경 분리, 벡터 Profile과 백필 (#153)',
            href: `${ubotBe}/pull/153`,
          },
          {
            label: '채팅 서비스 책임 분리 (#144)',
            href: `${ubotBe}/pull/144`,
          },
        ],
      },
      {
        group: '채팅 백엔드',
        title: '검색이 정답을 놓치지 않은 뒤에, 빠르게',
        brief: {
          plan: 'HNSW 검색은 Profile과 벡터 유형 필터 뒤에 후보가 모자라 정답을 놓칠 수 있었습니다. 정확도를 먼저 잡고 속도를 다뤘습니다.',
          build: [
            '후보 누락 때문에 전체 비교(exact) 검색으로 먼저 전환',
            'pgvector iterative scan과 후보 확장으로 HNSW를 다시 적용',
            'Reranker는 실험 뒤 제거하고 질문 벡터 검색으로 통일',
          ],
          outcome: '합성 1만 건에서 p50 4.6~6.2배 개선, exact와 상위 3개 결과 동일(#251). 실제 FAQ 임베딩 재측정은 남아 있습니다.',
        },
        plan: 'FAQ 질문만 임베딩하면 답변에만 있는 정보가 빠지고, HNSW 검색은 Profile과 벡터 유형 필터 뒤에 후보가 모자라 정답을 놓칠 수 있었습니다. 잘못된 후보가 느린 검색보다 더 큰 문제라고 보고, 정확도를 먼저 확인한 뒤 속도를 다루기로 했습니다.',
        build:
          '질문+답변 벡터를 추가하고 후보 누락 때문에 한때 전체 비교(exact) 검색으로 바꿨습니다(#182). 선택적 Reranker도 붙였습니다. 후보 순서만 바꾸고, 호출이 몰리거나 연속으로 실패하면 벡터 결과로 답합니다(#194). 이후 pgvector iterative scan(strict_order, ef_search=200)을 검색 트랜잭션에만 적용하고, FAQ별 중복을 지운 뒤 모자라면 후보 범위를 두 배씩 넓혀 HNSW를 다시 적용했습니다(#251). 235문항 정정 평가와 지연, 장애 비용을 보고 Reranker는 제거해 질문 벡터 검색으로 통일했습니다(#289).',
        outcome:
          '#182, #194, #251, #289가 병합됐습니다. 합성 1만 건에서 FAQ 검색 p50은 28.82ms에서 4.66ms, intent 검색은 21.61ms에서 4.66ms가 됐고 exact와 상위 3개 결과가 같았습니다.',
        limit:
          '합성 데이터 결과라 실제 FAQ 임베딩 기준 재측정이 남아 있습니다. 1천 건에서는 HNSW 경로가 약 1.8~1.9배 느렸습니다. 소량인 상담 금지 문장 검색은 놓치면 차단 실패라 exact를 유지합니다.',
        evidence: [
          {
            label: 'FAQ 벡터 검색을 HNSW로 전환 (#251)',
            href: `${ubotBe}/pull/251`,
            detail: 'iterative scan · 후보 확장 · 1만 건 측정',
          },
          {
            label: 'FAQ 질문+답변 임베딩과 exact 전환 (#182)',
            href: `${ubotBe}/pull/182`,
          },
          {
            label: '선택적 Reranker (#194)',
            href: `${ubotBe}/pull/194`,
            detail: '과거 구현 · #289에서 제거',
          },
        ],
      },
      {
        group: '채팅 백엔드',
        title: '내 컴퓨터와 CI에서 같은 기능을 검증하기',
        brief: {
          plan: 'pgvector와 PostGIS 확장 버전이 PC마다 다르면 특정 환경에서만 실패합니다.',
          build: [
            '로컬 Compose와 Testcontainers가 같은 DB Dockerfile 사용',
            'PostgreSQL 18, pgvector, PostGIS 버전 고정, 확장 생성은 Flyway',
            '프론트는 package-lock 커밋으로 같은 버전에서 시작',
          ],
          outcome: '백엔드 #3 #10, 프론트 #2 병합. CI에서 실제 vector 검색과 PostGIS 함수를 실행합니다.',
        },
        plan: 'UBot은 PostgreSQL의 pgvector와 PostGIS 확장에 의존합니다. 개발자마다 확장 버전이 다르면 특정 PC에서만 실패하고, 다른 DB로 대체하면 확장 함수의 실제 동작을 검증할 수 없습니다. 로컬과 CI가 같은 DB 정의를 쓰게 하기로 했습니다.',
        build:
          '로컬 Compose와 Testcontainers가 같은 PostgreSQL Dockerfile을 사용합니다. PostgreSQL 18, pgvector 0.8.6, PostGIS 3.6.4로 버전을 고정하고 확장 생성은 Flyway로 통일했습니다. 테스트는 매번 독립 DB를 띄우고 개발 DB로 넘어가지 않게 막았습니다. 프론트도 초기 환경을 잡고 package-lock을 커밋해 팀이 같은 버전으로 시작하게 했습니다.',
        outcome:
          '백엔드 #3, #10과 프론트 #2가 병합됐습니다. CI에서 실제 vector 저장과 검색, PostGIS 공간 함수를 실행합니다.',
        limit:
          '테스트의 임베딩 모델은 결정적인 대역입니다. 이 테스트의 범위는 DB 통합이고, 검색 품질은 별도 실험으로 다룹니다.',
        evidence: [
          {
            label: '독립 DB·임베딩 테스트 설정',
            href: `${ubotBe}/blob/develop/src/test/java/com/ubot/PgvectorTestConfiguration.java`,
            detail: '공유 Dockerfile · 테스트별 독립 컨테이너',
          },
          {
            label: '테스트·빌드 CI',
            href: `${ubotBe}/blob/develop/.github/workflows/ci.yml`,
          },
        ],
      },
    ],
    limitations:
      '팀 프로젝트입니다. 회원 인증(JWT), FAQ 관리, 매장 지도 검색은 팀원이 담당했습니다. 장애 복구 시험은 로컬에서 장애마다 한 번씩 실행했고, AWS 부하 시험은 k6 합성 회원으로 한 결과입니다. 금지어 캐시와 게스트 세션은 서버 한 대를 기준으로 만들었습니다. Spot GPU 자동 확장은 구성까지 했고 실제 트래픽으로 검증하지 않았습니다.',
    proofs: [
      {
        label: '백엔드에서 직접 기여한 PR',
        href: `${ubotBe}/pulls?q=is%3Apr+is%3Amerged+author%3ACatverdose`,
        detail: '병합 34건 (2026-10-30 기준)',
      },
      {
        label: '부하·장애 시험 도구와 결과 (UBot-ServerTest)',
        href: ubotServerTest,
        detail: 'AWS 6,000건 재시험 · 장애 4종 주입 · 알림 설정 검증',
      },
      {
        label: '프론트에서 직접 기여한 PR',
        href: `${ubotFe}/pulls?q=is%3Apr+is%3Amerged+author%3ACatverdose`,
        detail: '병합 15건 (2026-10-30 기준)',
      },
      {
        label: '개발 문서 현행화 (#107)',
        href: `${ubotBe}/pull/107`,
        detail: '문서 내용을 실제 호출해 52건 중 51건 일치, 1건은 문서 수정',
      },
    ],
    relatedProjectIds: ['llm-serving', 'vector-db-benchmark'],
  },
  {
    id: 'petcoupon',
    number: '02',
    title: 'PetCoupon',
    kind: 'TEAM',
    tier: 'featured',
    typeLabel: '팀 · 백엔드 6명',
    period: '2026.08 ~ 2026.09',
    question: '로그 하나가 스스로 불어난다면?',
    description: '선착순 발급을 뒷받침하는 관리자 경합 처리와 운영 모니터링',
    role: '이벤트·쿠폰 관리 · 관리자 API · 스케줄러 · 모니터링',
    contribution: [
      'Merged PR 24개',
      '테스트 파일 50여 개',
      '통합 시나리오 16개 담당',
    ],
    technologies: ['Spring Boot', 'JPA', 'MySQL', 'Redis', 'SSE'],
    highlights: [
      '관리자 수정과 발급·스케줄러의 경합 제어',
      'SSE 모니터링 오류의 자기증폭 차단',
      '로그 마스킹 최악 비용 4.7초 → 약 3ms',
    ],
    github: petcoupon,
    overview:
      '대량 요청에서도 초과 발급 없이 사용자당 한 장을 발급하는 팀 프로젝트입니다. 저는 이벤트·쿠폰 관리와 관리자 운영, 모니터링을 맡았고 Redis·Kafka 발급 파이프라인은 팀원이 담당했습니다.',
    features: [
      {
        title: '로그 하나를 보냈는데 같은 로그가 계속 왔다',
        brief: {
          plan: '관리자가 경고와 오류 로그를 실시간으로 보는 SSE 모니터링을 맡았습니다.',
          build: [
            '증상: 테스트 로그 하나가 계속 반복되고 화면이 느려짐',
            '원인: 큐가 차면 낸 오류 로그를 모니터링이 다시 수집',
            '해결: 큐 1,000 → 50, 가득 차면 오래된 로그를 버리고 개수만 통지',
          ],
          outcome: '#179 #192 병합. 로컬에서 연결을 62번 끊어도 같은 예외 0건(PR 기록).',
        },
        plan: '관리자가 서버 경고와 오류 로그를 실시간으로 보는 모니터링을 맡았습니다. Logback appender에서 마스킹을 거쳐 SSE로 보내고, 구독자마다 큐를 따로 두어 느린 구독자 한 명이 다른 구독자와 로그를 쓰는 요청을 늦추지 않게 하려 했습니다.',
        build:
          '프론트와 처음 연결해 테스트 로그를 하나 보냈더니 같은 로그만 계속 오고 화면이 크게 느려졌습니다. 500 에러를 일부러 내며 콘솔 로그를 따라가 보니, 연결이 끊긴 뒤 큐가 차면 오류를 냈고 그 오류 로그를 모니터링이 다시 수집하면서 스스로 불어나고 있었습니다. 먼저 구독자별 큐를 1,000개에서 50개로 줄였습니다. 큐가 작아지니 가득 찰 때의 처리가 중요해져, 오류 대신 오래된 로그를 버리고 버린 개수만 알리게 바꿨습니다. 모니터링 자신의 로그는 다시 수집하지 않게 막고, 큐 앞에 경고와 오류만 통과시키는 게이트를 두었습니다.',
        outcome:
          '#179, #192가 병합됐습니다. 수정 후 로컬에서 SSE 연결을 62번 강제로 끊어도 같은 예외는 나지 않았고 남은 구독도 0개였습니다(PR 작성 당시 실행 기록). 큐 삽입 경쟁을 재현하는 테스트와 종료 생명주기 회귀 테스트를 남겼습니다.',
        limit:
          '큐 크기 50은 측정으로 정한 값이 아니라, 경고와 오류만 받는다는 점에서 잡은 설정값입니다. 최근 로그를 우선하므로 로그 유실을 허용하며, 유실량은 events-dropped 통지와 지표로 드러냅니다.',
        evidence: [
          {
            label: 'SSE 장애 격리 테스트',
            href: `${petcoupon}/blob/main/src/test/java/com/mycom/petcoupon/monitoring/service/MonitoringSseServiceTest.java`,
            detail: '느린 구독자 격리 · 비차단 로그 생산 · overflow 손실 통지',
          },
          {
            label: 'SSE 예외 처리와 backpressure 개선 (#192)',
            href: `${petcoupon}/pull/192`,
          },
        ],
      },
      {
        title: '공용 설정으로 묶는 대신 전용 실행기를 둔 이유',
        brief: {
          plan: '상태 전환 스케줄러를 팀의 공용 설정에 묶을지, 따로 둘지 정해야 했습니다.',
          build: [
            '공용 설정은 발급 기능에 영향이 갈 수 있고 팀원이 수정 중',
            '비용 차이가 크지 않아 전용 실행기를 선택',
            '조건부 UPDATE로 같은 전환이 두 번 적용되지 않게 처리',
            '예외 한 번에 실행기가 멈추지 않도록 작업 전체를 감쌈',
          ],
          outcome: '#68 #74 #101 #145 병합. 테스트를 깨뜨리던 스케줄러는 설정으로 끌 수 있게 했습니다.',
        },
        plan: '이벤트와 쿠폰의 상태를 시각과 재고에 맞춰 자동으로 바꾸는 스케줄러를 맡았습니다. 처음에는 팀의 다른 예약 작업과 같은 공용 설정에 묶으려 했습니다.',
        build:
          '이 프로젝트에서 가장 중요한 기능은 쿠폰 발급이고 스케줄러는 그다음이었습니다. 발급 쪽은 Redis와 Kafka가 얽혀 있어 공용 설정을 바꾸면 어디에 영향이 갈지 예측하기 어려웠고, 그 설정은 다른 팀원이 수정하는 중이었습니다. 전용 실행기를 두는 비용도 큰 차이가 없어 영향 범위가 작은 쪽을 택했습니다. 상태는 현재 값이 기대한 값일 때만 바꾸는 조건부 UPDATE로 처리해 같은 전환이 두 번 적용되지 않게 했고, Awaitility로 실제 스케줄 실행을 기다리는 테스트를 작성했습니다. scheduleAtFixedRate는 작업이 예외로 끝나면 다음 실행을 예약하지 않아, 트랜잭션 바깥에서 작업 전체를 감싸 실패해도 다음 주기가 이어지게 했습니다. 통합 테스트가 같은 MySQL을 쓰는 동안 스케줄러가 이력 행을 써서 외래키 오류가 매번 다른 곳에서 났고, 스케줄러마다 켜고 끄는 설정을 달아 해결했습니다.',
        outcome:
          '#68, #74, #101, #145가 병합됐습니다. 팀원의 구현 영역을 다시 고치지 않고 통합했습니다. 예외가 매번 나도 다음 주기에 다시 실행되는지, 설정을 지우면 가드 테스트가 실패하는지 회귀 테스트로 고정했습니다.',
        limit:
          '전용 실행기는 프로세스 단위라, 서버가 여러 대일 때 한 번만 실행된다는 보장은 아닙니다. 지연 감소 같은 수치는 측정하지 않았습니다.',
        evidence: [
          {
            label: '이벤트 상태 전환 스케줄러 (#68)',
            href: `${petcoupon}/pull/68`,
          },
          {
            label: '쿠폰 상태 자동 전이 스케줄러 (#74)',
            href: `${petcoupon}/pull/74`,
            detail: '전용 실행기 · 예외에도 다음 주기 유지',
          },
          {
            label: '스케줄러 켜고 끄는 설정 (#101)',
            href: `${petcoupon}/pull/101`,
            detail: '테스트 중 외래키 오류의 원인 제거',
          },
        ],
      },
      {
        title: '여러 갱신 경로가 같은 데이터를 만날 때',
        brief: {
          plan: '관리자 수정, 발급, 스케줄러가 같은 쿠폰과 재고를 동시에 갱신합니다.',
          build: [
            '상태값 외에 DB 시각 기준 발급 시작 시각과 발급 수량도 확인',
            '더티체킹이 낡은 값을 덮어쓰지 않도록 @DynamicUpdate',
            '쿠폰 다음 재고 순서로 비관적 락을 잡아 발급 경로와 순서 통일',
          ],
          outcome: '#83 #87 병합. 테스트 34개 추가, 당시 전체 211개 통과(PR 기록).',
        },
        plan: '관리자 수정, 발급 처리, 상태 스케줄러가 같은 쿠폰과 재고를 동시에 갱신합니다. 스케줄러가 바꾸는 상태값에만 기대면, 발급 시작 시각이 지났는데 상태가 아직 바뀌지 않은 틈에 정책을 고칠 수 있었습니다.',
        build:
          '기존 값과 PATCH 입력을 합친 최종 정책을 검증하고, 상태 외에 DB 시각 기준 발급 시작 시각과 발급 수량을 함께 확인합니다. 더티체킹 UPDATE는 바꾸지 않은 컬럼까지 쓰기 때문에, 그대로 두면 스케줄러가 바꾼 ACTIVE를 낡은 READY로 되돌리거나 발급 수량을 0으로 덮어써 초과 발급이 생길 수 있었습니다. 쿠폰과 재고 두 행을 PESSIMISTIC_WRITE로 잡고 @DynamicUpdate로 바꾼 컬럼만 쓰게 했습니다. 잠금 순서는 발급 경로와 같은 쿠폰 다음 재고로 맞춰 교착을 피했습니다. 이벤트 일반 정보 수정 엔드포인트 3개는 PATCH 1개로 합치고, 상태 변경은 현재 상태를 조건에 둔 UPDATE로 분리했습니다.',
        outcome:
          '#83, #87이 병합됐습니다. 쿠폰 수정 PR에서 테스트 34개를 추가했고 당시 전체 211개가 통과했습니다(PR 기록). 팀 공동 부하 테스트에서는 초과·중복 발급 0건이었지만 접수 응답 p95의 회차 평균은 16.31초로 목표에 미달했습니다. 처리량과 지연, 발급 정합성은 팀 전체 결과입니다.',
        limit:
          '이벤트 자체를 잠그는 변경(#219)은 병합되지 않았습니다. 쿠폰과 재고 행 잠금이 Redis까지 포함한 원자성을 뜻하지는 않습니다.',
        evidence: [
          {
            label: '관리자 쿠폰 수정 API (#87)',
            href: `${petcoupon}/pull/87`,
            detail: '비관적 락 · @DynamicUpdate · 잠금 순서',
          },
          {
            label: '팀 성과·부하 테스트 조건',
            href: `${petcoupon}/blob/main/README.md`,
            detail: '측정 환경, 반복 실행별 처리량·지연, 목표 대비 결과',
          },
          {
            label: '담당 범위와 기여 내역',
            href: `${petcoupon}/blob/main/docs/contributors.md`,
          },
        ],
      },
      {
        title: 'Redis와 DB가 서로 다른 재고를 말할 때',
        brief: {
          plan: '재고는 Redis가 실시간으로 판정하고 MySQL이 나중에 확정해, 두 값이 어긋날 수 있습니다.',
          build: [
            '쿠폰 생성과 수량 수정 때 Redis 재고를 함께 초기화',
            'Redis 초기화가 실패하면 DB 변경도 롤백',
            '목록은 DB 확정 재고와 기준 시각, 단건은 Redis 실시간 값',
          ],
          outcome: 'Redis 재고 일치는 통합 테스트로, 목록 쿼리 수는 Hibernate 통계로 확인합니다.',
        },
        plan: '발급 재고는 Redis가 실시간으로 판정하고 MySQL은 비동기로 확정합니다. 관리자가 쿠폰을 만들거나 수량을 바꿀 때 두 저장소가 어긋나면 발급이 막히거나 화면의 수치가 틀어집니다. 목록에서 쿠폰마다 Redis를 읽으면 왕복이 늘고, 한 건의 오류가 목록 전체를 실패시킵니다.',
        build:
          '쿠폰 생성과 총수량 수정 때 Redis 발급 재고를 함께 초기화하고, Redis 초기화가 실패하거나 값이 되읽히지 않으면 DB 변경을 롤백합니다. 목록은 DB에 확정된 재고와 그 기준 시각(stockUpdatedAt)을, 단건 조회는 Redis 실시간 재고를 씁니다. 기준 시각은 처음에 발급이 확정돼도 바뀌지 않았는데, @Modifying 벌크 UPDATE가 영속성 컨텍스트를 거치지 않아 @LastModifiedDate가 적용되지 않은 것이었습니다. 같은 UPDATE 문에서 시각도 함께 바꾸게 고쳤습니다(#147).',
        outcome:
          '생성·수정 뒤 Redis 재고가 새 수량과 같은지 통합 테스트로 확인합니다. 목록 조회는 Hibernate 통계로 쿠폰 수만큼 쿼리가 늘지 않는지 고정했습니다.',
        limit:
          'Redis는 DB 트랜잭션에 참여하지 않아 두 저장소가 하나의 원자적 트랜잭션으로 묶이지는 않습니다. Redis 쪽 실패는 롤백으로 막고, 목록 수치가 확정 시점만큼 늦는 것은 기준 시각으로 드러냅니다.',
        evidence: [
          {
            label: 'Redis 재고 동기화 통합 테스트',
            href: `${petcoupon}/blob/main/src/test/java/com/mycom/petcoupon/coupon/controller/AdminCouponRedisStockSyncIntegrationTest.java`,
            detail: '쿠폰 생성·총수량 수정 뒤 Redis 발급 재고 일치',
          },
          {
            label: '목록 조회 쿼리 수 테스트',
            href: `${petcoupon}/blob/main/src/test/java/com/mycom/petcoupon/coupon/repository/CouponRepositoryCouponPageTest.java`,
            detail: '쿠폰마다 추가 쿼리가 나가지 않는지 Hibernate 통계로 확인',
          },
        ],
      },
      {
        title: '관리자 인증이 설정 실수로 열리지 않도록',
        brief: {
          plan: '인증 코드가 비거나 토큰 원문이 남으면 설정 실수가 곧 관리자 권한 노출이 됩니다.',
          build: [
            '세션 토큰은 해시로만 Redis에 저장하고 TTL 적용',
            '인증 코드가 빈 값이면 세션 발급 거절',
            'SSE로 나가는 로그에서 인증 정보 마스킹',
          ],
          outcome: '해시 저장, 세션별 폐기, 빈 인증 코드 거절을 테스트로 확인합니다.',
        },
        plan: '관리자 API는 이벤트·쿠폰 수정과 운영 모니터링을 엽니다. 인증 코드가 비어 있거나 토큰 원문이 저장소에 남으면, 설정 실수나 저장소 노출이 곧 관리자 권한 노출로 이어집니다.',
        build:
          '세션 토큰은 원문 대신 해시로 Redis에 저장하고 TTL을 적용합니다. 인증 코드는 상수 시간 비교로 확인하고, 빈 값으로 설정되면 세션 발급을 거절합니다. 검사는 필터가 아니라 인터셉터에 둬 오류 응답 형식을 다른 API와 맞췄고, 인증을 건너뛰는 세션 발급은 경로가 아니라 메서드 단위 표시(@NoAdminSession)로 열었습니다. 경로 단위로 열면 같은 경로의 세션 폐기(DELETE)까지 열리기 때문입니다. 모니터링 SSE로 나가는 로그에서는 관리자 키·쿠키 같은 인증 정보를 마스킹했고, [REDACTED]가 찍혔는데 옆에 진짜 값이 남는 부분 마스킹 다섯 가지를 실측으로 찾아 막았습니다(#221).',
        outcome:
          '토큰이 해시로만 저장되는지, 폐기한 세션만 무효화되고 다른 세션은 유지되는지, 인증 코드가 비어 있으면 입력값과 무관하게 발급이 거절되는지 테스트합니다.',
        limit:
          '인증 코드 하나로 세션을 발급하는 구조라 관리자 계정별 권한 구분은 없습니다. 환경변수가 없으면 개발용 기본 코드가 적용되므로 배포 전에 반드시 교체해야 합니다.',
        evidence: [
          {
            label: '관리자 인증 세션 발급 API (#108)',
            href: `${petcoupon}/pull/108`,
            detail: '해시 저장 · 인터셉터 · 메서드 단위 예외',
          },
          {
            label: 'SSE 로그 인증정보 마스킹 강화 (#221)',
            href: `${petcoupon}/pull/221`,
          },
          {
            label: '관리자 세션 테스트',
            href: `${petcoupon}/blob/main/src/test/java/com/mycom/petcoupon/global/auth/service/AdminSessionServiceImplTest.java`,
            detail: '해시 저장 · TTL · 세션별 폐기',
          },
          {
            label: '인증 코드 누락 시 거절 테스트',
            href: `${petcoupon}/blob/main/src/test/java/com/mycom/petcoupon/global/auth/service/AdminSessionAuthCodeMissingTest.java`,
          },
        ],
      },
    ],
    limitations:
      '관리자 인증은 단일 인증 코드 기반이라 계정별 권한이 없습니다. 확정 처리량(Stream Consumer 단일 스레드)과 접수 응답 p95는 팀 차원에서 남은 과제입니다.',
    proofs: [
      {
        label: '느린 구독자 격리 테스트',
        href: `${petcoupon}/blob/main/src/test/java/com/mycom/petcoupon/monitoring/service/MonitoringSseServiceTest.java`,
        detail: '모니터링 장애가 비즈니스 요청에 번지지 않는지 확인',
      },
      {
        label: '본인 기여 범위',
        href: `${petcoupon}/blob/main/docs/contributors.md`,
        detail: '이벤트·쿠폰 관리, 관리자 운영, 모니터링',
      },
      {
        label: '직접 기여한 PR',
        href: `${petcoupon}/pulls?q=is%3Apr+is%3Amerged+author%3ACatverdose`,
        detail: '병합 24건',
      },
    ],
    relatedProjectIds: ['concurrency'],
  },
  {
    id: 'engineering-memory',
    number: '03',
    title: 'Engineering Memory',
    kind: 'PERSONAL',
    tier: 'featured',
    typeLabel: '개인 프로젝트',
    period: '2026.09',
    question: '늦게 끝난 색인이 도착한다면?',
    description: '답변보다 먼저, 색인 상태와 사용자 데이터의 경계를 설계하다',
    role: '설계 · 구현 · 인프라 · 문서 전체',
    technologies: ['Spring Boot', 'Go', 'PostgreSQL', 'pgvector', 'Ollama'],
    highlights: [
      '비동기 색인의 stale write 차단',
      '사용자 격리를 검색 조건과 DB 제약으로 검증',
    ],
    github: 'https://github.com/Catverdose/engineering-memory',
    live: profile.liveAvailable ? profile.live : undefined,
    overview:
      '개발 기록을 저장하고 그 기록을 근거로 답하는 개인 RAG 서비스입니다. GCP L4 Spot에 배포해 색인과 검색을 E2E로 검증했고 도메인에는 Caddy로 HTTPS를 붙였습니다. 지금은 서버를 내려 두었습니다.',
    features: [
      {
        title: '늦게 끝난 색인이 최신 문서를 덮어쓰지 않도록',
        brief: {
          plan: '비동기 색인 중에 문서가 수정되면 늦게 끝난 이전 작업이 새 문서를 덮어쓸 수 있습니다.',
          build: [
            '임베딩 계산은 트랜잭션 밖에서 수행',
            '저장 직전에 version, 상태, attempt를 다시 확인',
            '일치할 때만 chunk 교체와 READY 전환을 한 트랜잭션으로',
          ],
          outcome: '연속 요청 합치기, 동시 처리 한도, 기동 시 복구를 테스트합니다.',
        },
        plan: '등록 API가 202 Accepted를 반환한 뒤 비동기 색인이 진행됩니다. 이 사이 문서가 수정되면 이전 작업의 embedding이 새 문서를 덮어쓸 수 있습니다. 외부 모델 호출을 트랜잭션 안에 두면 락이 길어지므로, 계산은 밖에서 하고 저장 직전에 다시 확인하기로 했습니다.',
        build:
          '저장 직전에 version·status·attempt UUID를 확인합니다. 일치하지 않으면 결과를 버리고 재색인을 예약합니다. 기존 chunk 삭제, 새 chunk 삽입, READY 전환은 한 트랜잭션으로 처리합니다.',
        outcome:
          '같은 문서의 연속 요청을 합치고 최신 세대를 다시 처리하는지, 동시 처리 한도를 넘은 문서가 유실되지 않는지, 기동 시 PENDING 작업을 복구하는지 테스트합니다.',
        limit:
          '오래된 계산 결과를 버리는 비용을 감수하고 저장 시점의 정합성을 우선했습니다. 실패한 색인은 자동 무한 재시도 대신 수동 재색인으로 복구합니다.',
        evidence: [
          {
            label: '색인 저장 경계 구현',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/main/java/com/engineeringmemory/knowledge/service/DocumentIndexWriter.java',
            detail: 'version · PENDING 상태 · attempt UUID 확인 후 chunk 교체',
          },
          {
            label: '색인 큐·복구 테스트',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/knowledge/service/DocumentIndexingServiceTest.java',
            detail: '동시 처리 한도, 동일 문서 coalescing, 기동 복구',
          },
        ],
      },
      {
        title: '답변 생성 도중 서버가 멈춰도 상태는 남도록',
        brief: {
          plan: '생성 중 서버가 재기동되면 끝나지 않는 답변이 남고, 근거 없는 질문에는 모델이 답을 지어낼 수 있습니다.',
          build: [
            'GENERATING 상태를 먼저 저장하고 완료 때 확정',
            '기동 시 남은 GENERATING은 FAILED로 복구',
            '근거가 없으면 LLM을 부르지 않고 NO_CONTEXT 저장',
          ],
          outcome: '상태 전이와 복구 경로를 아키텍처 문서에 정리했습니다.',
        },
        plan: 'LLM 생성은 오래 걸릴 수 있습니다. 서버가 재기동되면 사용자가 끝나지 않는 답변을 보게 될 수 있습니다. 근거가 없는 질문에 모델이 답을 지어내는 것도 막아야 했습니다.',
        build:
          'beginTurn에서 사용자 메시지와 GENERATING 답변을 먼저 저장합니다. completeTurn에서 답변과 근거를 확정하고, 기동 시 남은 GENERATING은 FAILED로 복구합니다. 유사도 0.45 이상인 근거가 없으면 NO_CONTEXT를 저장하고 LLM 호출을 생략합니다.',
        outcome:
          '근거 없는 답변과 불필요한 GPU 사용을 함께 제한합니다. 대화 상태 전이와 복구 경로를 아키텍처 문서에 정리했습니다.',
        limit:
          '중단된 생성을 자동으로 이어 붙이지 않고 FAILED로 명시합니다. 근거가 부족한 질문에는 답변 생성을 생략하며, 검색 품질 개선은 다음 검증 과제입니다.',
        evidence: [
          {
            label: '대화 상태·장애 복구 설계',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/docs/architecture.md',
          },
        ],
      },
      {
        title: '사용자 데이터 격리를 DB까지 이어가기',
        brief: {
          plan: '한 DB를 여러 사용자가 쓰면 조회 조건 실수 하나가 다른 사용자의 기록 노출이 됩니다.',
          build: [
            'owner ID는 인증 정보에서만 가져옴',
            '모든 조회에 owner 조건 적용',
            '(id, owner_id) 복합 FK로 교차 참조를 DB에서 거부',
          ],
          outcome: '다른 사용자의 문서가 검색에 섞이지 않는지 통합 테스트로 확인합니다.',
        },
        plan: '하나의 DB를 공유하는 환경에서는 조회 조건의 실수 하나가 다른 사용자의 기록 노출로 이어질 수 있습니다. 읽기 조건만으로는 잘못된 저장을 막을 수 없어 DB 제약을 함께 두기로 했습니다.',
        build:
          'owner ID는 인증 principal에서만 가져옵니다. 모든 조회에 owner 조건을 적용하고 (id, owner_id) 복합 FK로 교차 사용자 참조를 DB에서 거부합니다.',
        outcome:
          '다른 사용자의 문서가 더 높은 유사도를 가져도 검색에 섞이지 않는지 테스트합니다. owner 필터가 LIMIT 전에 적용되는지, 다른 소유자의 chunk 수정과 교차 사용자 참조가 거부되는지도 확인합니다.',
        evidence: [
          {
            label: '사용자 경계 통합 테스트',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/knowledge/repository/DocumentChunkVectorRepositoryIsolationTest.java',
            detail: '검색·수정·참조 경계와 owner 필터 적용 순서',
          },
        ],
      },
      {
        title: '모델 서버 한 대를 대화와 색인이 나눠 쓸 때',
        brief: {
          plan: 'GPU 한 대를 대화와 색인이 함께 써서, 한쪽이 몰리면 다른 쪽이 밀립니다.',
          build: [
            '대화는 동시 50건까지, 넘으면 즉시 MODEL_BUSY로 거절',
            '색인은 대화가 있으면 배치마다 최대 30초 양보',
            '바깥 계층일수록 timeout을 길게 잡아 안쪽이 먼저 종료',
          ],
          outcome: '대화 중 색인 양보와 색인 기아 방지를 테스트합니다.',
        },
        plan: '답변 생성과 문서 임베딩이 GPU 한 대의 Ollama를 함께 씁니다. 색인이 몰리면 대화가 늦어지고, 대화가 끊이지 않으면 색인이 끝없이 밀릴 수 있습니다. 요청이 한꺼번에 들어오면 모델 앞에 대기열이 쌓입니다.',
        build:
          '대화는 동시 50건까지만 받고, 넘으면 기다리게 하지 않고 즉시 MODEL_BUSY로 거절합니다. 색인은 대화가 있으면 배치마다 최대 30초까지 양보한 뒤 진행합니다. IP별 요청 제한을 gateway와 backend에 따로 두고, 바깥 계층(nginx > gateway > backend > Ollama)일수록 timeout을 길게 잡아 안쪽이 먼저 끝나게 했습니다.',
        outcome:
          '대화 중에는 색인이 비켜서고 마지막 대화가 끝나면 다시 도는지, 대화가 끊이지 않아도 색인이 굶지 않는지 테스트합니다. 설정 테스트로 운영 프로필이 요청 제한을 느슨하게 덮지 않는지, 프록시 헤더를 Docker 프로필에서만 신뢰하는지, 스트림 timeout이 모델 timeout보다 긴지 고정했습니다.',
        limit:
          '대화 응답성을 위해 색인 완료가 늦어질 수 있습니다. 양보에 30초 상한을 둬 색인이 굶지 않게 했고, 한도를 넘는 대화는 대기열에 쌓는 대신 거절해 지연이 누적되지 않게 했습니다.',
        evidence: [
          {
            label: '대화 우선·색인 양보 테스트',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/llm/workload/ModelWorkloadGateTest.java',
            detail: '즉시 거절 · 양보 후 재개 · 색인 기아 방지',
          },
          {
            label: '운영 설정 안전장치 테스트',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/ConfigYamlTest.java',
            detail: '요청 제한 · 프록시 헤더 신뢰 범위 · timeout 순서',
          },
          {
            label: 'timeout 사슬과 요청 제한 설계',
            href: 'https://github.com/Catverdose/engineering-memory/blob/main/docs/architecture.md',
          },
        ],
      },
    ],
    limitations:
      'Phase 1의 상태 관리와 데이터 격리를 구현했습니다. 실패한 색인은 수동 재색인으로 복구하며 DB 마이그레이션 도구는 미도입 상태입니다. 실제 질의 기반 검색 품질 평가는 다음 단계입니다.',
    proofs: [
      {
        label: '사용자 격리 테스트',
        href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/knowledge/repository/DocumentChunkVectorRepositoryIsolationTest.java',
        detail: '다른 사용자의 문서가 검색 결과에 섞이지 않는지 확인',
      },
      {
        label: '색인 큐·복구 테스트',
        href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/knowledge/service/DocumentIndexingServiceTest.java',
        detail: '연속 수정·동시 작업·재기동 상황 재현',
      },
      {
        label: '대화 우선·색인 양보 테스트',
        href: 'https://github.com/Catverdose/engineering-memory/blob/main/backend/src/test/java/com/engineeringmemory/llm/workload/ModelWorkloadGateTest.java',
        detail: 'GPU 한 대에서 대화 지연과 색인 기아를 함께 막기',
      },
    ],
    relatedProjectIds: ['vector-db-benchmark'],
  },
  {
    id: 'concurrency',
    number: '04',
    title: 'Coupon Concurrency',
    kind: 'EXPERIMENT',
    tier: 'experiment',
    typeLabel: '개인 실험 · 팀 실험 확장',
    period: '2026.08',
    question: '초과 발급이 없으면, 성공일까?',
    description: '초과 발급이 없어도 깨지는 동시성 제어의 경계',
    role: '9개 전략 설계 · 구현 · 측정 · 분석',
    technologies: ['Java 21', 'MySQL', 'Redis', 'k6'],
    highlights: [
      'lost update·정상 회원 탈락·연결 고갈 재현',
      '응답·재고 원장·대상자 발급을 함께 검증',
    ],
    github: 'https://github.com/Catverdose/concurrency-strategies',
    overview:
      '같은 발급 흐름에서 재고 예약 전략만 바꿔 9개를 비교했습니다. 1인 1매는 모든 전략이 지켰지만, 판정 기준 6개를 모두 통과한 것은 단일 인스턴스의 JVM_LOCK뿐이었습니다. 팀 실험의 공통 코드를 만든 뒤 혼자 9개로 넓힌 실험입니다.',
    features: [
      {
        title: '최종 재고가 맞아도 정상 회원은 탈락할 수 있다',
        brief: {
          plan: '초과 발급이 없다고 정합성이 지켜진 것은 아니라고 보고, 판정 기준을 따로 세웠습니다.',
          build: [
            '판정 기준 6개 정의',
            '회원 1만 명이 서로 다른 requestId로 3번씩 요청(3만 건)',
            '정순과 역순으로 실행',
          ],
          outcome: 'VU 50에서 DECR 9,999명, LUA 9,998명 발급. 원장은 일치했지만 정상 회원이 탈락했습니다.',
        },
        plan: '처리량만 보면 초과 발급이나 빠른 품절 응답이 좋은 성능처럼 보입니다. 초과 발급이 없다고 정합성이 지켜진 것은 아니라고 보고, 판정 기준을 따로 세우기로 했습니다.',
        build:
          '판정 기준 6개(초과 발급, 재고 원장, 오류 응답, 1인 1매, 대상자 전원 발급, 응답 분류)를 정했습니다. 한 회원이 서로 다른 requestId로 세 번씩 요청하는 시나리오(1만 명, 3만 건)를 만들고 정순과 역순으로 실행했습니다.',
        outcome:
          'VU 50에서 DECR는 9,999명, LUA는 9,998명에게 발급됐습니다. 최종 원장은 일치했지만 정상 회원이 탈락했습니다. 같은 회원의 동시 요청이 사전 중복 조회를 함께 통과해 Redis 재고를 각각 예약하고, DB 유니크 충돌 후 보상되기 전까지 일시 품절이 생긴 것입니다.',
        limit:
          '중복 확인과 예약을 하나의 Lua 실행으로 묶은 변형은 아직 측정하지 않았습니다. 다음에 검증할 가설로 남겼습니다.',
        evidence: [
          {
            label: '중복 회원 정순 실험 보고서',
            href: 'https://github.com/Catverdose/concurrency-strategies/blob/main/docs/02-duplicate-user.md',
            detail: '대상 회원 10,000명 · 각 3회 요청 · VU 50',
          },
        ],
      },
      {
        title: 'WATCH 전략에서 요청의 90%가 응답을 받지 못했다',
        brief: {
          plan: 'WATCH 결과에 무응답이 섞여, 낮은 지연이 정상 성능처럼 보였습니다.',
          build: [
            'WATCH만 단독 실행',
            'Redis 포트를 바꿔 이전 실행의 영향 배제',
            '성공, 중복, 오류, 무응답과 TIME_WAIT를 함께 기록',
          ],
          outcome: '12만 건 중 107,225건 무응답, TIME_WAIT 약 14,900개. 연결 생성과 종료 반복이 원인으로 유력합니다.',
        },
        plan: 'WATCH 전략 결과에 무응답이 섞여, 낮은 지연이 정상 성능처럼 보였습니다. 알고리즘의 정합성과 요청을 처리할 수 있는지를 나눠 봐야 했습니다.',
        build:
          '다른 전략의 실험을 오염시키지 않도록 WATCH만 단독 실행하고, Redis 포트를 바꿔 이전 실행의 영향을 배제했습니다. 성공, 중복, 오류, 무응답과 TIME_WAIT를 함께 기록했습니다.',
        outcome:
          'VU 10·50·100·200 모두에서 재현했습니다. 12만 건 중 107,225건이 응답을 받지 못했고, TIME_WAIT는 약 14,900개로 로컬 동적 포트 16,384개에 근접했습니다. 재시도 과정에서 Redis 연결을 반복해 만들고 닫은 것이 원인으로 유력합니다.',
        limit:
          '당시 netstat 원시 로그가 없어 원인은 유력한 수준입니다. 현재 연결 관리 구현과 로컬 실행 환경에 한정된 결과이고, 연결 재사용을 고친 뒤의 재측정이 필요합니다.',
        evidence: [
          {
            label: 'WATCH 연결 고갈 재현 결과',
            href: 'https://github.com/Catverdose/concurrency-strategies/blob/main/docs/03-vu-scaling.md',
            detail: '전송 실패·TIME_WAIT 관찰값과 성능 비교 제외 이유',
          },
        ],
      },
      {
        title: 'VU를 늘려도 처리량은 늘지 않았다',
        brief: {
          plan: '가상 사용자를 늘릴 때 처리량과 지연이 어떻게 변하는지 확인하려 했습니다.',
          build: [
            '9개 전략을 VU 10, 50, 100, 200에서 실행',
            '36개 조건, 조건마다 3만 건(요청 시도 108만 건)',
          ],
          outcome: 'WATCH를 뺀 8개 전략은 VU 50에서 200으로 늘려도 처리량이 1.0~8.3%만 늘고 p95만 커졌습니다.',
        },
        plan: '동시에 실행하는 가상 사용자를 늘릴 때 처리량과 지연이 어떻게 변하는지 확인하려 했습니다.',
        build:
          '9개 전략을 VU 10, 50, 100, 200에서 실행했습니다. 36개 조건, 조건마다 3만 건으로 총 108만 건의 요청 시도를 기록했습니다.',
        outcome:
          'WATCH를 뺀 8개 전략은 VU 50에서 200으로 늘려도 처리량이 1.0~8.3%만 늘고 p95만 커졌습니다. Lua의 p95는 VU 10에서 24.32ms, VU 200에서 370.55ms였습니다.',
        limit:
          'k6, 애플리케이션, MySQL, Redis가 같은 PC에 있었고 조건별 1회 측정입니다. 108만은 성공 건수가 아니라 요청 시도 수입니다.',
      },
    ],
    limitations:
      '로컬 단일 호스트의 1차 실험입니다. 조건별 1회와 역순 재실행 결과로 성능 순위를 확정하지 않았습니다. JVM_LOCK의 통과도 단일 인스턴스 조건에 한정됩니다.',
    proofs: [
      {
        label: '중복 회원 실험 보고서',
        href: 'https://github.com/Catverdose/concurrency-strategies/blob/main/docs/02-duplicate-user.md',
        detail: '정순 실험의 응답 분포·재고 원장·발급 대상 검증',
      },
    ],
    relatedProjectIds: ['petcoupon'],
  },
  {
    id: 'vector-db-benchmark',
    number: '05',
    title: 'Vector DB Benchmark',
    kind: 'EXPERIMENT',
    tier: 'experiment',
    typeLabel: 'UBot · 단독 수행',
    period: '2026.09 ~ 2026.10',
    question: '검색 품질이 달라도, 속도를 비교할 수 있을까?',
    description: '같은 검색 품질에서 비교하고, 운영 복잡도까지 따져 고르기',
    role: 'Benchmark harness 설계 · 구현 · 측정 · 분석',
    technologies: ['pgvector', 'Qdrant', 'Milvus', 'Weaviate', 'OpenSearch'],
    highlights: [
      '5개 DB · 14개 구성 · 620회 측정',
      'Recall을 먼저 확인하고 지연·처리량 비교',
    ],
    github: ubotVectorDb,
    overview:
      'RAG 서비스의 Vector DB 후보 5종을 비교한 harness입니다. 합성 1만 청크, 동시성 10, DB별 4 vCPU·8 GiB 조건에서 검색 설정 124개를 5회씩, 총 620회 측정했습니다. 성능은 Qdrant가 가장 좋았지만 팀은 이미 쓰는 PostgreSQL의 pgvector를 선택했습니다.',
    features: [
      {
        title: '비교 전에 입력과 정답부터 고정',
        brief: {
          plan: '제품마다 부속 서비스와 응답 크기가 달라, 이름만 바꿔 재면 공정하지 않았습니다.',
          build: [
            '입력은 SHA-256으로 검증, 정답은 exact cosine search',
            '모든 DB에 같은 자원(4 vCPU, 8 GiB)',
            '바꾸는 것은 DB와 검색 설정뿐',
          ],
          outcome: 'Recall@10, 지연, QPS, CPU, RAM을 함께 수집했습니다.',
        },
        plan: '제품마다 부속 서비스와 응답 크기가 달라, 이름만 바꿔 재면 공정하지 않았습니다. 변인 통제부터 정하고, 바꿔서 측정할 것(DB와 검색 설정)만 남기기로 했습니다.',
        build:
          '입력은 SHA-256으로 검증하고 Java exact cosine search를 Ground Truth로 사용했습니다. Calibration query와 evaluation query를 분리했습니다. 자원은 각 DB의 최고 성능을 재려는 것이 아니라 같은 조건에 두려는 것이라, 모든 DB가 돌 수 있는 공통 최저선(4 vCPU, 8 GiB)을 하나 정해 똑같이 맞췄습니다.',
        outcome:
          'Recall@10, latency, QPS, CPU, RAM, index readiness를 함께 수집했습니다. 각 측정점에서 자원 샘플을 30개 이상 기록했습니다.',
        limit:
          '같은 검색 품질 구간에서 지연과 처리량을 비교합니다. 합성 데이터에서 빠른 구성을 실제 서비스의 최종 선택으로 확정하지 않았습니다.',
        evidence: [
          {
            label: '공정 비교 조건과 산포도',
            href: `${ubotVectorDb}/blob/main/docs/07-results/fairness-v2-results-20260913.md`,
            detail: '124개 검색 설정 × 독립 재구축 5회',
          },
        ],
      },
      {
        title: '가장 빠른 Qdrant 대신 pgvector를 고른 이유',
        brief: {
          plan: '가장 빠른 DB는 Qdrant였지만, 벡터 DB를 따로 두면 운영할 저장소가 하나 늘어납니다.',
          build: [
            '측정한 1만 청크에서 pgvector의 p95가 수십 ms 안인 것을 확인',
            '팀은 이미 쓰는 PostgreSQL의 pgvector를 선택',
          ],
          outcome: 'Recall 0.99 이상에서 p95는 Qdrant 4.1ms, pgvector 32.2ms. UBot은 지금도 pgvector를 씁니다.',
        },
        plan: '같은 Recall에서 가장 빠른 DB는 Qdrant였습니다. 하지만 서비스는 이미 PostgreSQL을 쓰고 있어, 벡터 DB를 따로 두면 운영하고 데이터를 맞춰야 할 저장소가 하나 늘어납니다.',
        build:
          '측정한 1만 청크에서 pgvector의 p95가 Recall 0.99 이상에서도 32ms 정도로 수십 ms 안에 머무는 것을 확인했습니다. p50 차이는 2ms 이내였습니다. 팀은 이 차이보다 저장소를 하나 더 운영하는 부담이 크다고 보고, 기존 PostgreSQL의 pgvector를 선택했습니다.',
        outcome:
          'Recall 0.99 이상에서 Qdrant HNSW는 p95 4.1ms · 3,402 QPS, pgvector HNSW는 32.2ms · 1,601 QPS였습니다. Recall 0.95 이상에서는 3.9ms 대 7.3ms였습니다. 합성 1만 청크 · 동시성 10에서 5회 재구축한 중앙값입니다. UBot은 지금도 pgvector를 쓰고 있고, 이후 매장 검색용 PostGIS도 같은 PostgreSQL에 확장으로 붙었습니다.',
        limit:
          '같은 Recall에서 검색 지연은 Qdrant보다 2~8배 깁니다. 데이터가 커지거나 검색 지연이 응답 시간의 병목이 되면 다시 비교합니다.',
        evidence: [
          {
            label: 'pgvector 선정 결론',
            href: `${ubotVectorDb}/blob/main/docs/07-results/decision.md`,
            detail: '같은 Recall에서의 차이와 남은 확인 항목',
          },
          {
            label: '124개 설정 수치 부록',
            href: `${ubotVectorDb}/blob/main/docs/07-results/assets/fairness-v2-20260912-1826/parameter-statistics.md`,
            detail: 'DB·인덱스·검색 설정별 Recall · p95 · QPS',
          },
        ],
      },
      {
        title: '고른 뒤에: 서비스 검색을 exact에서 HNSW로',
        brief: {
          plan: '벤치마크로 pgvector를 고른 뒤에도, 서비스의 FAQ 검색은 결과 누락 문제로 exact 검색에 머물러 있었습니다.',
          build: [
            'pgvector iterative scan(strict_order, ef_search=200)을 검색 트랜잭션에만 적용',
            'FAQ별 중복 제거 뒤 topK가 모자라면 후보 범위를 두 배씩 확대',
            '설정을 켤 때만 도는 벤치마크 테스트 추가',
          ],
          outcome: '합성 1만 건에서 p50 4.6~6.2배 개선, 상위 3개 결과는 exact와 같았습니다(#251).',
        },
        plan: '벤치마크로 pgvector를 고른 뒤에도 UBot의 FAQ 검색은 exact 검색이었습니다. HNSW에서 필터에 걸린 후보 때문에 결과가 모자라는 문제가 있어 exact로 바꿔 둔 상태였습니다(#182). 필터와 중복 제거를 거쳐도 결과가 모자라지 않게 하면서 HNSW로 되돌리기로 했습니다.',
        build:
          'pgvector의 iterative scan(strict_order, ef_search=200)을 검색 트랜잭션에만 적용해, 필터에 걸러진 만큼 후보를 더 탐색하게 했습니다. FAQ별로 중복을 제거한 뒤 topK가 모자라면 후보 범위를 두 배씩 넓힙니다. 성능 측정용 벤치마크 테스트는 설정을 켤 때만 돌게 했습니다.',
        outcome:
          '#251이 병합됐습니다. 합성 1만 건에서 p50이 4.6~6.2배 빨라졌고, 상위 3개 결과는 exact 검색과 같았습니다. FAQ 저장소, FAQ 서비스, 상담 테스트 133건이 통과했습니다(PR 기록).',
        limit:
          '실제 FAQ 임베딩 기준의 재측정은 하지 않았습니다. 상담 금지 문장 검색은 exact를 유지합니다.',
        evidence: [
          {
            label: 'FAQ 벡터 검색을 HNSW로 전환 (UBot #251)',
            href: `${ubotBe}/pull/251`,
            detail: 'iterative scan · 후보 범위 확대 · exact와 상위 3개 비교',
          },
        ],
      },
      {
        title: '불리한 측정도 결과에서 지우지 않기',
        brief: {
          plan: '이상치와 warm-up 미달을 지우면 실제 변동성이 가려집니다.',
          build: [
            '원시 JSON·CSV와 워밍업 경고 170건 보존',
            '합의되지 않은 자동 탈락 기준은 적용하지 않음',
          ],
          outcome: 'Milvus DISKANN의 Recall 변동은 경고와 함께 결과에 남겼습니다.',
        },
        plan: '이상치와 warm-up 미달을 제거하면 실제 변동성이 가려지고 특정 구성이 과대평가될 수 있습니다.',
        build:
          '원시 JSON·CSV와 워밍업 경고 170건을 보존했습니다. 보고서의 후보 해석에서는 합의되지 않은 Recall·p95·RAM 자동 탈락 기준을 적용하지 않았으며, 원시 판정과 코드 기본값은 보존했습니다.',
        outcome:
          'Milvus DISKANN은 5회 관찰에서 Recall 변동이 있었고, 원인을 확인하기 전까지 경고와 함께 결과에 남겼습니다. 검색 실패·응답 계약 위반·자원 수집 누락은 0건이었습니다.',
        evidence: [
          {
            label: '변동성·warning·해석 제한',
            href: `${ubotVectorDb}/blob/main/docs/07-results/fairness-v2-results-20260913.md`,
          },
        ],
      },
    ],
    limitations:
      '합성 1만 청크 · Top-10 · 동시성 10 조건의 결과입니다. 실제 서비스 데이터와 1천 청크 규모는 측정하지 않았고, 실데이터에서 pgvector의 검색 품질을 확인하는 것이 다음 단계입니다. 벤치마크의 pgvector 조건(Top-10, ef_construction 128, 인덱스 사용 강제)은 UBot의 실제 설정(Top-3, 기본 파라미터)과 다릅니다.',
    proofs: [
      {
        label: '620회 측정 보고서',
        href: `${ubotVectorDb}/blob/main/docs/07-results/fairness-v2-results-20260913.md`,
        detail: '검색 품질·지연·처리량과 반복 측정의 변동성',
      },
    ],
    relatedProjectIds: ['ubot', 'llm-serving'],
  },
  {
    id: 'llm-serving',
    number: '06',
    title: 'LLM Serving Benchmark',
    kind: 'EXPERIMENT',
    tier: 'experiment',
    typeLabel: 'UBot · 팀 내 실험',
    period: '2026.10',
    question: '어떤 엔진이면 초당 8건을 넘길까?',
    description: '서빙 엔진 4종을 GPU 세 환경에서, 앞 측정의 흔적 없이 비교하기',
    role: '실험 환경 선정 · 엔진 4종 선택 · 측정 순서 설계 · 분석',
    technologies: ['vLLM', 'SGLang', 'Ollama', 'llama.cpp', 'AWS T4 · L4'],
    highlights: [
      '엔진 4종 × 로컬·T4·L4, 기준선은 초당 8건 완료',
      '엔진을 바꿀 때마다 GPU 메모리가 비었는지 확인',
      '임베딩 서빙은 Ollama와 vLLM을 2,560건으로 따로 비교',
    ],
    github: 'https://github.com/ureca-UBot/UBot-LLMTest',
    overview:
      'UBot의 LLM을 어떤 엔진과 GPU로 띄울지 정하려는 실험입니다. 엔진 4종(Ollama, llama.cpp, vLLM, SGLang)을 로컬 RTX 3060, AWS T4, L4에서 비교했고 기준선은 HTTP 완료 초당 8건입니다. 같은 조건으로 다른 모델 4종과 임베딩 모델(BGE-M3)의 서빙 엔진도 따로 비교했습니다. 모든 결과는 반복 검증 전의 탐색 결과입니다.',
    features: [
      {
        title: '기준선부터: 왜 초당 8건인가',
        brief: {
          plan: '목표 없이 재면 숫자를 해석할 수 없어 기준선부터 잡았습니다.',
          build: [
            '통신사 보도자료의 월 처리량을 역산: 고르게 나누면 분당 20~30명',
            '몰리는 시간대를 감안해 피크를 분당 150명(초당 약 2.5건)으로 추정',
            '실험이 실제보다 쉬운 조건이라 여유를 두어 초당 8건 완료로 설정',
          ],
          outcome: '이 기준선으로 환경별 결과를 통과와 미달로 나눠 읽었습니다.',
        },
        plan: '목표 없이 재면 숫자를 해석할 수 없어 기준선부터 잡았습니다. 2024년 통신사 보도자료의 월 처리량(월 50만 건 이상, 월 152만 세션)을 역산하니, 24시간에 고르게 나누면 분당 20~30명이었습니다. 실제로는 문의가 특정 시간대에 몰린다고 보고 피크를 분당 150명 정도로 잡았습니다.',
        build:
          '분당 150명은 초당 약 2.5건입니다. 실험은 출력 토큰 제한이 있고 답변도 어렵지 않아 실제보다 쉬운 조건이라, 여유를 크게 두어 초당 8건 완료를 기준선으로 정했습니다.',
        outcome: '이 기준선으로 환경별 결과를 통과와 미달로 나눠 읽었습니다.',
        limit:
          '정밀한 수요 예측이 아니라 공개 수치를 단순 계산한 값입니다.',
      },
      {
        title: '앞 엔진의 흔적이 다음 측정에 섞이지 않도록',
        brief: {
          plan: '엔진을 내려도 GPU 메모리가 한동안 남아, 그대로 다음 엔진을 재면 결과가 섞입니다.',
          build: [
            '설정이 끝날 때마다 컨테이너를 지우고 GPU 메모리 0 MiB를 연속 3회 확인',
            '외부 동시 요청 수와 엔진 내부 상한을 구분해 기록',
            '질문 6개 유형 비율을 유지한 300개 질문으로도 측정',
          ],
          outcome: 'L4에서 vLLM 9.13, SGLang 8.17로 기준선 초과를 관측. T4는 1.97, 1.93이었습니다.',
        },
        plan: 'GPU 하나에서 여러 엔진을 동시에 띄울 수 없어 하나씩 켜고 끄며 재야 했습니다. Ollama에서 엔진을 내려도 GPU 메모리가 한동안 남아 있는 것을 직접 봤고, 그대로 다음 테스트를 시작하면 결과에 영향을 줄 것이라고 판단했습니다.',
        build:
          '설정이 끝날 때마다 컨테이너를 지우고, 같은 GPU에서 메모리 0 MiB와 실행 중인 프로세스 없음을 연속 3회 확인한 뒤 다음 설정을 시작하게 했습니다. 외부 동시 요청 수와 엔진 내부 처리 상한을 구분해 기록했고, 실패한 요청도 빼지 않고 남겼습니다. 같은 질문만 보내면 처리량이 왜곡된다고 보고, 기존 질문셋의 6개 유형 비율을 유지한 채 유형당 50개(총 300개)로 줄인 질문으로도 측정했습니다.',
        outcome:
          'L4에서 vLLM 9.13, SGLang 8.17로 기준선을 넘는 것을 관측했고, 다양화한 질문에서도 9.03과 8.77이었습니다. T4에서는 1.97과 1.93, Ollama와 llama.cpp는 L4에서도 2.67 이하였습니다.',
        limit:
          'T4와 L4는 GPU 말고 CPU와 RAM도 달라 GPU만의 비교가 아닙니다. 지연, 실패율, 답변 품질의 합격 기준은 적용하지 않았습니다. llama.cpp는 재사용 소켓 실패(socket hang up)가 섞여 있어 그 값을 계산 성능의 한계로 보지 않습니다. 질문셋은 팀원이 만든 것을 줄여 썼습니다.',
        evidence: [
          {
            label: '실험 전체 결론',
            href: 'https://github.com/ureca-UBot/UBot-LLMTest/blob/main/servingtest/docs/CONCLUSIONS.md',
            detail: '환경별 결과 · 상한 확대 · 질문 다양화 · 메모리 정리 기준',
          },
          {
            label: '서빙 엔진 비교 실험 (LLMTest #6)',
            href: 'https://github.com/ureca-UBot/UBot-LLMTest/pull/6',
            detail: '엔진 4종 · 로컬, T4, L4 · 측정 스크립트와 결론 문서',
          },
        ],
      },
      {
        title: '상한을 키운다고 처리량이 늘지는 않았다',
        brief: {
          plan: 'L4에서 엔진 내부 상한을 넓히면 처리량이 더 오르는지 확인하려 했습니다.',
          build: [
            '내부 상한을 넓힌 설정 10개를 추가 측정',
          ],
          outcome: '상한 64에서 9.97, 8.77로 올랐지만 128에서는 8.23, 8.43으로 낮아졌습니다.',
        },
        plan: 'L4에서 엔진 내부 처리 상한을 넓히면 처리량이 더 오르는지 확인하려 했습니다.',
        build: '내부 상한을 넓힌 설정 10개를 추가로 측정했습니다.',
        outcome:
          '상한 64에서 vLLM 9.97, SGLang 8.77로 올랐지만 128에서는 8.23과 8.43으로 오히려 낮아졌습니다.',
        limit: '설정별 탐색 측정이며 반복 검증 전입니다.',
      },
      {
        title: '빠르다고 고르지 않았다: 모델 4종 추가 측정',
        brief: {
          plan: 'Qwen3-4B로 기준선을 넘었지만, 더 크거나 다른 계열의 모델로도 넘는지 알아야 했습니다.',
          build: [
            'Qwen3-8B·14B, EXAONE 3.5 7.8B, Gemma3 4B를 같은 부하 조건으로 L4와 로컬에서 측정',
            '받은 가중치는 Hugging Face에 등록된 SHA-256과 대조',
            '처리량과 함께 출력 길이를 보고, 튀는 결과는 비양자화 모델과 대조',
          ],
          outcome: '공식 가중치로 기준선을 넘은 것은 Qwen3-4B뿐. 20.57이 나온 Gemma3 변환본은 답이 짧고 상태값이 62%만 일치해 뺐습니다.',
        },
        plan: 'Qwen3-4B로 기준선을 넘었지만, 더 큰 모델이나 다른 계열에서도 넘는지 알아야 모델을 고를 수 있었습니다.',
        build:
          'Qwen3-8B, Qwen3-14B, EXAONE 3.5 7.8B, Gemma3 4B를 Qwen3-4B와 같은 부하 조건(300문항, context 4096, 출력 상한 512, 30초 창)으로 L4와 로컬 RTX 3060에서 쟀습니다. 받은 가중치는 Hugging Face에 등록된 SHA-256과 대조했고, 엔진을 바꿀 때마다 GPU 메모리 0 MiB를 연속 3회 확인했습니다. 처리량만 보지 않고 평균 출력 길이와 응답 형식도 함께 봤고, 유독 빠른 결과는 같은 문항에서 비양자화 모델과 응답 상태값을 대조했습니다.',
        outcome:
          'L4에서 공식 가중치로 기준선을 넘은 것은 Qwen3-4B뿐이었습니다. Qwen3-8B와 EXAONE 3.5 7.8B는 내부 상한을 32에서 64로 올려도 6.5건 근처에서 멈추고 지연만 길어졌고(Qwen3-8B p95 8.6초 → 14.5초), Qwen3-14B는 3.33건이었습니다. Gemma3 4B 커뮤니티 AWQ 변환본은 vLLM에서 20.57건으로 가장 빨랐지만, 평균 출력이 61토큰으로 짧고 비양자화 모델과 응답 상태값이 62%만 일치했으며 되물어야 할 질문을 단정하는 경향이 있어 후보에서 뺐습니다.',
        limit:
          '30초 창 한 번의 탐색이고 의미 정답률은 확인하지 않았습니다. 모델마다 크기, 가중치 형식, 출력 길이가 달라 같은 조건의 우열 비교가 아닙니다. Qwen3-4B 값은 다른 날의 GPU 세션에서 잰 것입니다.',
        evidence: [
          {
            label: 'L4 모델 확장 결과와 한계',
            href: 'https://github.com/ureca-UBot/UBot-LLMTest/blob/main/servingtest/l4/reports/L4_MULTIMODEL_RESULTS_20261006.md',
            detail: '모델 4종 · 설정별 최고 RPS · 가중치 대조',
          },
          {
            label: '모델 확장 측정 (LLMTest #8)',
            href: 'https://github.com/ureca-UBot/UBot-LLMTest/pull/8',
          },
        ],
      },
      {
        title: '임베딩 서버도 따로 재 보기',
        brief: {
          plan: '질문마다 임베딩을 먼저 만들기 때문에, 답변 모델과 별개로 임베딩 서버의 엔진도 정해야 했습니다.',
          build: [
            'BGE-M3를 Ollama와 vLLM으로 띄워 질문 묶음 4종 × 동시성 5단계 × 64건',
            '처리량, p50·p95·p99, 실패와 함께 Top-1 일치와 최소 cosine 기록',
            'Ollama·TEI·vLLM 탐색에서는 기준 벡터와 일치하는지 먼저 확인',
          ],
          outcome: '2,560건 실패 0건. 동시성 32에서 vLLM 처리량이 Ollama의 2.98~3.73배였습니다.',
        },
        plan: '질문이 들어오면 FAQ 검색을 위해 임베딩부터 만듭니다. 답변 모델과 별개로 임베딩 서버를 어떤 엔진으로 띄울지 정해야 했고, 엔진이 달라도 같은 벡터를 내는지 확인해야 했습니다.',
        build:
          'BGE-M3를 Ollama와 vLLM으로 띄우고, 서로 다른 질문 묶음 4종을 동시성 1, 4, 8, 16, 32에서 구간마다 64건씩 보냈습니다(40개 구간, 2,560건). 처리량과 p50·p95·p99 지연, 성공과 실패를 기록하고, 결과 벡터가 맞는지 Top-1 일치와 최소 cosine도 함께 남겼습니다. 별도 탐색에서는 Ollama, TEI, vLLM을 동시성 5단계와 요청당 문장 수 3가지로 나눠 15개 구간씩 실행하고, 기준 벡터와 일치하는지부터 확인했습니다.',
        outcome:
          '2,560건 모두 성공했습니다. 동시성 32의 처리량은 질문 묶음에 따라 Ollama 33.20~60.76 RPS, vLLM 116.42~226.68 RPS로 vLLM이 2.98~3.73배였습니다. 탐색에서는 Ollama가 기준 벡터 일치 조건을 통과하지 못했고 TEI와 vLLM은 통과했습니다. UBot은 AI_MODE=vllm으로 vLLM 임베딩 서버를 쓸 수 있게 했고, FAQ 1,024건 백필은 로컬에서 Ollama 약 80초, vLLM 약 24초였습니다.',
        limit:
          'Ollama와 vLLM의 모델 형식과 정밀도가 같지 않아 이 배율을 엔진 하나만의 효과로 보지 않습니다. 짧은 HTTP 임베딩 부하 진단이고 구간별 1회 측정이라, RAG 전체 응답 시간이나 장시간 처리량은 재지 않았습니다. 당시 실행기는 비공개 입력과 묶여 있어 측정 JSON만 보존했습니다.',
        evidence: [
          {
            label: '임베딩 서빙 엔진 비교 (UBot-EmbeddingTest)',
            href: 'https://github.com/ureca-UBot/UBot-EmbeddingTest/blob/main/serving-benchmark/README.md',
            detail: 'Ollama · vLLM 2,560건 · Ollama · TEI · vLLM 탐색',
          },
          {
            label: '원본 측정값 (JSON)',
            href: 'https://github.com/ureca-UBot/UBot-EmbeddingTest/blob/main/serving-benchmark/results/ollama-vllm-load-metrics.json',
          },
        ],
      },
    ],
    limitations:
      '모든 결과는 탐색 결과이며 반복 검증 전입니다. "초당 8건을 감당한다"가 아니라 "초당 8건 완료를 관측했다"는 뜻입니다. 환경별 최고값은 외부 동시 요청 수가 달라 같은 부하점의 비교가 아닙니다.',
    proofs: [
      {
        label: '실험 전체 결론',
        href: 'https://github.com/ureca-UBot/UBot-LLMTest/blob/main/servingtest/docs/CONCLUSIONS.md',
        detail: '엔진 4종 · 세 환경 · 모델 확장까지의 결론과 한계',
      },
      {
        label: '서빙 엔진 비교 실험 PR',
        href: 'https://github.com/ureca-UBot/UBot-LLMTest/pull/6',
        detail: '측정 스크립트와 원시 결과',
      },
      {
        label: '임베딩 서빙 엔진 비교',
        href: 'https://github.com/ureca-UBot/UBot-EmbeddingTest/blob/main/serving-benchmark/README.md',
        detail: 'BGE-M3 · Ollama와 vLLM · 2,560건',
      },
      {
        label: 'GPU 테스트 서버 Terraform 구성',
        href: `${ubotBe}/pull/133`,
        detail: '팀원이 같은 L4 환경을 다시 만들 수 있도록 코드로 구성',
      },
    ],
    relatedProjectIds: ['ubot', 'vector-db-benchmark'],
  },
  {
    id: 'planly',
    number: '07',
    title: 'Planly',
    kind: 'PERSONAL',
    tier: 'supporting',
    typeLabel: '3인 팀 + 개인 React 이전',
    period: '2026.07 ~ 2026.08',
    question: '내 Todo에 다른 사람이 접근한다면?',
    description: 'Todo와 공유 캘린더를 연결하고, 화면을 React로 옮긴 일정 관리 서비스',
    role: '팀: Todo 도메인과 소유권 검증 · 개인: React 이전',
    technologies: ['Spring Boot', 'JPA', 'MySQL', 'React'],
    highlights: [
      'Todo–Schedule 연결과 삭제 규칙, 소유권 검증 (팀)',
      '정적 화면을 React와 Vite로 이전 (개인)',
    ],
    github: 'https://github.com/Catverdose/planly-web',
    overview:
      '3인 팀 미니 프로젝트에서 Todo 영역을 맡았고, 이후 개인 저장소에서 정적 HTML 화면을 React와 Vite로 옮겼습니다. 인증(JWT)과 공유 캘린더는 팀원이 담당했습니다.',
    features: [
      {
        title: '팀: Todo와 일정의 연결, 그리고 지우는 규칙',
        brief: {
          plan: '로그인 여부만으로는 다른 사용자의 Todo 접근을 막을 수 없었습니다.',
          build: [
            'Todo, 목록, 하위 할 일, 검색과 페이지 조회',
            '모든 조회에 사용자 조건 적용',
            'Todo를 지우면 연결된 일정 정리, 일정을 지우면 Todo 유지',
          ],
          outcome: '팀 저장소 #19 #36 병합, #26에서 통합 테스트 11개 작성.',
        },
        plan: 'Todo와 공유 캘린더의 일정을 연결해야 했습니다. 로그인 여부만으로는 다른 사용자의 Todo 접근을 막을 수 없어, 조회 조건에 사용자를 넣고 연결과 삭제 규칙을 정해야 했습니다.',
        build:
          'Todo, 목록, 하위 할 일, 완료율, 검색과 페이지 조회를 만들고 사용자 조건으로 조회합니다. Todo를 지우면 연결된 일정을 정리하고, 일정을 지우면 Todo는 남깁니다. 다른 사용자 접근 거부 등을 통합 테스트로 작성했습니다.',
        outcome:
          '팀 저장소 PR #19, #36이 병합됐고 #26에서 테스트 11개를 작성했습니다.',
        limit:
          '현재 팀 저장소의 코드에는 DTO와 테스트가 어긋난 부분이 있어, 지금 실행해 통과한다고 말할 수는 없습니다.',
        evidence: [
          {
            label: 'Todo 도메인 (팀 저장소 #19)',
            href: 'https://github.com/bumjpark/MiniProject2_3/pull/19',
          },
          {
            label: '하위 Todo와 Todo–Schedule 연결 (팀 저장소 #36)',
            href: 'https://github.com/bumjpark/MiniProject2_3/pull/36',
          },
          {
            label: 'Todo–Schedule 연동 구현',
            href: 'https://github.com/Catverdose/planly-web/blob/main/backend/src/main/java/com/example/demo/todo/service/TodoScheduleLinkService.java',
            detail: '사용자 범위 조회와 트랜잭션, 중복 연결 충돌 처리',
          },
        ],
      },
      {
        title: '개인: 정적 화면을 React로 옮기기',
        brief: {
          plan: '정적 HTML과 JavaScript 화면을 개인 저장소에서 React로 옮기기로 했습니다.',
          build: [
            'React와 Vite, Context API 인증과 보호 라우트',
            '동시 401에도 토큰 재발급은 한 번만',
            '필터 변경과 마지막 항목 삭제 시 페이지 보정',
          ],
          outcome: '개인 저장소 #2 병합.',
        },
        plan: '팀 프로젝트의 화면은 정적 HTML과 JavaScript였습니다. 개인 저장소에서 backend와 frontend를 나누고 React로 옮기기로 했습니다.',
        build:
          'React와 Vite로 이전하고 Context API 인증과 보호 라우트를 구성했습니다. 여러 요청이 동시에 401을 받아도 토큰 재발급은 한 번만 하도록 요청을 공유하는 구조는 팀 단계의 화면에서 만든 것을 옮겼습니다. 필터를 바꾸거나 마지막 항목을 지웠을 때는 페이지를 보정합니다.',
        outcome: '개인 저장소 PR #2가 병합됐습니다.',
        limit:
          '이전 과정에서 팀 단계의 통합 테스트가 빠졌습니다. 일정 연동과 권한 경계의 회귀 테스트를 다시 붙이는 것이 남은 과제입니다.',
        evidence: [
          {
            label: 'React 이식 (planly-web #2)',
            href: 'https://github.com/Catverdose/planly-web/pull/2',
          },
        ],
      },
    ],
    limitations:
      '팀 단계의 Todo 도메인과 개인 단계의 React 이전을 구분해 적었습니다. 인증 시스템과 캘린더 전체는 제 구현이 아닙니다.',
    proofs: [
      {
        label: '팀 저장소의 Todo 통합 테스트 (#26)',
        href: 'https://github.com/bumjpark/MiniProject2_3/pull/26',
        detail: '다른 사용자 접근 거부 등 11개 작성',
      },
    ],
    relatedProjectIds: ['petcoupon'],
  },
]

/** 첫 화면의 숫자 카드. 개인 작업과 본인 PR만 씁니다. 팀 결과는 프로젝트 카드에 둡니다. */
export const heroProofs = [
  {
    projectId: 'ubot',
    value: '6,000',
    unit: '건 AWS 시험',
    label: '시스템 오류 4건 · DB 대조 불일치 0',
  },
  {
    projectId: 'ubot',
    value: '4',
    unit: '종 장애 주입',
    label: '로컬 각 100건 · 유실·중복 저장 0건',
  },
  {
    projectId: 'concurrency',
    value: '9',
    unit: '개 전략',
    label: '같은 조건에서 비교한 동시성 제어',
  },
  {
    projectId: 'vector-db-benchmark',
    value: '620',
    unit: '회 측정',
    label: 'Vector DB 5종, 같은 입력과 자원',
  },
]

export const focusAreas: {
  title: string
  description: string
  icon: 'database' | 'activity' | 'shield' | 'layers'
  projectIds: string[]
}[] = [
  {
    title: 'Data Consistency',
    description: '트랜잭션 경계 · DB 제약 · 동시성 제어',
    icon: 'database',
    projectIds: ['petcoupon', 'concurrency', 'engineering-memory'],
  },
  {
    title: 'Failure Handling',
    description: '비동기 처리 · 장애 복구 · SSE',
    icon: 'activity',
    projectIds: ['ubot', 'petcoupon', 'engineering-memory'],
  },
  {
    title: 'Verification',
    description: '재현 가능한 테스트 · 측정 · 벤치마크',
    icon: 'shield',
    projectIds: ['concurrency', 'vector-db-benchmark', 'llm-serving'],
  },
  {
    title: 'Backend Infrastructure',
    description: 'AWS · Terraform · CI/CD · 모니터링',
    icon: 'layers',
    projectIds: ['ubot', 'engineering-memory'],
  },
]

/** 문제 해결 사례. 증상 → 원인 → 해결 → 확인 순서입니다. */
export const troubleshooting: {
  projectId: string
  label: string
  title: string
  /** 첫 화면에 쓰는 한 줄 */
  summary: string
  symptom: string
  cause: string
  fix: string
  check: string
  /** 대표 사례. 첫 화면과 상세 페이지에서 카드로 보이고, 나머지는 접힌 목록에 둡니다. */
  featured?: boolean
  evidence?: EvidenceLink[]
}[] = [
  {
    projectId: 'ubot',
    label: 'LOAD TEST · AWS',
    title: '6,000건을 보내자 1,235건이 시스템 오류였다',
    summary: '대기 한도, 모델 컨텍스트, Nginx 연결 수를 차례로 고쳐 오류를 4건으로 줄였습니다.',
    symptom:
      '실서비스 주소로 질문 6,000건을 보내자 시스템 오류가 1,235건 나왔습니다. 고친 뒤 다시 보낸 3,000건에서는 502가 2,499건이었습니다.',
    cause:
      '대기·실행 한도 초과(CHAT-016)와 모델 컨텍스트 초과(LLM-003)가 대부분이었습니다. 출력 검사가 입력 3,073토큰 이상에 출력 1,024토큰을 예약해 한도 4,096을 넘었고, 재시험에서는 Nginx 연결 한도 512가 고갈됐습니다.',
    fix: '대기·실행 한도를 1시간·10분으로, 모델 컨텍스트와 Nginx 연결 수를 각각 8,192로 올렸습니다. 기존 AMI로 뜨는 Spot GPU도 같은 값으로 기동하게 Terraform을 고쳤습니다.',
    check:
      '3,000건씩 두 번 다시 보내 답변 5,666건, 정상 거절 330건, 시스템 오류 4건. 작업 ID 6,000개를 DB와 대조해 불일치 0건이었습니다.',
    featured: true,
    evidence: [
      {
        label: '재시험 기록',
        href: `${ubotServerTest}/blob/main/chat-e2e/results/20261026-aws/README.md`,
      },
      { label: 'PR #318', href: `${ubotBe}/pull/318` },
    ],
  },
  {
    projectId: 'petcoupon',
    label: 'SSE MONITORING',
    title: '로그 하나가 스스로 불어났다',
    summary: '큐가 차면 낸 오류를 모니터링이 다시 수집하던 순환을 끊었습니다.',
    symptom:
      '테스트 로그를 하나 보냈는데 같은 로그만 계속 오고 화면이 크게 느려졌습니다.',
    cause:
      '연결이 끊긴 뒤 큐가 차면 오류를 냈고, 그 오류 로그를 모니터링이 다시 수집했습니다.',
    fix: '큐를 1,000개에서 50개로 줄이고, 가득 차면 오래된 로그를 버리고 개수만 알리게 했습니다. 자기 로그 재수집을 막고 큐 앞에 게이트를 두었습니다.',
    check:
      '로컬에서 연결을 62번 강제로 끊어도 같은 예외 0건, 남은 구독 0개 (PR 기록).',
    featured: true,
    evidence: [{ label: 'PR #192', href: `${petcoupon}/pull/192` }],
  },
  {
    projectId: 'concurrency',
    label: 'LOAD TEST',
    title: '빠른 응답의 정체는 무응답이었다',
    summary: '12만 건 중 107,225건이 무응답이었고, VU 네 단계 모두에서 재현했습니다.',
    symptom:
      'WATCH 전략의 지연이 유독 낮았는데, 12만 건 중 107,225건이 응답을 받지 못한 결과였습니다.',
    cause:
      'TIME_WAIT가 약 14,900개까지 늘어 Address already in use가 났습니다. 재시도 과정의 연결 생성과 종료가 원인으로 유력합니다.',
    fix: 'WATCH만 단독으로 다시 돌리고 Redis 포트를 바꿔 이전 실행의 영향을 배제했습니다. 성능 비교에서는 이 전략을 제외했습니다.',
    check:
      'VU 10, 50, 100, 200 모두에서 재현했습니다. 연결 재사용을 고친 뒤의 재측정은 남은 과제입니다.',
    featured: true,
    evidence: [
      {
        label: '재현 기록',
        href: 'https://github.com/Catverdose/concurrency-strategies/blob/main/docs/03-vu-scaling.md',
      },
    ],
  },
  {
    projectId: 'ubot',
    label: 'WORKER RECOVERY',
    title: '배포가 실패하자 답할 Worker가 사라졌다',
    summary: '배포와 독립된 타이머가 같은 이미지로 Worker를 되살리게 했습니다.',
    symptom:
      'CD가 Worker를 멈춘 뒤 실패하면, API는 질문을 계속 접수하는데 답변을 만들 Worker가 남지 않았습니다.',
    cause:
      'Worker를 다시 띄우는 일을 배포 스크립트에만 맡기고 있어, 스크립트가 중간에 끊기면 되돌릴 주체가 없었습니다.',
    fix: 'SSM·Worker와 독립된 systemd 타이머가 30초마다 확인하고, API가 정상이면 같은 이미지 digest로 Worker를 복구합니다. 배포 중·점검 중·API 비정상일 때는 복구를 보류하고, 배포 스크립트에 시간 제한을 걸었습니다.',
    check:
      '로컬 Linux에서 배포 스크립트를 Worker 정지 직후 SIGKILL해 복구를 확인했습니다. AWS에는 타이머를 설치해 신규 질문 성공까지 확인했고, 강제 종료 시험은 AWS에서 하지 않았습니다.',
    evidence: [{ label: 'PR #318', href: `${ubotBe}/pull/318` }],
  },
  {
    projectId: 'ubot',
    label: 'VECTOR SEARCH',
    title: 'HNSW로 찾으면 맞는 FAQ가 빠졌다',
    summary: 'exact 검색으로 물러났다가, iterative scan으로 HNSW에 돌아왔습니다.',
    symptom:
      'FAQ 검색에 HNSW 인덱스를 쓰자 조건에 맞는 FAQ가 결과에서 빠지는 일이 있어, 한동안 전체 비교(exact)로 바꿨습니다.',
    cause:
      '인덱스가 후보 40개(ef_search 기본값)를 먼저 고른 뒤 임베딩 프로필·벡터 유형 조건을 적용해, 조건에 맞는 벡터가 후보 밖에 있으면 놓쳤습니다.',
    fix: 'pgvector 0.8의 iterative scan(strict_order, ef_search 200)을 검색 트랜잭션에만 켜고, FAQ별 중복을 지운 뒤 topK가 모자라면 후보를 두 배씩 늘렸습니다.',
    check:
      '합성 1만 건에서 p50 28.82ms → 4.66ms, 상위 3개 결과는 exact와 같았습니다. 1천 건에서는 오히려 느려 금지 문장 검색은 exact로 두었고, 실제 FAQ 임베딩 재측정은 남았습니다.',
    evidence: [
      { label: 'PR #182', href: `${ubotBe}/pull/182` },
      { label: 'PR #251', href: `${ubotBe}/pull/251` },
    ],
  },
  {
    projectId: 'ubot',
    label: 'MANUAL CD',
    title: '배포할 때마다 502가 났다',
    summary: '원인이 세 겹이라, 점검 단계를 넣어 하나씩 지웠습니다.',
    symptom: '수동 CD로 EC2에 배포하자 502 Bad Gateway가 30번 넘게 반복됐습니다.',
    cause:
      '원인이 하나가 아니었습니다. SSH 키, 고정 컨테이너 이름 충돌, 그리고 Compose 프로젝트 이름이 달라 서비스끼리 서로를 찾지 못했습니다.',
    fix: '배포 전 점검 단계를 넣어 어디서 막히는지부터 드러냈습니다. 고정 이름을 없애고 프로젝트 이름을 통일했으며, 백엔드를 바꾼 뒤 Nginx를 다시 만들도록 순서를 고쳤습니다.',
    check:
      'PR에 수동 CD 성공과 /actuator/health UP을 기록했고, 점검 단계는 워크플로에 남겼습니다.',
    evidence: [
      { label: 'PR #77', href: `${ubotBe}/pull/77` },
      { label: 'PR #88', href: `${ubotBe}/pull/88` },
    ],
  },
  {
    projectId: 'ubot',
    label: 'NGINX',
    title: '/.env를 요청해도 화면이 내려왔다',
    summary: '숨김 파일 경로는 SPA로 넘기지 않고 404로 끊었습니다.',
    symptom:
      '프론트 서버에 /.env, /.git 같은 경로를 요청하면 404가 아니라 SPA 화면이 정상 응답으로 돌아왔습니다.',
    cause:
      '모든 경로를 index.html로 넘기는 try_files 규칙만 있고, 숨김 파일을 막는 규칙이 없었습니다. 배포 폴더에 그런 파일이 생기면 그대로 내려갈 구조였습니다.',
    fix: '인증서 갱신에 쓰는 .well-known만 남기고 점으로 시작하는 경로를 모두 404로 막았습니다. SSM으로 서버에 적용하고 저장소의 설정 파일에도 같은 규칙을 넣었습니다.',
    check: '환경 파일 경로는 404, 홈은 200으로 응답하는 것을 확인했습니다.',
    evidence: [{ label: 'FE PR #77', href: `${ubotFe}/pull/77` }],
  },
  {
    projectId: 'ubot',
    label: 'CI/CD',
    title: '배포할 때마다 상담 화면이 다시 꺼졌다',
    summary: '빈 변수가 기본값 false로 빌드되던 것을 바로잡았습니다.',
    symptom:
      '상담 기능을 켜 두어도 develop에 변경이 합쳐져 자동 배포가 돌면 상담 화면이 다시 꺼졌습니다.',
    cause:
      'GitHub Actions 변수가 비어 있으면 워크플로가 상담 설정을 기본값 false로 빌드했습니다.',
    fix: '변수를 true로 설정하고 워크플로의 기본값도 true로 바꿨습니다. 자동 CI/CD 대상도 develop으로 정리했습니다.',
    check:
      '설정을 반영한 AWS FE 배포가 성공했고, 실제 서비스에서 상담이 켜진 것을 확인했습니다.',
    evidence: [{ label: 'FE PR #76', href: `${ubotFe}/pull/76` }],
  },
  {
    projectId: 'petcoupon',
    label: 'SSE AUTH',
    title: '세션이 만료되면 401 대신 500이 나갔다',
    summary: '오류 응답의 형식을 한 곳에서 고정해 상태 코드를 살렸습니다.',
    symptom:
      '관리자 SSE 스트림에서 401·404·405가 전부 500으로 바뀌었습니다. 세션이 만료되면 프론트가 500을 재시도 대상으로 보고 끝없이 다시 연결할 수 있었습니다.',
    cause:
      'fetch 기반 SSE 클라이언트는 항상 Accept: text/event-stream을 보냅니다. 예외가 나면 Spring이 이 헤더로 JSON 응답을 협상하다 실패해, 원래 예외를 500으로 다시 던졌습니다.',
    fix: '오류 응답 생성을 헬퍼 하나로 모으고 Content-Type을 JSON으로 고정했습니다. 프론트에는 401을 재시도하지 않도록 연동 조건을 남겼습니다.',
    check: '인증 테스트 5건으로 401·405·500·503이 각각 제 코드로 나가는 것을 확인했습니다.',
    evidence: [{ label: 'PR #179', href: `${petcoupon}/pull/179` }],
  },
  {
    projectId: 'petcoupon',
    label: 'LOG MASKING',
    title: '긴 로그 한 줄에 마스킹이 4.7초 걸렸다',
    summary: '정규식이 검사할 길이를 2,048자로 묶어 최악의 경우를 약 3ms로 줄였습니다.',
    symptom:
      'SQL을 가리는 마스킹 정규식이 로그 길이에 따라 급격히 느려졌습니다. 10KB 46ms, 50KB 1.1초, 100KB 4.7초를 측정했습니다.',
    cause:
      '.+? 패턴이 매칭에 실패하면 입력 길이의 제곱만큼 비용이 듭니다. 이 비용은 로그를 남긴 요청 스레드가 내고, 하필 WARN/ERROR가 쏟아지는 장애 때 커집니다.',
    fix: '검사 구간을 2,048자로 잘랐습니다. 화면에 내보내는 길이(500자)가 검사 구간보다 짧아, 내보내는 내용은 항상 검사를 거칩니다.',
    check: '최악의 경우를 약 3ms로 묶었고, 이 상한을 확인하는 테스트를 남겼습니다.',
    evidence: [{ label: 'PR #179', href: `${petcoupon}/pull/179` }],
  },
  {
    projectId: 'petcoupon',
    label: 'FLAKY TEST',
    title: '테스트가 실행할 때마다 다른 곳에서 깨졌다',
    summary: '테스트 중에도 돌던 스케줄러를 설정으로 끌 수 있게 했습니다.',
    symptom:
      '같은 MySQL을 쓰는 통합 테스트가 실행할 때마다 다른 지점에서 외래키 오류로 실패했습니다.',
    cause:
      '@SpringBootTest가 함께 띄운 이벤트 스케줄러가 매분 상태 이력을 썼고, 그 사이 다른 테스트가 이벤트를 지우다 외래키에 걸렸습니다.',
    fix: '스케줄러 두 개에 켜고 끄는 설정을 달았습니다. cron 주기를 늘리는 방법은 정각을 걸칠 때만 실패하는, 재현되지 않는 문제로 바뀌어 택하지 않았습니다.',
    check:
      '조건을 일부러 지우면 가드 테스트 하나만 실패하고 되돌리면 통과했습니다. 설정이 없을 때 켜져 있는지도 따로 검증합니다.',
    evidence: [{ label: 'PR #101', href: `${petcoupon}/pull/101` }],
  },
  {
    projectId: 'petcoupon',
    label: 'SCHEDULER',
    title: '예외 한 번이면 상태 전이가 영원히 멈췄다',
    summary: '스케줄 작업을 통째로 감싸 다음 주기에 다시 돌게 했습니다.',
    symptom:
      'scheduleAtFixedRate로 등록한 쿠폰 상태 전이가 예외를 한 번 던지면, 이후 실행이 모두 멈추는 구조였습니다.',
    cause:
      'ScheduledExecutorService는 작업이 예외로 끝나면 다음 실행을 예약하지 않습니다. 커넥션 획득이나 커밋처럼 트랜잭션 경계에서 나는 예외도 여기에 해당했습니다.',
    fix: '@Transactional 메서드 바깥에서 작업 전체를 catch(Throwable)로 감싸, 실패해도 다음 주기가 이어지게 했습니다.',
    check:
      '서비스가 매번 예외를 던져도 다음 주기에 다시 실행되는지 회귀 테스트로 고정했습니다. 감싸기를 되돌리면 이 테스트가 실패합니다.',
    evidence: [{ label: 'PR #74', href: `${petcoupon}/pull/74` }],
  },
  {
    projectId: 'petcoupon',
    label: 'JPA',
    title: '발급이 확정돼도 갱신 시각이 그대로였다',
    summary: '벌크 UPDATE가 감사 필드를 건너뛰는 것을 찾아 한 줄로 고쳤습니다.',
    symptom:
      '발급이 확정돼 재고가 줄어도 coupon_stock.updated_at은 쿠폰을 만든 시각에 머물렀습니다. 그래서 관리자 목록에서 이 값을 빼 두고 있었습니다.',
    cause:
      '@Modifying 벌크 UPDATE는 영속성 컨텍스트를 거치지 않아 @LastModifiedDate가 적용되지 않았습니다.',
    fix: '같은 UPDATE 문에서 updated_at도 CURRENT_TIMESTAMP로 바꾸게 했습니다. 발급 확정 트랜잭션의 시그니처는 그대로 두었습니다.',
    check:
      '실제 MySQL로 갱신을 확인하고, 재고가 0이라 UPDATE가 걸리지 않은 경우에는 시각이 바뀌지 않는 것도 따로 확인했습니다.',
    evidence: [{ label: 'PR #147', href: `${petcoupon}/pull/147` }],
  },
  {
    projectId: 'petcoupon',
    label: 'CONCURRENCY',
    title: '쿠폰 수정이 발급 결과를 덮어쓸 수 있었다',
    summary: '두 행을 발급과 같은 순서로 잠그고, 바꾼 컬럼만 쓰게 했습니다.',
    symptom:
      '관리자 쿠폰 수정이 스케줄러·발급과 겹치면, 스케줄러가 바꾼 ACTIVE가 READY로 돌아가거나 발급 수량이 0으로 덮어써져 초과 발급이 생길 수 있었습니다.',
    cause:
      '더티체킹 UPDATE는 바꾸지 않은 컬럼까지 모두 씁니다. 수정을 시작할 때 읽은 낡은 값이 커밋 때 그대로 저장됐습니다.',
    fix: 'coupon과 coupon_stock을 PESSIMISTIC_WRITE로 잠그고 @DynamicUpdate로 바꾼 컬럼만 쓰게 했습니다. 잠금 순서는 발급 경로와 같은 coupon → coupon_stock으로 맞춰 교착을 피했습니다.',
    check: '테스트 34개를 추가했고 전체 211개가 통과했습니다.',
    evidence: [{ label: 'PR #87', href: `${petcoupon}/pull/87` }],
  },
]

/** 협업. 수치는 GitHub 기록 기준입니다. */
export const collaboration: {
  title: string
  /** 첫 화면에 쓰는 한 줄 */
  summary: string
  body: string
  meta: string
  projectId?: string
}[] = [
  {
    title: '팀이 같은 환경에서 시작하도록',
    summary: '로컬과 CI가 같은 DB 이미지를 쓰게 맞췄습니다.',
    body: '로컬 Compose와 Testcontainers가 같은 DB Dockerfile을 쓰게 하고 pgvector, PostGIS 버전을 고정했습니다. 프론트는 초기 환경과 package-lock을 맞췄습니다.',
    meta: 'UBot 백엔드 #3 #10 · 프론트 #2',
    projectId: 'ubot',
  },
  {
    title: '코드 리뷰와 이슈',
    summary: '팀원 PR 49건 리뷰, 이슈 43건 등록.',
    body: 'UBot에서 팀원 PR 49건을 리뷰하고 이슈 43건을 등록했습니다.',
    meta: '2026-10-28 집계',
    projectId: 'ubot',
  },
  {
    title: '문서를 코드와 실제 호출에 대조',
    summary: '문서 내용을 실제로 호출해 52건 중 51건 일치.',
    body: 'UBot 개발 문서를 현행화하면서 격리 DB와 로컬 백엔드로 문서 내용을 실제 호출했습니다. 52건 중 51건이 일치했고 1건은 문서를 고쳤습니다. PetCoupon에서는 README를 컨트롤러와 설정 코드에 대조해 빠진 API와 환경변수 설명을 채웠습니다.',
    meta: 'UBot #107 · PetCoupon #116 #189',
    projectId: 'ubot',
  },
  {
    title: '깔끔한 구조보다 팀의 핵심 기능',
    summary: '공용 설정 대신 전용 실행기를 택했습니다.',
    body: '스케줄러를 공용 설정에 묶으려다, 발급 기능에 영향이 갈 수 있고 팀원이 수정 중인 설정이라 전용 실행기를 택했습니다. PR 4건을 팀원 영역을 다시 고치지 않고 통합했습니다.',
    meta: 'PetCoupon #68 #74 #101 #145',
    projectId: 'petcoupon',
  },
]

export const concurrencyRun = {
  label: 'r0816dup1 · 중복 회원 정순 실험',
  conditions:
    '회원 10,000명 × 서로 다른 requestId로 3회 요청 · 재고 10,000개 · VU 50 · 단일 애플리케이션 인스턴스',
  source:
    'https://github.com/Catverdose/concurrency-strategies/blob/main/docs/02-duplicate-user.md',
  note: '2026-08-16 정순 보고서 기준입니다. WATCH 행은 보고서에 통합된 r0816dup2w 단독 재실행 결과입니다. 조건별 1회 관찰이며, 로컬 단일 호스트 결과를 일반적인 전략 순위로 해석하지 않습니다.',
}

export const concurrencyResults = [
  ['JVM_LOCK', '10,000', '일치', '일치', '통과'],
  ['PESSIMISTIC', '10,000', '중복 2건 → SOLD_OUT', '일치', '실패'],
  ['CONDITIONAL', '10,000', '중복 2건 → SOLD_OUT', '일치', '실패'],
  ['DIRECT', '10,000', '일치', '차감 2,508 / 발급 10,000', '실패'],
  ['REDIS_DECR', '9,999', '일시 SOLD_OUT 13건', '일치', '실패'],
  ['REDIS_LUA', '9,998', '일시 SOLD_OUT 13건', '일치', '실패'],
  ['REDIS_LOCK', '10,000', '품절 9 / 내부 오류 312건', '일치', '실패'],
  ['OPTIMISTIC', '9,999', '내부 오류 14건', '일치', '실패'],
  ['REDIS_WATCH', '945', '무응답 27,000건', '일치', '실패'],
]

/** LLM 서빙 실험. HTTP 완료 RPS, 기준선 8. 탐색 결과입니다. */
export const servingRun = {
  label: 'UBot-LLMTest #6 · 기본 설정 최고 HTTP 완료 RPS',
  conditions:
    '30초 측정 창 · 기준선은 HTTP 완료 초당 8건 · 엔진을 하나씩 켜고 끄며 측정',
  note: '반복 검증 전의 탐색 결과입니다. T4와 L4는 GPU 외에 CPU와 RAM도 다릅니다. 지연, 실패율, 답변 품질의 합격 기준은 적용하지 않았습니다.',
}

export const servingResults = [
  ['로컬 RTX 3060', '3.80', '4.40', '미달'],
  ['AWS T4', '1.97', '1.93', '미달'],
  ['AWS L4', '9.13', '8.17', '통과'],
  ['AWS L4 · 내부 상한 64', '9.97', '8.77', '통과'],
  ['AWS L4 · 내부 상한 128', '8.23', '8.43', '통과'],
  ['AWS L4 · 질문 6유형 300개', '9.03', '8.77', '통과'],
]

// primary: 주력 (GitHub 프로필 README와 같은 기준), used: 프로젝트에서 사용한 경험
// uses: 그 기술을 실제로 어디에 썼는지. 스택 상세 페이지(#/stack)에서 보여 줍니다.
export const stack: {
  category: string
  primary: string[]
  used: string[]
  uses: { text: string; projectId: string }[]
}[] = [
  {
    category: 'Backend',
    primary: ['Java 21', 'Spring Boot', 'JPA'],
    used: ['Go', 'SSE'],
    uses: [
      {
        text: '관리자 API, 상태 전환 스케줄러, SSE 로그 모니터링',
        projectId: 'petcoupon',
      },
      {
        text: '202 접수와 Worker 분리, heartbeat·펜싱·커밋 후 ACK',
        projectId: 'ubot',
      },
      {
        text: 'Go 게이트웨이의 스트리밍 전달과 요청 제한',
        projectId: 'engineering-memory',
      },
    ],
  },
  {
    category: 'Database',
    primary: ['PostgreSQL', 'MySQL'],
    used: ['Redis', 'pgvector', 'PostGIS', 'Flyway'],
    uses: [
      {
        text: '비관적 락 순서와 조건부 UPDATE로 동시 수정 방어',
        projectId: 'petcoupon',
      },
      {
        text: '벡터를 모델별 Profile로 나눠 저장하고 빠진 벡터 백필',
        projectId: 'ubot',
      },
      {
        text: '소유자 조건과 복합 외래 키로 사용자 데이터 격리',
        projectId: 'engineering-memory',
      },
    ],
  },
  {
    category: 'Infrastructure',
    primary: [],
    used: [
      'Docker',
      'Nginx',
      'GitHub Actions',
      'AWS(EC2, VPC, NLB, ASG, ECR, SSM, IAM)',
      'Terraform',
      'Prometheus',
      'GCP',
    ],
    uses: [
      {
        text: '보안 그룹으로 FE·BE·State·GPU 접근 경계를 나누고 내부 NLB 뒤에 Spot GPU ASG 구성',
        projectId: 'ubot',
      },
      {
        text: 'Terraform으로 기존 자원 관리, OIDC → ECR → SSM 배포',
        projectId: 'ubot',
      },
      {
        text: 'Prometheus 지표와 Alertmanager 알림, 배포 실패 뒤 Worker 자동 복구',
        projectId: 'ubot',
      },
      {
        text: 'GCP L4 Spot에 Docker와 NVIDIA runtime 구성',
        projectId: 'engineering-memory',
      },
    ],
  },
  {
    category: 'AI / RAG',
    primary: [],
    used: ['vLLM', 'SGLang', 'Ollama', 'llama.cpp', 'Vector Search'],
    uses: [
      {
        text: '서빙 엔진 4종을 GPU 세 환경에서 비교',
        projectId: 'llm-serving',
      },
      {
        text: '금지어를 임베딩과 LLM 호출 전에 차단',
        projectId: 'ubot',
      },
      {
        text: '문서 색인과 근거 검색, 근거가 없으면 답변 생략',
        projectId: 'engineering-memory',
      },
    ],
  },
  {
    category: 'Verification',
    primary: [],
    used: ['JUnit', 'Testcontainers', 'k6', 'Benchmark Harness'],
    uses: [
      {
        text: 'k6로 동시성 9개 전략 비교, 판정 기준 6개',
        projectId: 'concurrency',
      },
      {
        text: 'Vector DB 5종을 620회 측정하는 harness',
        projectId: 'vector-db-benchmark',
      },
      {
        text: 'AWS 6,000건 재시험과 장애 4종 주입, 작업 ID를 DB와 대조',
        projectId: 'ubot',
      },
    ],
  },
  {
    category: 'Frontend',
    primary: [],
    used: ['React', 'TypeScript', 'Vite'],
    uses: [
      {
        text: '작업 상태 폴링과 백오프, 동시 401에도 토큰 재발급은 한 번',
        projectId: 'ubot',
      },
      {
        text: '관리자 화면 API 연동과 요청, 응답 타입 정의',
        projectId: 'petcoupon',
      },
      {
        text: '124개 설정을 탐색하는 SVG 산점도',
        projectId: 'vector-db-benchmark',
      },
    ],
  },
]
