import { Link } from '@inertiajs/react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">LUZY</h3>
            <p className="text-sm leading-relaxed">
              La plateforme complète pour publier et trouver des annonces professionnelles.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ads" className="hover:text-white transition">
                  Annonces
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@Luzy.com" className="hover:text-white transition flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>nepturnelangojordan@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+33123456789" className="hover:text-white transition flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+237 658949091</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; 2025 Luzy. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="hover:text-white transition">
                Conditions d'utilisation
              </Link>
              <Link href="/privacy" className="hover:text-white transition">
                Politique de confidentialité
              </Link>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
