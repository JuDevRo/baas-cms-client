import { useEffect, useRef } from 'react'
import './Popover.css'

interface PopoverProps {
  isOpen: boolean
  onClose: () => void
  trigger: React.ReactNode
  children: React.ReactNode
}

const Popover = ({ isOpen, onClose, trigger, children }: PopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  return (
    <div className="popover-wrapper" ref={popoverRef}>
      {trigger}
      {isOpen && (
        <div className="popover-menu">
          {children}
        </div>
      )}
    </div>
  )
}

export default Popover
