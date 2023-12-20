import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTaskStatusClass(status: string) {
  switch (status) {
    case 'Success':
      return 'success'
    case 'Fail':
    case 'Error':
    case 'Panic':
      return 'error'
    default:
      return 'warning'
  }
}
