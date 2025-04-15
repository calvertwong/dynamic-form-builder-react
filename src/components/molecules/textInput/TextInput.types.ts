export type TTextInput = {
  label?: string;
  value: string;
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