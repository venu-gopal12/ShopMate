// Skeleton Loader Component
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden ring-1 ring-black/5 animate-pulse">
      {/* Image Skeleton */}
      <div className="bg-gray-200 h-56 w-full"></div>
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
