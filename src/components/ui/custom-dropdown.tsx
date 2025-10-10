"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

interface DropdownItem {
  label: string
  value: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "default" | "destructive"
}

interface CustomDropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: "left" | "right" | "center"
  className?: string
  triggerClassName?: string
  contentClassName?: string
  disabled?: boolean
}

export function CustomDropdown({
  trigger,
  items,
  align = "left",
  className,
  triggerClassName,
  contentClassName,
  disabled = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => {
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isOpen])

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return
    
    if (item.onClick) {
      item.onClick()
    }
    setIsOpen(false)
  }

  const getAlignmentClasses = () => {
    switch (align) {
      case "right":
        return "right-0"
      case "center":
        return "left-1/2 transform -translate-x-1/2"
      case "left":
      default:
        return "left-0"
    }
  }

  return (
    <div className={cn("relative inline-block", className)} ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          triggerClassName
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
        <ChevronDownIcon 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-1 z-50 min-w-[8rem] bg-white border border-gray-200 rounded-md shadow-lg py-1",
            getAlignmentClasses(),
            contentClassName
          )}
        >
          {items.map((item, index) => (
            <button
              key={item.value || index}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                item.variant === "destructive" && "text-red-600 hover:bg-red-50 focus:bg-red-50"
              )}
            >
              {item.icon && (
                <span className="flex-shrink-0 h-4 w-4">
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Convenience component for common use cases
interface SimpleDropdownProps {
  label: string
  items: DropdownItem[]
  align?: "left" | "right" | "center"
  className?: string
  disabled?: boolean
}

export function SimpleDropdown({
  label,
  items,
  align = "left",
  className,
  disabled = false,
}: SimpleDropdownProps) {
  return (
    <CustomDropdown
      trigger={<span>{label}</span>}
      items={items}
      align={align}
      className={className}
      disabled={disabled}
    />
  )
}

// Menu with separator support
interface DropdownMenuItem {
  type: "item" | "separator"
  label?: string
  value?: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "default" | "destructive"
}

interface MenuDropdownProps {
  trigger: React.ReactNode
  items: DropdownMenuItem[]
  align?: "left" | "right" | "center"
  className?: string
  disabled?: boolean
}

export function MenuDropdown({
  trigger,
  items,
  align = "left",
  className,
  disabled = false,
}: MenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.type === "separator" || item.disabled) return
    
    if (item.onClick) {
      item.onClick()
    }
    setIsOpen(false)
  }

  const getAlignmentClasses = () => {
    switch (align) {
      case "right":
        return "right-0"
      case "center":
        return "left-1/2 transform -translate-x-1/2"
      case "left":
      default:
        return "left-0"
    }
  }

  return (
    <div className={cn("relative inline-block", className)} ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
        <ChevronDownIcon 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-1 z-50 min-w-[8rem] bg-white border border-gray-200 rounded-md shadow-lg py-1",
            getAlignmentClasses()
          )}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.type === "separator" ? (
                <div className="h-px bg-gray-200 my-1" />
              ) : (
                <button
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                    item.variant === "destructive" && "text-red-600 hover:bg-red-50 focus:bg-red-50"
                  )}
                >
                  {item.icon && (
                    <span className="flex-shrink-0 h-4 w-4">
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1">{item.label}</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
