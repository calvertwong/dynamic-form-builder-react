export type TInput = {
  className?: string;
  id?: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type: string;
  value?: string | number;
  disabled?: boolean;
  hasError?: boolean;
  checked?: boolean
};