import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown'; // Assuming this is a custom dropdown component
import ThemeToggle from '@/Components/ThemeToggle'; // Re-use the common ThemeToggle
import VisitorSidebar from '@/Pages/Visitor/VisitorSidebar'; // Import the new VisitorSidebar
import { Menu, Bell, ChevronDown, AlignJustify } from 'lucide-react';
import { useThemeStore } from '../store'; // Assuming useThemeStore manages sidebar state as well

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { props } = usePage();
    const user = props.auth.user;
    const { sidebarOpen, toggleSidebar } = useThemeStore(); // Get sidebar state from store

    const [dropdownOpen, setDropdownOpen] = useState(false); // State for user dropdown

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <VisitorSidebar user={user} />

            <div className="flex-1 flex flex-col">
                {/* Top Navigation Bar */}
                <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm sticky top-0 z-40">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            {/* Left: Sidebar Toggle & Branding */}
                            <div className="flex items-center">
                                <button
                                    onClick={toggleSidebar}
                                    className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 lg:hidden"
                                    aria-label="Toggle sidebar"
                                >
                                    <AlignJustify size={20} />
                                </button>
                                <Link href="/" className="ml-4 flex-shrink-0 flex items-center">
                                    <img src="/logo.png" alt="LUZY Logo" className="h-16 w-auto" />
                                </Link>
                            </div>

                            {/* Right: User Menu & Theme Toggle */}
                            <div className="flex items-center ml-auto">
                                {/* Notifications */}
                                <button className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mr-2" aria-label="Notifications">
                                    <Bell size={20} />
                                </button>

                                <ThemeToggle />

                                {/* User Dropdown */}
                                <div className="relative ml-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                                >
                                                    <img
                                                        src={`https://i.pravatar.cc/100?u=${user?.email || 'authenticated'}`}
                                                        alt="User Avatar"
                                                        className="w-8 h-8 rounded-full object-cover mr-2"
                                                    />
                                                    {user.name}
                                                    <ChevronDown className="ml-2 -mr-0.5 h-4 w-4" />
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Page Heading */}
                {header && (
                    <header className="bg-white dark:bg-gray-800 shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
