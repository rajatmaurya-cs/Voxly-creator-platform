'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import {AuthContext} from '../../ContextProvider/AuthProvider'
import {
  Home,
  SquarePlus,
  BookCheck,
  MessageCircleMore,
} from 'lucide-react'

import clsx from 'clsx'
import { useContext } from 'react'

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

  const {user} = useContext(AuthContext) as any

  

  const pathname = usePathname()

  return (
   <aside className="flex h-screen w-72 flex-col border-r border-zinc-800 bg-[#0a0a0a] px-5 py-6 text-white">

      {/* LOGO */}
      <div className="mb-10">

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center  transition-opacity hover:opacity-90 group"
          >
            <div className="relative w-25 h-25 shrink-0">
              <Image
                src="/pixel.png"
                alt="Veyra Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span
              className="text-2xl font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-200 via-white to-violet-400 bg-clip-text text-transparent"
              style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.15em" }}
            >
              Veyra
            </span>
          </Link>
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

      {/* Avatar */}
      <div className="h-11 w-11 rounded-full p-[2px] bg-white/80">
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt="Profile"
            width={44}
            height={44}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
            {user?.name?.charAt(0)}
          </div>
        )}
      </div>

      {/* Text */}
      <div>
        <h3 className="text-sm font-semibold text-white">
          {user?.name}
        </h3>
        <p className="text-xs text-zinc-500">
          Manage your platform
        </p>
      </div>

    </div>

  </div>
</div>

    </aside>
  )
}

export default Sidebar