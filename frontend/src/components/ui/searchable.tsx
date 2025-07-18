import React, { useState, useEffect } from "react";
import { Input } from "./input";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { useDebounce } from "../../hooks/debounce";
import { fetcher } from "../../lib/fetcher";
import { showToast } from "../Toaster";
import type { User } from "../../utils/types";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string; // selected ID
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchableSelect = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
  initialLabel,
}: SearchableSelectProps) => {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");

  const debouncedSearch = useDebounce(async (query: string): Promise<void> => { 
    try {
      setLoading(true);
      const response: { data: User[] } = await fetcher(`/users/search?q=${query}`);
      const mapped: Option[] = response.data.map((user: User) => ({
        value: user.id,
        label: user.full_name, 
      }));
      setOptions(mapped);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed", "error");
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    if (open && search.trim().length > 0) {
      debouncedSearch(search);
    } else {
      setOptions([]);
    }
    return () => {
      setOptions([]);
    }
  }, [search, open]);

   useEffect(() => {
    if (value && initialLabel) {
      setSelectedLabel(initialLabel);
    }
  }, [value, initialLabel]);


  const handleSelect = (option: Option) => {
    onChange(option.value); 
    setSelectedLabel(option.label);
    setSearch(""); 
    setOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={open ? search : selectedLabel}
            placeholder={placeholder}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {open && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
              {loading ? (
                <div className="p-2 text-sm">Loading...</div>
              ) : options.length === 0 ? (
                <div className="p-2 text-sm">No users found</div>
              ) : (
                <ul className="max-h-60 overflow-auto py-1">
                  {options.map((item) => (
                    <li
                      key={item.value}
                      className={cn(
                        "flex cursor-pointer items-center px-2 py-1.5 text-sm hover:bg-accent",
                        value === item.value && "bg-accent"
                      )}
                      onMouseDown={() => handleSelect(item)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
