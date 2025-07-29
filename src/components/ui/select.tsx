'use client'

import * as React from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Seleccionar...",
  className,
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={cn("relative", className)} ref={selectRef}>
      <button
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isOpen && "ring-2 ring-pink-500 ring-offset-2"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 text-gray-400 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto p-1">
            {options.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
                  value === option.value && "bg-gray-100"
                )}
                onClick={() => handleSelect(option.value)}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check className="h-4 w-4 text-pink-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}