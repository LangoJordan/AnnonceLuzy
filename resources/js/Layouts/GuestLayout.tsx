import React, { PropsWithChildren, useState } from 'react';
import { Link } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';
import { Menu, X } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Accueil', href: '/' },
        { name: 'Annonces', href: '/ads' },
        { name: 'Agences', href: '/agencies' }, // Assuming a public list of agencies
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            {/* Navigation Bar */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center">
                                <img src="/logo.png" alt="LUZY Logo" className="h-16 w-auto" />
                            </Link>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <ThemeToggle />
                            <Link
                                href={route('login')}
                                className="ml-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                            >
                                Connexion
                            </Link>
                            <Link
                                href={route('register')}
                                className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                            >
                                Inscription
                            </Link>
                        </div>
                        <div className="-mr-2 flex items-center sm:hidden">
                            <ThemeToggle />
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 ml-2"
                            >
                                <span className="sr-only">Open main menu</span>
                                {mobileMenuOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden bg-white dark:bg-gray-800 pb-4">
                        <div className="space-y-1 pt-2 pb-3">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
                            <div className="mt-3 space-y-1">
                                <Link
                                    href={route('login')}
                                    className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    Inscription
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Page Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </div>
    );
}
