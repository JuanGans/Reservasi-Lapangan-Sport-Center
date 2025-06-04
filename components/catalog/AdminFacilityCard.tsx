import { Facility } from "@/types/facility";

interface AdminFacilityCardProps {
  facility: Facility;
  onEdit: (facility: Facility) => void;
  onDelete: (id: number) => void;
}

const AdminFacilityCard: React.FC<AdminFacilityCardProps> = ({ facility, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow transition-transform duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:scale-105 relative">
      <img src={`/assets/field/${facility.field_image}` || "/assets/field/fallback.jpg"} alt={facility.field_name} className="w-full h-44 object-cover" />
      <div className="p-4 flex flex-col justify-between">
        <h3 className="text-blue-900 font-semibold text-lg mb-1 truncate">{facility.field_name}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{facility.field_desc}</p>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <span className="font-medium text-blue-700">Rp {parseInt(facility.price_per_session).toLocaleString("id-ID")}</span>
          <span className="flex items-center gap-1">⭐ {facility.avg_rating ? facility.avg_rating.toFixed(1) : "-"}</span>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex gap-2">
        <button onClick={() => onEdit(facility)} className="py-2 px-3 rounded-full bg-blue-500 hover:bg-blue-700 transition-all duration-300 text-white cursor-pointer">
          <i className="fas fa-edit"></i>
        </button>
        <button onClick={() => onDelete(facility.id)} className="py-2 px-3 rounded-full bg-red-500 hover:bg-red-700 transition-all duration-300 text-white cursor-pointer">
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default AdminFacilityCard;
