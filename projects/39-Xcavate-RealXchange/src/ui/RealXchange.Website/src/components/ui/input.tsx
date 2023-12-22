import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { ErrorMessage } from '@hookform/error-message';
import { useFormContext } from 'react-hook-form';

export interface InputProps extends React.ComponentProps<'input'> {
  label: string;
  htmlFor?: string;
}

export function FieldError({ name }: { name?: string }) {
  const {
    formState: { errors }
  } = useFormContext();

  if (!name) return null;

  const error = errors[name];

  if (!error) return null;

  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <p className="text-[0.75rem] text-red-500/70">{message}</p>
      )}
    />
  );
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, htmlFor, className, ...props },
  ref
) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <label htmlFor={htmlFor} className="text-[1rem]/[1.5rem]">
        {label}
      </label>
      <input
        className={cn(
          'flex w-full gap-2 rounded-lg border border-foreground bg-background px-4 py-3.5 text-[0.75rem]/[1.5rem] font-light placeholder:text-foreground/50',
          className
        )}
        ref={ref}
        {...props}
      />
      <FieldError name={props.name} />
    </div>
  );
});

export default Input;
