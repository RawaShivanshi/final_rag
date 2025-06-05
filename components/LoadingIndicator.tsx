import { Skeleton } from "./Skeleton";

export function LoadingIndicator() {
  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-[80%] bg-gradient-to-br from-[#F8EDE3] to-[#DFD3C3] p-4 rounded-2xl border border-[#C8B6A6]/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#F8EDE3] flex items-center justify-center">
            {/* Sage thinking SVG icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-10 h-10">
              <circle cx="32" cy="32" r="30" fill="#DFD3C3" />
              <path d="M32,16c-3.3,0-6,2.7-6,6v4c0,3.3,2.7,6,6,6s6-2.7,6-6v-4C38,18.7,35.3,16,32,16z" fill="#7D6E83" />
              <path d="M42,36c-1.1,0-2,0.9-2,2v2c0,4.4-3.6,8-8,8s-8-3.6-8-8v-2c0-1.1-0.9-2-2-2s-2,0.9-2,2v2c0,6.1,4.5,11.1,10.3,12v2H24 c-1.1,0-2,0.9-2,2s0.9,2,2,2h16c1.1,0,2-0.9,2-2s-0.9-2-2-2h-6.3v-2c5.8-0.9,10.3-5.9,10.3-12v-2C44,36.9,43.1,36,42,36z" fill="#A75D5D" />
              <circle cx="28" cy="24" r="2" fill="#FFF" />
              <circle cx="36" cy="24" r="2" fill="#FFF" />
            </svg>
            <div className="absolute inset-0 border-4 border-[#C8B6A6]/30 rounded-full animate-spin border-t-[#A75D5D]"></div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 bg-[#C8B6A6]/10" />
            <Skeleton className="h-4 w-32 bg-[#C8B6A6]/10" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-[#7D6E83]/70 text-sm">Consulting the ancient texts...</p>
        </div>
      </div>
    </div>
  );
}