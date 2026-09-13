"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { cn } from "@/lib/utils/cn";

export interface NavDropdownLink {
  href: string;
  label: string;
}

/**
 * Minimal accessible dropdown for the desktop navbar. No menu/dropdown
 * library exists in this codebase yet (checked package.json and grepped
 * for Headless UI / Radix / a custom Menu component — none found), so this
 * is a small custom implementation rather than a new dependency.
 *
 * Opens on hover or click, closes on an outside click, Escape, or picking
 * an item. The trigger and items are real focusable elements (button +
 * anchors), so Tab already moves through them in document order; Arrow
 * keys additionally roam between items while open, matching the WAI-ARIA
 * menu button pattern closely enough for a 3-item menu without a full
 * roving-tabindex implementation.
 */
export function NavDropdown({ label, links }: { label: string; links: NavDropdownLink[] }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  function focusItem(index: number) {
    const clamped = (index + links.length) % links.length;
    itemRefs.current[clamped]?.focus();
  }

  function handleTriggerKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleItemKeyDown(e: ReactKeyboardEvent<HTMLAnchorElement>, index: number) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(index + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(index - 1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={triggerRef}
        type="button"
        className="flex items-center gap-1 text-sm font-medium text-olympiad-800 transition-colors hover:text-olympiad-500"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
      >
        {label}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-black/5 bg-white py-2 shadow-[0_10px_30px_rgb(2,16,36,0.12)]"
        >
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="block px-4 py-2 text-sm font-medium text-olympiad-800 transition-colors hover:bg-olympiad-50 hover:text-olympiad-500"
              onClick={() => setOpen(false)}
              onKeyDown={(e) => handleItemKeyDown(e, i)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
