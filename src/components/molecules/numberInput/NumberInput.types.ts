export type TNumberInput = {
  label?: string;
  value?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  hasError?: boolean;
  message?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  messageClassName?: string;
}