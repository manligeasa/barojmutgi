// Created: 2026-09-15 09:08
import { useEffect, useMemo, useState, type ChangeEvent } from 'react'

/**
 * 선택한 사진은 이 화면의 미리보기(Object URL)에만 쓰인다.
 * 어디로도 전송하지 않는다 — PhotoPreviewInput.test.ts가 이를 보증한다.
 */
export function PhotoPreviewInput() {
  const [file, setFile] = useState<File | null>(null)
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null)
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 p-4">
      <label className="block">
        <span className="text-lg font-semibold">사진을 올려서 미리 볼 수 있어요 (선택 사항)</span>
        <input type="file" accept="image/*" onChange={handleChange} className="mt-2 block w-full text-lg" />
      </label>
      <p className="mt-1 text-base text-slate-500">
        사진은 이 화면에서 미리 보기에만 쓰이고, 어디로도 전송되지 않아요.
      </p>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="선택한 사진 미리보기"
          className="mt-3 max-h-64 w-full rounded-xl border-2 border-slate-200 object-contain"
        />
      )}
    </div>
  )
}
