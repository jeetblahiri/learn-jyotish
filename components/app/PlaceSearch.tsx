"use client";

import { useId, useMemo, useState } from "react";
import { Place, searchPlaces } from "@/lib/places";
import styles from "./workspace.module.css";

export function PlaceSearch({ value, onChange }: { value?: Place; onChange: (place: Place) => void }) {
  const id = useId();
  const [query, setQuery] = useState(value ? `${value.label}, ${value.country}` : "");
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => searchPlaces(query, 10), [query]);

  return (
    <div className={styles.placeSearch}>
      <label htmlFor={id}>Birth place</label>
      <input
        id={id}
        value={query}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-results`}
        aria-autocomplete="list"
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "Enter" && open && matches[0]) {
            event.preventDefault();
            onChange(matches[0]);
            setQuery(`${matches[0].label}, ${matches[0].country}`);
            setOpen(false);
          }
        }}
      />
      {open && (
        <div id={`${id}-results`} role="listbox" className={styles.placeResults}>
          {matches.length ? matches.map((place) => (
            <button
              type="button"
              role="option"
              aria-selected={place.id === value?.id}
              key={place.id}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(place);
                setQuery(`${place.label}, ${place.country}`);
                setOpen(false);
              }}
            >
              <b>{place.label}</b>
              <span>{place.country} · {place.timeZone}</span>
            </button>
          )) : <p>No local match. Use custom coordinates in Settings.</p>}
        </div>
      )}
    </div>
  );
}
