# Catverdose Portfolio

데이터 정합성, 장애 복구, 검증, 백엔드 인프라를 중심으로 정리한 포트폴리오입니다.
React + TypeScript + Vite로 만든 정적 사이트이며, 별도 백엔드 없이 실행합니다.

## 실행

Node.js 22.12 이상(또는 20.19 이상)이 필요합니다. 개발·검증 환경은 Node.js 24입니다.

```sh
npm ci
npm run dev
```

```sh
npm run typecheck
npm run build
npm run preview
```

`npm run build` 결과는 `dist/`에 생성됩니다. 정적 호스팅의 빌드 명령은 `npm run build`, 출력 디렉터리는 `dist`입니다. 외부 API 키나 환경 변수는 필요하지 않습니다. `catverdose.xyz`의 호스팅·DNS 연결은 별도로 진행합니다.

## 내용 수정

- `src/data/projects.ts`: 프로젝트 내용, 기여 범위, GitHub·데모 주소, 실험 결과, 기술 스택
- `src/App.tsx`: 해시 라우팅, 공통 헤더, 뒤로가기 시 스크롤·포커스 복원
- `src/pages/HomePage.tsx`: 메인 페이지 구성과 소개 문구
- `src/pages/ProjectPage.tsx`: 프로젝트별 페이지, 사례와 근거 자료
- `src/styles.css`: 반응형 레이아웃과 디자인 토큰
- `src/components/HeroVisual.tsx`, `src/data/projectGraph.ts`: 프로젝트 이동 맵과 관계 설명
- `src/components/ProjectDesign.tsx`: Engineering Memory·UBot·Planly의 정적 설계 도식
- `src/components/ProjectPlayground.tsx`: SSE 모형·측정 탐색의 지연 로딩
- `src/components/playgrounds/`: SSE 큐 모형, Vector DB 실측 탐색과 공통 UI
- `src/components/SelectedWork.tsx`: 대표 사례 2개·실험 2개·보조 프로젝트 2개, 학습 기록
- `src/components/EvidenceLinks.tsx`: 사례별 코드·테스트·보고서 링크
- `src/data/vectorBenchmark.ts`: 공개 수치 부록의 124개 설정 스냅샷과 출처
- `src/components/BenchmarkPlot.tsx`: DB 필터·지표 전환·키보드 선택을 지원하는 산포도
- `public/catverdose-portfolio.pdf`: 원본 제출용 PDF. 파일을 교체하면 다운로드에 반영됩니다.

2026-09-26 외부 링크 확인에서 GitHub 주소는 모두 HTTP 200으로 응답했지만 `memory.catverdose.xyz`는 DNS가 조회되지 않았습니다(`ENOTFOUND`). 현재 외부 데모 링크는 숨깁니다. DNS·TLS와 실제 서비스 접근을 확인한 뒤 `src/data/projects.ts`의 `profile.liveAvailable`을 `true`로 바꾸면 데모 링크가 표시됩니다. 프로젝트 안의 플레이그라운드는 이 외부 서비스와 연결하지 않습니다.

초기 참조 자료는 `catverdose-portfolio-requirements.md`, `backend-portfolio_2.pdf`, `DESIGN-vercel.md`입니다. 2026-09-26 공개 GitHub의 구현·테스트·보고서를 확인해 웹 내용을 보강했습니다. 다운로드 PDF는 원본을 유지하므로 웹의 최신 근거·수치와 차이가 있을 수 있습니다. Engineering Memory의 GCP 배포 내용은 요구사항 문서에 근거합니다.

동시성 표는 `r0816dup1` 정순 보고서로 통일했습니다. WATCH 행은 해당 보고서에 통합된 `r0816dup2w` 단독 재실행이며 표 아래에 표시합니다. 정순과 역순의 수치를 섞지 않습니다. PetCoupon의 1,030 TPS와 16.31초는 2~5회 실행의 접수 처리량 평균과 접수 응답 p95 평균이며, 비동기 DB 확정 완료 시간의 회차 평균 220.5초와 구분합니다. 모두 팀 전체 부하 테스트 결과입니다.

Vector DB 산포도는 `fairness-v2-20260912-1826`의 수치 부록(Git blob `518d0709c263359f4a49d3a7b6f36d9aeaaf9b60`)을 정적으로 내장합니다. 14개 구성 × 5회 재구축(70 builds)에서 검색 설정별 620회 측정한 결과를 124개 설정으로 요약합니다. Recall은 5회 평균, p95·QPS는 중앙값이며 하나의 실행값으로 해석하지 않습니다. 원본 부록의 반올림 정밀도와 경고를 유지합니다. 페이지 로딩 중 GitHub API나 외부 차트 CDN을 호출하지 않습니다.

## 구성

- Hero와 네 가지 개발 초점
- 중앙 Catverdose와 프로젝트 6개를 잇는 이동 맵, 프로젝트 간 관계 표시
- Engineering Memory·PetCoupon 대표 사례와 아키텍처·SSE 구조
- 상세 페이지에서 설계 도식·실험 결과를 표시하고, SSE 큐 재현과 Vector DB 실측 탐색에만 조작 제공
- UBot Backend·Planly의 기여 범위, 접을 수 있는 학습·프롬프트 실험 목록
- 문제 → 설계 판단 → 검증·결과 → 선택의 비용 → 근거 링크와 한계로 구성한 상세 페이지
- 연관 프로젝트 간 상세 이동, 공개 이메일·GitHub·원본 PDF 링크

프로젝트 주소는 `/#/projects/engineering-memory`와 같은 해시 경로입니다. 노드·본문에서 이동하며 직접 주소 열기, 새로고침, 브라우저 뒤로가기·앞으로가기를 지원합니다. 기존 `#projects`, `#contact` 앵커도 유지합니다. 서버 rewrite는 필요하지 않습니다. 홈으로 뒤로갈 때 기존 스크롤과 선택한 링크의 포커스를 복원합니다. 알 수 없는 프로젝트 주소에는 안내 화면을 보여줍니다.

## 설계 자료와 로딩

홈은 HTML/SVG 프로젝트 맵과 요약만 렌더링합니다. 이전 Three.js·React Three Fiber·Drei 의존성과 3D 렌더러를 제거했습니다.

- `ProjectPage`, SSE 큐 모형, Vector DB 실측 탐색은 각각 `React.lazy`와 동적 import로 분리합니다.
- 홈 최초 접속·노드 호버에서는 플레이그라운드 모듈을 요청하거나 미리 렌더링하지 않습니다.
- PetCoupon·Vector DB 페이지 진입 시 해당 모듈만 요청합니다. 나머지 프로젝트에는 플레이그라운드를 로드하지 않습니다. 페이지에서 나가면 조작 상태가 해제되며, 이미 방문한 모듈은 브라우저 캐시에 남을 수 있습니다.
- 자동 재생·타이머·실제 API 호출은 없습니다. 정적 설계 도식은 바로 읽을 수 있으며, 클릭해야만 설명이 나타나는 단계 진행을 제거했습니다.
- 모듈 로딩 실패 시 재시도 안내를 보여주며, 사례 설명과 코드 링크는 계속 읽을 수 있습니다.
- 모바일 맵에는 별도의 읽기 쉬운 프로젝트 링크를 제공하며, 모션 감소 설정을 존중합니다.
- 폰트는 npm 패키지에서 자체 호스팅하며 외부 폰트 CDN을 호출하지 않습니다.

| 프로젝트            | 보여주는 내용                                               |
| ------------------- | ----------------------------------------------------------- |
| Engineering Memory  | 문서 수정과 진행 중인 색인 작업의 관계, 저장 시점 검증 도식 |
| PetCoupon           | B 수신 정지/재개와 로그 5개 전송으로 독립 큐 포화·유실 확인 |
| Coupon Concurrency  | 실제 9개 동시성 전략의 측정 표와 원본 보고서                |
| Vector DB Benchmark | 실제 124개 설정을 즉시 표시하고 DB·지표·설정별 비교         |
| UBot                | 공통 DB 이미지·마이그레이션을 로컬과 CI에서 사용하는 구조   |
| Planly              | 소유권 조회·중복 확인·트랜잭션의 검증 순서                  |

Vector DB와 동시성 표는 공개 실측 데이터입니다. SSE 예시만 구현 원리를 단순화한 교육용 모형이며 실제 서비스 실행·부하 측정 결과로 표시하지 않습니다. 큐 크기 3, 전송 단위 5와 오래된 이벤트를 버리는 조건을 화면에 기재했습니다. 프로젝트 맵은 이동과 관계 설명에 집중하며 확대·드래그·동적 설명 패널을 제공하지 않습니다.

## 검증

TypeScript 검사와 프로덕션 빌드, Chromium 기반 브라우저에서 아래 동작을 확인했습니다.

- 6개 프로젝트 직접 접속·새로고침, 맵에서 이동, 뒤로가기·포커스 복원
- 320px·390px·768px·1440px 반응형 레이아웃 및 모바일 메뉴
- 모바일 비교 표의 가로 스크롤
- PDF 다운로드 파일명과 원본 SHA-256 일치
- 홈 최초 접속과 호버 시 프로젝트 페이지·플레이그라운드 청크 요청 0건
- 선택한 프로젝트의 SSE 또는 Vector DB 모듈만 다운로드, 정적 프로젝트에는 플레이그라운드 요청 없음
- 플레이그라운드 요청을 차단해도 사례와 근거 링크 유지
- SSE 정상 전달·반복 포화·최신 이벤트 유지·재개 후 유실 유지·초기화
- Engineering Memory·UBot·Planly의 설계 도식, 동시성 9개 전략 실측 표와 근거 링크
- 124개 설정 산포도, DB 필터, p95/QPS 전환, 키보드·선택 메뉴와 실제 수치 일치
- 모션 감소 설정과 키보드 맵 이동, 프로젝트 페이지 안에서 본문 바로가기
- 640~899px에서도 접히는 메뉴, 정순 실험 수치와 WATCH 재실행 조건 표시

GitHub나 데모는 외부 서비스이므로 저장소 공개 여부와 서비스 가동 상태에 따라 접근 가능성이 달라질 수 있습니다.
