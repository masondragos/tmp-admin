"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface CustomSelectProps {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
  name?: string
  id?: string
  "aria-label"?: string
  "aria-labelledby"?: string
}

const CustomSelect = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  CustomSelectProps
>(({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  name,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...props
}, ref) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      name={name}
      {...props}
    >
      <SelectTrigger
        ref={ref}
        id={id}
        className={cn(
          "w-full",triggerClassName
        )}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={cn("max-h-[300px]",contentClassName)} >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})

CustomSelect.displayName = "CustomSelect"

export { CustomSelect }
