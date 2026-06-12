'use client'
import { apiFetch } from '@/lib/apiFetch'
import { useQuery } from '@tanstack/react-query'
import {
  FileText,
  MessageSquare,
  FileClock,
  AlertCircle,
} from 'lucide-react'
import { StatusSkeleton } from '../loading'

export default function StatusClient() {


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard-data'],

    queryFn: async () => {
      
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/BlogDashboard`,{
          credentials: "include"
        }

      )

      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const json = await res.json()

      if (!json.success) {
        throw new Error(
          json.message || 'Failed to load dashboard data'
        )
      }

      return {
        totalBlogs: json.stats.totalBlogs,
        totalComments: json.stats.totalComments,
        draftBlogs: json.stats.draftBlogs,
      }
    },

    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

  const wrapper = 'w-full max-w-2xl mx-auto'

  if (isLoading) {
    return <StatusSkeleton />
  }

  if (isError) {
    return (
      <div className={wrapper}>
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-2.5 text-sm font-medium text-red-400 backdrop-blur-md">
            <AlertCircle className="h-4 w-4" />
            <p>{error?.message || 'Failed to load system metrics.'}</p>
          </div>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Blogs',
      value: data?.totalBlogs ?? 0,
      icon: FileText,

      iconClass:
        'text-sky-300 border-sky-500/20 bg-gradient-to-br from-sky-500/20 via-blue-500/10 to-cyan-500/20 shadow-[0_0_25px_rgba(56,189,248,0.18)]',
    },

    {
      title: 'Total Comments',
      value: data?.totalComments ?? 0,
      icon: MessageSquare,

      iconClass:
        'text-fuchsia-300 border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/20 via-pink-500/10 to-violet-500/20 shadow-[0_0_25px_rgba(217,70,239,0.18)]',
    },

    {
      title: 'Draft Blogs',
      value: data?.draftBlogs ?? 0,
      icon: FileClock,

      iconClass:
        'text-amber-200 border-amber-500/20 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/20 shadow-[0_0_25px_rgba(251,191,36,0.18)]',
    },
  ]

  return (
    <div className={wrapper}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-950/50 p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-zinc-700/80 hover:bg-zinc-900/50"
            >
              {/* subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                    {stat.title}
                  </p>

                  <h3 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                    {stat.value.toLocaleString()}
                  </h3>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-0.5 ${stat.iconClass}`}
                >
                  <Icon className="h-5 w-5 stroke-[2]" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}