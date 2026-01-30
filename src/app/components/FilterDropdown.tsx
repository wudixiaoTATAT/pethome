import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
  emoji?: string;
}

interface FilterDropdownProps {
  icon: React.ReactNode;
  label: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export function FilterDropdown({ icon, label, options, selectedValue, onSelect }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get selected option label
  const selectedOption = options.find(opt => opt.value === selectedValue);
  const displayLabel = selectedOption?.value === 'all' ? label : selectedOption?.label || label;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all shadow-md hover:shadow-lg group ${
          selectedValue !== 'all'
            ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-amber-200'
            : 'bg-white text-muted-foreground hover:bg-accent'
        }`}
      >
        <span className={selectedValue !== 'all' ? 'text-white' : 'text-amber-600'}>{icon}</span>
        <span className="font-medium">{displayLabel}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-border overflow-hidden z-20 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200"
          onMouseLeave={() => setIsOpen(false)}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-5 py-3 text-left transition-colors flex items-center gap-2 ${
                selectedValue === option.value
                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 font-medium'
                  : 'hover:bg-accent text-muted-foreground'
              }`}
            >
              {option.emoji && <span className="text-lg">{option.emoji}</span>}
              <span>{option.label}</span>
              {selectedValue === option.value && (
                <span className="ml-auto text-amber-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
