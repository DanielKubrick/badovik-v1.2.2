"use client";
import { Badge } from "@/components/ui/badge";

export default function CategoryBar(
  { cats, active, onPick }:
  { cats: {id: number; name: string}[]; active?: number; onPick: (id?: number) => void }
) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
      <Badge 
        onClick={() => onPick(undefined)} 
        variant={active ? "outline" : "default"}
        className={`cursor-pointer whitespace-nowrap transition-all hover:scale-105 ${
          !active 
            ? "gradient-primary text-white border-0 shadow-sm" 
            : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
        }`}
      >
        Все
      </Badge>
      
      {cats.map(c => (
        <Badge 
          key={c.id} 
          onClick={() => onPick(c.id)}
          variant={active === c.id ? "default" : "outline"}
          className={`cursor-pointer whitespace-nowrap transition-all hover:scale-105 ${
            active === c.id 
              ? "gradient-primary text-white border-0 shadow-sm" 
              : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
          }`}
        >
          {c.name}
        </Badge>
      ))}
    </div>
  );
}
