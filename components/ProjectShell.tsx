'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FlaskConical, ArrowLeft, Menu, X } from 'lucide-react';
import { useProject } from '@/hooks/useProject';

type Props = {
  children: React.ReactNode;
  locale: string;
  projectId: string;
};

function NavItem({
  icon: Icon,
  label,
  href,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-white/15 text-white'
          : 'text-white/55 hover:bg-white/10 hover:text-white/90'
      }`}
    >
      <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
      {label}
    </Link>
  );
}

export default function ProjectShell({ children, locale, projectId }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const base = `/${locale}/projects/${projectId}`;
  const project = useProject(Number(projectId));

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: `${base}/home` },
    { icon: FlaskConical, label: 'Test Runs', href: `${base}/runs` },
  ];

  const close = () => setOpen(false);

  const sidebar = (
    <aside className="flex flex-col h-full w-64 bg-[#111111]">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-white/10 flex-shrink-0">
        <Link href={`/${locale}/projects`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src="/favicon/icon.svg" width={20} height={20} alt="" />
          <span className="text-white/70 font-medium text-xs tracking-wide uppercase">Agentic QA</span>
        </Link>
        <button className="lg:hidden text-white/50 hover:text-white p-1" onClick={close} aria-label="Close">
          <X size={15} />
        </button>
      </div>

      {/* Project name */}
      {project && (
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-1">Project</p>
          <p className="text-white font-semibold text-sm leading-snug truncate" title={project.name}>
            {project.name}
          </p>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon, label, href }) => (
          <NavItem
            key={href}
            icon={icon}
            label={label}
            href={href}
            active={pathname.startsWith(href)}
            onClick={close}
          />
        ))}
      </nav>

      <div className="px-3 pb-5 pt-3 border-t border-white/10">
        <NavItem icon={ArrowLeft} label="All Projects" href={`/${locale}/projects`} onClick={close} />
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile top bar — in document flow so it doesn't overlap content */}
      <header className="fixed top-0 left-0 right-0 h-12 bg-white border-b border-gray-200 flex items-center px-4 z-30 lg:hidden">
        <button
          className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <span className="ml-3 font-semibold text-sm text-gray-800">Agentic QA</span>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={close} />
      )}

      {/* Desktop sidebar — always visible */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex">
        {sidebar}
      </div>

      {/* Mobile sidebar — slides in */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex lg:hidden transform transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </div>

      {/* Main content — offset for desktop sidebar and mobile top bar */}
      <main className="flex-1 lg:pl-64 pt-12 lg:pt-0 min-h-screen bg-[#f5f6f8]">
        {children}
      </main>
    </div>
  );
}
