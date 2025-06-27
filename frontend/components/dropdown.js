"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export default function SortDropdown({ onSortChange, currentSort = "" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState(currentSort)

  const sortOptions = [
    { value: "", label: "Relevance" },
    { value: "devlogs", label: "Most Devlogs" },
    { value: "created_at_desc", label: "Most Recent" },
    { value: "created_at_asc", label: "Oldest" },
    { value: "length", label: "Title Length" },
    { value: "name", label: "A-Z" },
    { value: "updated_at", label: "Recently Updated" },
    { value: "distance", label: "Timezone Distance" },
    { value: "this_feature_is_not_implemented_yet", label: "Most Followers" },
    { value: "time", label: "Most Time Spent" }
  ]

  useEffect(() => {
    setSelectedSort(currentSort)
  }, [currentSort])

  const handleSortSelect = (sortValue) => {
    setSelectedSort(sortValue)
    setIsOpen(false)
    onSortChange(sortValue)
  }

  const getSelectedLabel = () => {
    return sortOptions.find((option) => option.value === selectedSort)?.label || "Relevance"
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-900/50 border border-gray-700/50 rounded-lg hover:border-gray-600/50 transition-all duration-200 min-w-[150px]"
      >
        <span className="text-gray-300">{getSelectedLabel()}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} text-right`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-800 transition-colors duration-150 ${
                  selectedSort === option.value ? "bg-gray-800 text-blue-400" : "text-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
