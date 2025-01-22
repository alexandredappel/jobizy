import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MultiSelectProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  // Ensure we're working with arrays and handle undefined/null cases
  const safeOptions = Array.isArray(options) ? options : []
  const safeSelected = Array.isArray(selected) ? selected : []

  // Debug logs for component state
  console.log('MultiSelect render:', { 
    options: safeOptions, 
    selected: safeSelected,
    open 
  })

  // Debug for selection changes
  React.useEffect(() => {
    console.log('Selected items:', safeSelected)
  }, [safeSelected])

  const handleSelect = React.useCallback((option: string, e: React.MouseEvent) => {
    // Prevent default behavior and stop event propagation immediately
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log('handleSelect called with option:', option)
    
    // Update selection state
    if (safeSelected.includes(option)) {
      console.log('Removing option:', option)
      onChange(safeSelected.filter((item) => item !== option))
    } else {
      console.log('Adding option:', option)
      onChange([...safeSelected, option])
    }
  }, [safeSelected, onChange])

  const handleRemove = React.useCallback((option: string) => {
    onChange(safeSelected.filter((item) => item !== option))
  }, [safeSelected, onChange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex gap-1 flex-wrap">
            {safeSelected.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {safeSelected.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="mr-1 gap-1 pr-0.5"
              >
                <span>{item}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-secondary"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRemove(item)
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {item}</span>
                </Button>
              </Badge>
            ))}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0" 
        align="start"
        sideOffset={5}
      >
        <ScrollArea className="h-[200px] w-full rounded-md">
          <div className="p-1">
            {safeOptions.map((option) => (
              <Button
                key={option}
                variant="ghost"
                role="option"
                type="button"
                className={cn(
                  "w-full justify-start gap-2",
                  safeSelected.includes(option) && "bg-accent"
                )}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSelect(option, e)
                }}
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    safeSelected.includes(option) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}