'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  SquarePlus,
  BookCheck,
  MessageCircleMore,
} from 'lucide-react'

import clsx from 'clsx'

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: Home,
  },

  {
    label: 'Write Story',
    href: '/admin/generateblog',
    icon: SquarePlus,
  },

  {
    label: 'Publications',
    href: '/admin/bloglist',
    icon: BookCheck,
  },

  {
    label: 'Discussions',
    href: '/admin/commentslist',
    icon: MessageCircleMore,
  },
]

const Sidebar = () => {

  const pathname = usePathname()

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-zinc-800 bg-[#0a0a0a] px-5 py-6 text-white">

      {/* LOGO */}
      <div className="mb-10">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
            <BookCheck className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Postify
            </h1>

            <p className="text-xs font-medium text-zinc-500">
              AI Blogging Platform
            </p>
          </div>

        </div>

      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-3">

        {navItems.map((item) => {

          const Icon = item.icon

          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'group relative overflow-hidden rounded-2xl border px-4 py-3 transition-all duration-300',
                
                isActive
                  ? 'border-blue-500/20 bg-gradient-to-r from-blue-500/15 to-purple-500/10 shadow-lg shadow-blue-500/10'
                  : 'border-transparent bg-zinc-900/40 hover:border-zinc-800 hover:bg-zinc-900'
              )}
            >

              {/* HOVER GLOW */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/5 blur-2xl" />
              </div>

              <div className="relative z-10 flex items-center gap-4">

                {/* ICON */}
                <div
                  className={clsx(
                    'flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300',

                    isActive
                      ? 'border-blue-500/20 bg-blue-500/10'
                      : 'border-zinc-800 bg-zinc-900'
                  )}
                >

                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.4 : 2}
                    className={clsx(
                      isActive
                        ? 'text-blue-400'
                        : 'text-zinc-500 group-hover:text-zinc-300'
                    )}
                  />

                </div>

                {/* TEXT */}
                <div className="flex flex-col">

                  <span
                    className={clsx(
                      'text-sm transition-colors duration-300',

                      isActive
                        ? 'font-bold text-white'
                        : 'font-medium text-zinc-400 group-hover:text-zinc-200'
                    )}
                  >
                    {item.label}
                  </span>

                  <span
                    className={clsx(
                      'text-xs',

                      isActive
                        ? 'text-blue-400'
                        : 'text-zinc-600'
                    )}
                  >
                    {isActive ? 'Current Page' : 'Navigate'}
                  </span>

                </div>

              </div>

            </Link>
          )
        })}

      </nav>

      {/* FOOTER */}
      <div className="mt-auto">

        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 shadow-xl">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
              P
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Postify Admin
              </h3>

              <p className="text-xs text-zinc-500">
                Manage your platform
              </p>
            </div>

          </div>

          <div className="h-[5px] overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
          </div>

        </div>

      </div>

    </aside>
  )
}

export default Sidebar