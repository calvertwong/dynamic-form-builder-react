export type TFileInput = {
  label?: string;
  name?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  message?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  messageClassName?: string;
}