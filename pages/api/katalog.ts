// TEST BOOKING KATALOG
export default function handler(req, res) {
  const fields = [
    { id: 1, name: "Lapangan A", price: 100000 },
    { id: 2, name: "Lapangan B", price: 150000 },
    { id: 3, name: "Lapangan C", price: 200000 },
    { id: 4, name: "Lapangan D", price: 250000 },
    { id: 5, name: "Lapangan E", price: 300000 },
    { id: 6, name: "Lapangan F", price: 350000 },
  ];
  res.status(200).json(fields);
}
