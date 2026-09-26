import BenchmarkPlot from '../BenchmarkPlot'
import PlaygroundShell from './PlaygroundShell'

export default function VectorBenchmarkPlayground() {
  return (
    <PlaygroundShell
      eyebrow="MEASURED RESULTS"
      title="검색 품질을 맞춘 다음, 속도를 비교하기"
      description="같은 Recall 구간에서 DB별 지연과 처리량을 비교하세요. 점을 선택하면 설정값, 반복 편차와 측정 경고를 확인할 수 있습니다."
      disclaimer="공개된 실측 데이터 · 124개 설정 × 독립 재구축 5회 = 총 620개 측정"
      footnote="합성 10,000개 · 1,024차원 · Exact cosine Top-10 · 4 vCPU / 8 GiB · 검색 동시성 10. 실제 서비스의 데이터와 운영 비용은 별도로 검증해야 합니다."
    >
      <BenchmarkPlot />
    </PlaygroundShell>
  )
}
