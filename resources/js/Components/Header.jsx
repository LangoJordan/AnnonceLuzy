import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { Menu, X, ChevronDown, User, LogOut, PlusCircle, Sun, Moon, Search, Bell, MessageSquare, Heart } from 'lucide-react';
import { useThemeStore } from '../store';

export default function Header({ user }) {
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showFavoritesMenu, setShowFavoritesMenu] = useState(false);

  const navLinks = [
    { name: 'Annonces', href: '/ads' },
    { name: 'Catégories', href: '/#categories' },
    { name: 'Comment ça marche', href: '/#how-it-works' },
  ];

  const legalLinks = [
    { name: 'Confidentialité', href: '/privacy' },
    { name: 'Conditions', href: '/terms' },
    { name: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [theme]);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-lg border-b ${theme === 'dark' ? 'border-slate-700/30' : 'border-gray-200'}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5" aria-label="Global">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <img src="/logo.png" alt="LUZY Logo" className="h-16 w-auto" />
          <span className={`text-xl font-bold transition-colors duration-200 ${
            theme === 'dark'
              ? 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500'
              : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'
          }`}>
            LUZY
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {link.name}
            </a>
          ))}

          {/* Info Links */}
          <div className="relative group ml-2">
            <button className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
              theme === 'dark'
                ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}>
              Infos
            </button>
            <div className={`absolute left-0 mt-0 w-48 rounded-lg shadow-lg border hidden group-hover:block z-50 ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-gray-200'
            }`}>
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-2 text-xs font-semibold transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

       

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Theme */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Favorites */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowFavoritesMenu(!showFavoritesMenu)}
                className={`p-2 rounded-lg transition-all duration-200 relative hidden sm:block ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-red-500 hover:text-red-600'
                }`}
              >
                <Heart className="w-4 h-4" />
              </button>

              {showFavoritesMenu && (
                <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-gray-200'
                } overflow-hidden z-50`}>
                  <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                    <p className={`text-xs font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                      Mes favoris
                    </p>
                  </div>

                  <div className="py-1.5">
                    <Link
                      href="/favoris"
                      onClick={() => setShowFavoritesMenu(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      Voir mes favoris
                    </Link>
                    <Link
                      href="/historique"
                      onClick={() => setShowFavoritesMenu(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      📊 Historique
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

    

         

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 ${
                  userMenuOpen
                    ? theme === 'dark'
                      ? 'bg-slate-800'
                      : 'bg-gray-100'
                    : 'hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <img
                  src={user?.profile?.photo || `https://i.pravatar.cc/100?u=${user?.email || 'user'}`}
                  alt="avatar"
                  className={`w-7 h-7 rounded-md border transition-all duration-200 ${theme === 'dark' ? 'border-slate-600' : 'border-gray-300'}`}
                  onError={(e) => {
                    e.target.src = `https://i.pravatar.cc/100?u=${user?.email || 'user'}`;
                  }}
                />
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 hidden sm:block ${userMenuOpen ? 'rotate-180' : ''} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>

              {userMenuOpen && (
                <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-lg border ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-gray-200'
                } overflow-hidden z-50`}>
                  <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                    <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1.5 space-y-0.5">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      Mon compte
                    </Link>
                    <Link
                      href="/favorites"
                      onClick={() => setUserMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      ❤️ Mes favoris
                    </Link>
                    <Link
                      href="/my-ads"
                      onClick={() => setUserMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      📝 Mes annonces
                    </Link>

                    <div className={`my-1 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}></div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        router.post(route('logout'));
                      }}
                      className={`w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'text-red-400 hover:bg-slate-700'
                          : 'text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-3 py-2 rounded-lg bg-purple-600 text-white font-semibold text-xs hover:bg-purple-700 transition-all duration-200"
              >
                S'inscrire
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-gray-400'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-t ${theme === 'dark' ? 'border-slate-700/30 bg-slate-800/50' : 'border-gray-200 bg-gray-50/50'} backdrop-blur-sm`}>
          <div className="px-4 sm:px-6 py-3 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg font-semibold text-xs transition-colors duration-200 ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-slate-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Infos Links */}
            <div className={`border-t my-2 pt-2 ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
              <p className={`text-xs font-bold px-3 py-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Infos</p>
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg font-semibold text-xs transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-white hover:bg-slate-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
