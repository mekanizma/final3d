/** @type {import('@/types').Order[]} */
export const initialOrders = [
  {
    id: "ord-1",
    customerName: "Ahmet Yılmaz",
    phone: "+90 533 123 4567",
    address: "Lefkoşa, KKTC – Gönyeli Mah. No:12",
    items: [
      {
        productId: "prod-1",
        productName: "Creality Ender 3 V3 SE",
        quantity: 1,
        price: 8990,
      },
    ],
    note: "Akşam saatlerinde teslim edilebilir.",
    paymentMethod: "kapida-odeme",
    status: "hazirlaniyor",
    total: 8990,
    createdAt: "2025-05-10T14:30:00Z",
  },
  {
    id: "ord-2",
    customerName: "Zeynep Korkmaz",
    phone: "+90 542 987 6543",
    address: "Girne, KKTC – Alsancak Cad. No:45",
    items: [
      {
        productId: "prod-3",
        productName: "Dragon Figürin – Premium PLA",
        quantity: 2,
        price: 450,
      },
      {
        productId: "prod-5",
        productName: "PLA Filament – Neon Mavi 1kg",
        quantity: 3,
        price: 320,
      },
    ],
    paymentMethod: "kapida-odeme",
    status: "yeni",
    total: 1860,
    createdAt: "2025-05-15T09:15:00Z",
  },
  {
    id: "ord-3",
    customerName: "Mehmet Demir",
    phone: "+90 548 111 2233",
    address: "Mağusa, KKTC – Maraş Cad. No:8",
    items: [
      {
        productId: "prod-2",
        productName: "Bambu Lab A1 Mini Combo",
        quantity: 1,
        price: 15490,
      },
    ],
    paymentMethod: "kapida-odeme",
    status: "kargoda",
    total: 15490,
    createdAt: "2025-05-12T16:45:00Z",
  },
];
