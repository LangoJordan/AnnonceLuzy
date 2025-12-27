import { useEffect } from 'react';
import { useThemeStore } from '../store';
import Header from '../Components/Header';
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer'; // Import the Footer component

export default function AppLayout({ user, children, currentPath, withSidebar = true }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`flex min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300`}>
        {withSidebar && <Sidebar user={user} currentPath={currentPath} />}
        <div className="flex-1 flex flex-col">
            <Header user={user} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                {children}
            </main>
            <Footer /> {/* Include the Footer component here */}
        </div>
    </div>
  );
}