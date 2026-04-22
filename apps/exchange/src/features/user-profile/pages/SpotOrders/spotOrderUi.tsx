interface DropdownChevronProps {
  open: boolean;
}

export function DropdownChevron({ open }: DropdownChevronProps) {
  return (
    <svg
      className={`so-dd__chevSvg ${open ? "so-dd__chevSvg--open" : ""}`}
      width="14"
      height="14"
      viewBox="0 0 12 12"
      aria-hidden="true"
    >
      <path
        d="M2.5 4.25L6 7.75L9.5 4.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  id: string;
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  menuKey: string;
  openKey: string | null;
  onOpenToggle: (key: string | null) => void;
}

export function CustomDropdown({
  id,
  label,
  value,
  options,
  onChange,
  menuKey,
  openKey,
  onOpenToggle,
}: CustomDropdownProps) {
  const open = openKey === menuKey;
  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div className={`so-dd ${open ? "is-open" : ""}`} data-so-dropdown>
      <label className="so-dd__label" htmlFor={id} id={`${id}-lbl`}>
        {label}
      </label>
      <button
        type="button"
        id={id}
        className={`so-dd__trigger ${open ? "is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-lbl`}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onOpenToggle(open ? null : menuKey);
        }}
      >
        <span className="so-dd__value">{selected.label}</span>
        <DropdownChevron open={open} />
      </button>
      {open ? (
        <ul className="so-dd__menu so-dd__menu--tiles" role="listbox">
          {options.map((o) => (
            <li key={o.value} className="so-dd__menuItem" role="none">
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                className={`so-dd__option so-dd__option--tile ${o.value === value ? "is-selected" : ""}`}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(o.value);
                  onOpenToggle(null);
                }}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
