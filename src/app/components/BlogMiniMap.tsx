"use client";

import { useEffect, useState } from "react";

export default function BlogMiniMap() {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    const headers = [...document.querySelectorAll("h2, h3")];
    setItems(
      headers.map(h => ({
        id: h.id,
        text: h.textContent || "",
      }))
    );
  }, []);

  return (
    <aside className="w-56 border-l p-4 h-screen overflow-y-auto sticky top-0">
      <h2 className="font-semibold mb-3">Minimap</h2>
      <ul className="space-y-1 text-sm">
        {items.map(h => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="hover:text-blue-600">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}