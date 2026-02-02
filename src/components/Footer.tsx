import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

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
                <a href="mailto:info@strydpanama.com" className="hover:text-white">
                  info@strydpanama.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <a href="tel:+5076000000" className="hover:text-white">
                  +507 6000-0000
                </a>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
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
        </div>
      </div>
    </footer>
  );
}
