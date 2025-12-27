import { useThemeStore } from '../store';
import Header from '../Components/Header';
import AgencySidebar from '../Pages/Agency/AgencySidebar';

export default function AgencyLayout({ user, children }) {
  const { theme } = useThemeStore();

  return (
    <div className={`flex h-screen flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-gray-900'}`}>
      <Header user={user} />

      <div className="flex flex-1 overflow-hidden">
        <AgencySidebar user={user} />

        <main className="flex-1 overflow-y-auto pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
