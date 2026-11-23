import { useState } from 'react';
import { journals } from './journals';

function App() {
  const [activeJournal, setActiveJournal] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pointName, setPointName] = useState('ОстроГорячо');
  const [address, setAddress] = useState('г. Донецк, ул. Горького, 72');
  const [period, setPeriod] = useState('');
  const [responsible, setResponsible] = useState('');

  const current = journals.find(j => j.id === activeJournal)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50 print:bg-white">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-red-700 via-red-600 to-amber-500 text-white shadow-lg print:shadow-none print:bg-white print:text-black print:border-b-2 print:border-red-700">
        <div className="max-w-full mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors print:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md print:w-10 print:h-10">
              <span className="text-2xl print:text-xl">🔴</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight print:text-lg">
                ХАССП — Электронные журналы
              </h1>
              <p className="text-sm opacity-80 print:text-xs">
                {pointName} • {address}
              </p>
            </div>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-2 print:hidden">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              {journals.length} журналов
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-gray-200 shadow-xl lg:shadow-none
          transform transition-transform duration-300 print:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-red-700 text-sm uppercase tracking-wider">Навигация</h2>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <nav className="overflow-y-auto h-[calc(100vh-60px)] p-2">
            {journals.map(j => (
              <button
                key={j.id}
                onClick={() => { setActiveJournal(j.id); setSidebarOpen(false); }}
                className={`
                  w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 flex items-center gap-3
                  ${activeJournal === j.id
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md scale-[1.02]'
                    : 'hover:bg-red-50 text-gray-700 hover:text-red-700'}
                `}
              >
                <span className="text-xl shrink-0">{j.icon}</span>
                <div className="min-w-0">
                  <div className={`text-xs font-bold ${activeJournal === j.id ? 'text-amber-200' : 'text-gray-400'}`}>
                    № {j.id}
                  </div>
                  <div className="text-sm font-medium truncate">
                    {j.subtitle.split('(')[0].trim()}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 md:p-6 print:p-2">
          {/* Journal Header Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 print:shadow-none print:border print:p-2 print:mb-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{current.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-red-700 print:text-lg">{current.title}</h2>
                <p className="text-sm text-gray-500 print:text-xs">{current.subtitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 print:grid-cols-4 print:gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Точка</label>
                <input type="text" value={pointName} onChange={e => setPointName(e.target.value)}
                  className="w-full border-b border-gray-300 pb-0.5 text-sm font-medium focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Адрес</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                  className="w-full border-b border-gray-300 pb-0.5 text-sm font-medium focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Период</label>
                <input type="text" value={period} onChange={e => setPeriod(e.target.value)} placeholder="______ 202__ г."
                  className="w-full border-b border-gray-300 pb-0.5 text-sm font-medium focus:outline-none focus:border-red-500 placeholder:text-gray-300" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Ответственный</label>
                <input type="text" value={responsible} onChange={e => setResponsible(e.target.value)}
                  className="w-full border-b border-gray-300 pb-0.5 text-sm font-medium focus:outline-none focus:border-red-500" />
              </div>
            </div>
          </div>

          {/* Journal Content */}
          <div className="print:block">
            {current.component}
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-gray-400 pb-6 print:mt-4 print:pb-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-8 h-0.5 bg-red-200"></span>
              <span className="text-red-400">●</span>
              <span className="w-8 h-0.5 bg-amber-200"></span>
            </div>
            <p>Журналы ведутся в соответствии с требованиями СанПиН и ХАССП</p>
            <p className="mt-1">© {pointName} • {address}</p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
