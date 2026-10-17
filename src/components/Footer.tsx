import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              <span className="text-white">Stryd</span>
              <span className="text-orange-500">Panama</span>
            </h3>
            <p className="text-sm">
              Entrenamiento de carrera basado en potencia con tecnología Stryd.
              Únete al futuro del running en Panamá.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contacto</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>David / Boquete, Panamá</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <a
                  href="mailto:info@strydpanama.com"
                  className="hover:text-white"
                >
                  info@strydpanama.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <a href="tel:+50766714646" className="hover:text-white">
                  +507 6671-4646
                </a>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/share/1bfxKxzJxo/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/strydpanama?igsh=aGRwbHVqajc3d2J6"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2026 StrydPanama. Todos los derechos reservados.</p>
          <a
            href="https://rsanjur.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-3 text-inherit transition-colors hover:border-white/25 hover:bg-white/[0.08]"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-[#0B1220]">
              <svg width="18" height="18" viewBox="0 0 512 512" aria-hidden="true">
                <text x="256" y="340" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="252" fontWeight="800" letterSpacing="-8" fill="#FFFFFF">RS</text>
                <rect x="196" y="380" width="120" height="26" rx="13" fill="#22D3EE" />
              </svg>
            </span>
            <span className="text-left text-[11px] leading-[1.15] text-gray-400">
              hecho por
              <span className="block text-[12px] font-semibold tracking-tight text-gray-200">rsanjur.com</span>
            </span>
          </a>
          <p className="mt-1 text-xs text-gray-500">
            ¿Quieres una página así? <a href="https://rsanjur.com/#contacto" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">Escríbeme</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
