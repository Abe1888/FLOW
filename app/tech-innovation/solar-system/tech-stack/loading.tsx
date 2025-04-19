import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="w-full md:w-2/3">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full md:w-2/3" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <Skeleton className="h-10 w-full md:w-96" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex items-start border-b pb-4">
                <div className="w-1/4 pr-4">
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="w-1/4 pr-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-1/2 mt-1" />
                </div>
                <div className="w-2/4">
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
