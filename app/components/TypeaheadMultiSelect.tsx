// Follow STYLE_GUIDE.md for any UI changes.
// Design: minimal, editorial, calm. No loud colors. No marketplace language.
'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { SkillOrInterest, searchItems } from '@/src/lib/skillsInterests'

interface TypeaheadMultiSelectProps {
  items: SkillOrInterest[]
  selectedItems: SkillOrInterest[]
  onSelectionChange: (items: SkillOrInterest[]) => void
  placeholder?: string
  label?: string
  type: 'skill' | 'interest'
}

/**
 * Typeahead Multi-Select Component
 * 
 * Allows users to search and select multiple items from a predefined list.
 * Features:
 * - Typeahead search with dropdown
 * - Selected items displayed as removable chips/bubbles
 * - Keyboard navigation support
 * - Duplicate prevention
 * - Alphabetical sorting of search results
 */
export default function TypeaheadMultiSelect({
  items,
  selectedItems,
  onSelectionChange,
  placeholder = 'Type to search...',
  label,
  type,
}: TypeaheadMultiSelectProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Filter items based on query
  const filteredItems = query.trim()
    ? searchItems(query, type).filter(item => 
        !selectedItems.some(selected => selected.id === item.id)
      )
    : []

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value)
    setIsOpen(true)
    setHighlightedIndex(-1)
  }

  // Handle item selection
  const handleSelectItem = (item: SkillOrInterest) => {
    if (!selectedItems.some(selected => selected.id === item.id)) {
      onSelectionChange([...selectedItems, item])
    }
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Handle item removal
  const handleRemoveItem = (itemId: string) => {
    onSelectionChange(selectedItems.filter(item => item.id !== itemId))
  }

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredItems.length === 0) {
      if (e.key === 'Backspace' && query === '' && selectedItems.length > 0) {
        // Remove last selected item on backspace when input is empty
        handleRemoveItem(selectedItems[selectedItems.length - 1].id)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredItems.length) {
          handleSelectItem(filteredItems[highlightedIndex])
        } else if (filteredItems.length > 0) {
          handleSelectItem(filteredItems[0])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [highlightedIndex])

  // Group items by category for display (when showing all, not searching)
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, SkillOrInterest[]>)

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '8px',
          color: '#374151',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          {label}
        </label>
      )}

      {/* Selected items as chips */}
      {selectedItems.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '8px',
          padding: '8px',
          backgroundColor: '#F9FAFB',
          borderRadius: '6px',
          minHeight: '40px'
        }}>
          {selectedItems.map(item => (
            <span
              key={item.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: type === 'skill' ? '#E5E7EB' : '#DBEAFE',
                color: type === 'skill' ? '#374151' : '#1E40AF',
                borderRadius: '16px',
                fontSize: '13px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                lineHeight: 1
              }}
            >
              {item.name}
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: '16px',
                  lineHeight: 1,
                  padding: 0,
                  marginLeft: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: 0.7
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7'
                }}
                aria-label={`Remove ${item.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input field */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            border: '2px solid #D1D5DB',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            outline: 'none'
          }}
          onBlur={(e) => {
            // Delay closing to allow clicks on dropdown items
            setTimeout(() => {
              if (!containerRef.current?.contains(document.activeElement)) {
                setIsOpen(false)
              }
            }, 200)
          }}
        />

          {/* Dropdown */}
          {isOpen && filteredItems.length > 0 && (
            <div
              ref={dropdownRef}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                backgroundColor: '#ffffff',
                border: '2px solid #D1D5DB',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                maxHeight: '300px',
                overflowY: 'auto',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}
            >
              {/* Show grouped by category when searching (for organization) but display alphabetically */}
              {query && Object.keys(groupedItems).length > 1 ? (
                Object.entries(groupedItems)
                  .sort(([a], [b]) => a.localeCompare(b)) // Sort categories alphabetically
                  .map(([category, categoryItems]) => (
                    <div key={category}>
                      <div style={{
                        padding: '8px 12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        backgroundColor: '#F9FAFB',
                        borderBottom: '1px solid #E5E7EB',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1
                      }}>
                        {category}
                      </div>
                      {categoryItems.map((item, idx) => {
                        const globalIndex = filteredItems.indexOf(item)
                        const isHighlighted = highlightedIndex === globalIndex
                        
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectItem(item)}
                            onMouseEnter={() => setHighlightedIndex(globalIndex)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              textAlign: 'left',
                              fontSize: '14px',
                              backgroundColor: isHighlighted ? '#F3F4F6' : 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#374151',
                              borderBottom: idx < categoryItems.length - 1 || Object.keys(groupedItems).indexOf(category) < Object.keys(groupedItems).length - 1 ? '1px solid #F3F4F6' : 'none',
                              transition: 'background-color 150ms ease-in-out'
                            }}
                          >
                            {item.name}
                          </button>
                        )
                      })}
                    </div>
                  ))
              ) : (
                // Show flat alphabetical list (items already sorted alphabetically by searchItems)
                filteredItems.map((item, idx) => {
                  const isHighlighted = highlightedIndex === idx
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontSize: '14px',
                        backgroundColor: isHighlighted ? '#F3F4F6' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#374151',
                        borderBottom: idx < filteredItems.length - 1 ? '1px solid #F3F4F6' : 'none',
                        transition: 'background-color 150ms ease-in-out'
                      }}
                    >
                      {item.name}
                    </button>
                  )
                })
              )}
            </div>
          )}

        {/* No results message */}
        {isOpen && query.trim() && filteredItems.length === 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: '#ffffff',
            border: '2px solid #D1D5DB',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '14px',
            color: '#6B7280',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            zIndex: 1000
          }}>
            No results found
          </div>
        )}
      </div>
    </div>
  )
}
