import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
// Import logo from assets
import logoImage from '@/assets/astro.svg' // Placeholder current logo

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/coach', label: 'Coach & Método' },
    { path: '/team', label: 'Nuestro Team' },
    { path: '/calendario', label: 'Calendario' },
    { path: '/carreras', label: 'Carreras' },
    { path: '/strydboard', label: 'StrydBoard' },
    {
      path: 'https://tshirt-stryd.ricardosanjurg.workers.dev',
      label: 'Tienda',
    },
    { path: '/blog', label: 'Blog' },
    { path: '/galeria', label: 'Galería' },
  ]

  // In Astro, we can't use useLocation() in the same way in a client component easily without passing it.
  // We'll handle active state differently or just keep it simple for now.

  return (
    <nav className="bg-black/95 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src="/logo.png" alt="Stryd Panamá" className="h-12 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                target={link.path.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.path.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                target={link.path.startsWith('http') ? '_blank' : undefined}
                rel={
                  link.path.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
