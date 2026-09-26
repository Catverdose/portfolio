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
- `src/App.tsx`: 메인 페이지 구성과 소개 문구
- `src/styles.css`: 반응형 레이아웃과 디자인 토큰
- `src/components/ProjectDialog.tsx`: 프로젝트 상세, 비교 표, 키보드 탐색
- `public/catverdose-portfolio.pdf`: 원본 제출용 PDF. 파일을 교체하면 다운로드에 반영됩니다.

2026-09-26 외부 링크 확인에서 GitHub 주소는 모두 HTTP 200으로 응답했지만 `memory.catverdose.xyz`는 DNS가 조회되지 않았습니다(`ENOTFOUND`). 현재 데모는 준비 중으로 표시합니다. DNS·TLS와 실제 서비스 접근을 확인한 뒤 `src/data/projects.ts`의 `profile.liveAvailable`을 `true`로 바꾸면 데모 링크가 표시됩니다.

참조 자료는 `catverdose-portfolio-requirements.md`, `backend-portfolio_2.pdf`, `DESIGN-vercel.md`입니다. PDF를 수정하지 않고 그대로 제공하며, 프로젝트별 성과와 실험 수치는 첨부 자료의 조건·기여 범위와 함께 기재했습니다. Engineering Memory의 배포 내용은 요구사항 문서를, 남은 과제는 PDF의 Phase 1 시점을 기준으로 구분했습니다.

## 구성

- Hero와 네 가지 개발 초점
- Engineering Memory 대표 프로젝트 및 아키텍처
- PetCoupon, Coupon Concurrency, Vector DB Benchmark, UBot Backend, Planly
- 문제 → 설계 판단 → 검증·결과 → 조건과 남은 과제로 구성한 상세 창
- 사용 맥락을 포함한 기술 스택과 GitHub·PDF 링크

프로젝트 상세는 한 페이지의 네이티브 `dialog`로 표시합니다. 별도 라우터나 서버 rewrite가 필요하지 않습니다. Escape 닫기, 포커스 순환·복원, 모바일 메뉴, 비교 표 가로 스크롤을 지원합니다.

## 3D와 성능

Hero에서만 Three.js, React Three Fiber, Drei를 사용합니다. 본문을 먼저 렌더링하고 3D는 별도 청크로 지연 로딩합니다.

- 900px 미만 화면과 `prefers-reduced-motion: reduce`에서는 SVG 도식만 표시합니다.
- WebGL2 미지원·모듈 로딩 실패에도 정적 도식과 본문이 유지됩니다.
- Hero가 화면 밖으로 나가면 Canvas를 해제합니다.
- 3D를 제거하려면 `HeroVisual.tsx`에서 지연 로딩 부분을 제거하면 됩니다. 콘텐츠는 3D에 의존하지 않습니다.
- 폰트는 npm 패키지에서 자체 호스팅하며 외부 폰트 CDN을 호출하지 않습니다.

3D 청크는 약 900KB(압축 전)라 Vite의 청크 크기 경고가 발생할 수 있습니다. 초기 콘텐츠 번들과 분리되어 있고 모바일에서는 요청하지 않습니다. 향후 예산을 더 줄일 때는 3D를 제거하는 것이 가장 단순합니다.

## 검증

TypeScript 검사와 프로덕션 빌드, Chromium 기반 브라우저에서 아래 동작을 확인했습니다.

- 6개 프로젝트 상세 열기·닫기, Tab 포커스 순환, Escape와 포커스 복원
- 320px·390px·768px 반응형 레이아웃 및 모바일 메뉴
- 모바일 비교 표의 가로 스크롤
- PDF 다운로드 파일명과 원본 SHA-256 일치
- 모션 감소 설정에서 3D 비활성화
- WebGL2 환경의 실제 3D 렌더링과 Hero가 화면 밖으로 나갈 때 Canvas 해제
- 3D 모듈 요청을 차단한 상황에서도 본문·상세 창 정상 동작

GitHub나 데모는 외부 서비스이므로 저장소 공개 여부와 서비스 가동 상태에 따라 접근 가능성이 달라질 수 있습니다.
