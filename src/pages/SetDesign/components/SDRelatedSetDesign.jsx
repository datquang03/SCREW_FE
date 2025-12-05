import React from "react";

const SDRelatedDesigns = React.memo(({ currentId }) => {
  // placeholder - you can integrate real related fetch
  const dummy = Array.from({ length: 4 }).map((_, i) => ({
    id: i + "-rel",
    name: `Design ${i + 1}`,
    img: "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=800&q=60",
  }));

  return (
    <div>
      <h4 className="text-lg font-semibold">Gợi ý tương tự</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
        {dummy.map((d) => (
          <div key={d.id} className="rounded-lg overflow-hidden cursor-pointer">
            <img
              src={d.img}
              loading="lazy"
              alt={d.name}
              className="w-full h-32 object-cover"
            />
            <div className="p-2 text-sm font-medium">{d.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default SDRelatedDesigns;
