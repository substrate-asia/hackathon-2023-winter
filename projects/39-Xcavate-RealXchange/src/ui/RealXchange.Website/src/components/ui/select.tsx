import { cn } from '@/lib/utils';
import { ErrorMessage } from '@hookform/error-message';
import { forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';

export interface SelectProps extends React.ComponentProps<'select'> {
  label: string;
  htmlFor?: string;
  options: { name: string; value: any }[];
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

const SelectInput = forwardRef<HTMLSelectElement, SelectProps>(function SelectInput(
  { label, htmlFor, options, className, ...props },
  ref
) {
  return (
    <div className='className="flex w-full flex-col items-start gap-2'>
      <label htmlFor={htmlFor} className="text-[1rem]/[1.5rem]">
        {label}
      </label>
      <select
        className={cn(
          'flex w-full gap-2 rounded-lg border border-foreground px-4 py-3.5 text-[0.75rem]/[1.5rem] font-light placeholder:text-foreground/50',
          className
        )}
        ref={ref}
        {...props}
      >
        <option>Select...</option>
        {options &&
          options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.name}
            </option>
          ))}
      </select>
      <FieldError name={props.name} />
    </div>
  );
});

export default SelectInput;
