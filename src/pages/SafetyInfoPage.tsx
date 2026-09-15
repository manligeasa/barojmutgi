// Created: 2026-09-15 09:01
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { clearAllStorage } from '../lib/storage'

export function SafetyInfoPage() {
  const [cleared, setCleared] = useState(false)

  const handleClearAll = () => {
    clearAllStorage()
    setCleared(true)
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold">개인정보·안전 안내</h1>

      <div className="mt-4 flex flex-col gap-4 text-lg text-slate-700">
        <p>
          이 앱에 입력한 내용과 즐겨찾기, 최근 사용 기록은 <strong>이 기기의 브라우저에만</strong> 저장되며, 어떤
          서버로도 전송되지 않습니다.
        </p>
        <p>
          주민등록번호, 주소, 연락처, 계좌, 비밀번호, 다른 사람의 실명이나 업무 기밀은 어떤 화면에도 입력하지
          마세요.
        </p>
        <p>
          건강이나 법률 관련 결과는 참고용일 뿐, 진단·처방·법률 자문을 대신하지 않습니다. 중요한 결정은 반드시
          전문가와 상의하세요.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-slate-200 bg-white p-4">
        <h2 className="text-xl font-bold">브라우저에 저장된 내용 모두 지우기</h2>
        <p className="mt-2 text-lg text-slate-600">
          즐겨찾기, 최근 사용 기록, 작성 중인 내용이 이 기기에서 모두 삭제됩니다. 되돌릴 수 없어요.
        </p>
        <Button variant="secondary" onClick={handleClearAll} className="mt-4">
          전체 삭제하기
        </Button>
        {cleared && <p className="mt-2 text-lg font-medium text-primary">모두 삭제했어요.</p>}
      </div>
    </div>
  )
}
