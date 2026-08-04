export default function AssetCard({ image, title, author, type }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase text-white">
        {type}
      </span>
      <div className="p-3">
        <p className="truncate text-sm font-medium text-gray-800">{title}</p>
        <p className="truncate text-xs text-gray-500">by {author}</p>
      </div>
    </div>
  );
}
