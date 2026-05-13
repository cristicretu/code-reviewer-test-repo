import { useEffect, useState } from "react";

type Item = { id: string; name: string; price: number };

export function Cart({ userId }: { userId: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetch(`/api/cart/${userId}`)
      .then((r) => r.json())
      .then(setItems);
  }, []);

  function addItem(item: Item) {
    items.push(item);
    setItems(items);
  }

  function applyDiscount(code: string) {
    setTimeout(() => {
      if (code === "SAVE10") {
        setDiscount(discount + 10);
      }
    }, 500);
  }

  const total = items.reduce((s, i) => s + i.price, 0) - discount;

  return (
    <div>
      <h2>Cart for {userId}</h2>
      {items.map((it) => (
        <div>{it.name} — ${it.price}</div>
      ))}
      <button onClick={() => addItem({ id: "1", name: "Widget", price: 9.99 })}>
        Add Widget
      </button>
      <input onChange={(e) => applyDiscount(e.target.value)} />
      <p>Total: ${total}</p>
    </div>
  );
}
