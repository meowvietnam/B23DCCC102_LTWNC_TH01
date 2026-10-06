import {
  useCallback,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from 'react'
import type { FormErrors } from '../types/common'

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

interface UseFormOptions<T> {
  initialValues: T
  /** Trả về object lỗi; object rỗng = hợp lệ */
  validate?: (values: T) => FormErrors<T>
  /** Trả về `false` nếu muốn giữ nguyên form (không reset) */
  onSubmit: (values: T) => void | boolean
}

/**
 * Custom hook generic quản lý form: values, errors, touched, register, submit, reset.
 * T là kiểu giá trị form (mỗi field là string vì lấy từ input HTML).
 */
export function useForm<T extends Record<string, string>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const runValidate = useCallback(
    (next: T): FormErrors<T> => (validate ? validate(next) : {}),
    [validate],
  )

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
    const next = { ...values, [field]: value }
    setValues(next)
    if (touched[field]) setErrors(runValidate(next))
  }

  const handleChange = (e: ChangeEvent<FieldElement>) =>
    setFieldValue(e.target.name as keyof T, e.target.value as T[keyof T])

  const handleBlur = (e: FocusEvent<FieldElement>) => {
    const field = e.target.name as keyof T
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(runValidate(values))
  }

  /** Gắn nhanh props cho input: {...register('title')} */
  const register = <K extends keyof T & string>(name: K) => ({
    name,
    id: name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': Boolean(touched[name] && errors[name]),
  })

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nextErrors = runValidate(values)
    setErrors(nextErrors)
    setTouched(
      Object.keys(values).reduce<Partial<Record<keyof T, boolean>>>(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      ),
    )
    if (Object.keys(nextErrors).length > 0) return
    if (onSubmit(values) !== false) reset()
  }

  /** Chỉ hiện lỗi khi field đã được chạm vào */
  const getError = (name: keyof T): string | undefined =>
    touched[name] ? errors[name] : undefined

  return { values, errors, register, getError, setFieldValue, handleSubmit, reset }
}
