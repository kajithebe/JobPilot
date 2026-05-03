// Base skeleton block
const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Dashboard stats skeleton
export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <SkeletonBlock className="w-10 h-10 rounded-lg mb-3" />
        <SkeletonBlock className="h-3 w-24" />
      </div>
    ))}
  </div>
);

// Kanban board skeleton
export const KanbanSkeleton = () => (
  <div className="flex gap-4 overflow-x-auto pb-4">
    {Array.from({ length: 6 }).map((_, col) => (
      <div key={col} className="flex-shrink-0 w-72">
        <div className="flex items-center gap-2 mb-3">
          <SkeletonBlock className="h-4 w-20" />
          <SkeletonBlock className="h-5 w-6 rounded-full" />
        </div>
        <div className="bg-gray-50 rounded-xl p-2 space-y-2 min-h-[200px]">
          {Array.from({ length: col === 0 ? 3 : col === 1 ? 2 : 1 }).map((_, card) => (
            <div key={card} className="bg-white border border-gray-200 rounded-xl p-4">
              <SkeletonBlock className="h-4 w-32 mb-2" />
              <SkeletonBlock className="h-3 w-24 mb-3" />
              <SkeletonBlock className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Resume version list skeleton
export const VersionListSkeleton = () => (
  <div className="space-y-3 px-5 py-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="border border-gray-200 rounded-xl p-4">
        <SkeletonBlock className="h-4 w-36 mb-2" />
        <SkeletonBlock className="h-3 w-24 mb-2" />
        <SkeletonBlock className="h-3 w-20" />
      </div>
    ))}
  </div>
);

// Resume list skeleton
export const ResumeListSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
        <SkeletonBlock className="h-4 w-32 mb-2" />
        <SkeletonBlock className="h-3 w-24 mb-2" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
    ))}
  </div>
);

// Interview list skeleton
export const InterviewListSkeleton = () => (
  <div className="space-y-3 w-80">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
        <SkeletonBlock className="h-4 w-28 mb-2" />
        <SkeletonBlock className="h-3 w-20 mb-3" />
        <SkeletonBlock className="h-3 w-32" />
      </div>
    ))}
  </div>
);

export default SkeletonBlock;
