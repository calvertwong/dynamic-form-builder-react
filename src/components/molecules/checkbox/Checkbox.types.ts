export type TCheckbox = {
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  id?: string
  disabled?: boolean
  hasError?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
  messageClassName?: string
}