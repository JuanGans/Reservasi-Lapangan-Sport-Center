import { Facility } from "@/types/facility";

interface MemberFacilityCardProps {
  facility: Facility;
  onClick: (id: number) => void;
}

const MemberFacilityCard: React.FC<MemberFacilityCardProps> = ({ facility, onClick }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow transition-transform duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:scale-105" onClick={() => onClick(facility.id)}>
      <img src={`/assets/field/${facility.field_image}` || "/assets/field/fallback.jpg"} alt={facility.field_name} className="w-full h-44 object-cover" />
      <div className="p-4 flex flex-col justify-between">
        <h3 className="text-blue-900 font-semibold text-lg mb-1 truncate">{facility.field_name}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{facility.field_desc}</p>

        <div className="flex items-center justify-between text-sm text-gray-700">
          <span className="font-medium text-blue-700">Rp {parseInt(facility.price_per_session).toLocaleString("id-ID")}</span>
          <span className="flex items-center gap-1">⭐ {facility.avg_rating ? facility.avg_rating.toFixed(1) : "-"}</span>
        </div>
      </div>
    </div>
  );
};

export default MemberFacilityCard;
