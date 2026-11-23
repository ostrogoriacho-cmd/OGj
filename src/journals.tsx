import { useState, ReactNode } from 'react';

// ============ TYPES ============
export interface JournalDef {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  norms: string[];
  component: ReactNode;
}

// ============ SHARED UI ============
function NormBanner({ norms }: { norms: string[] }) {
  return (
    <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-4 print:bg-white print:border print:p-2">
      <div className="flex flex-wrap items-start gap-2 text-sm print:text-xs">
        <span className="font-bold text-red-700 shrink-0">⚠️ Нормы / Критические пределы:</span>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {norms.map((n, i) => (
            <li key={i} className="text-gray-700">• {n}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function JournalHeader({ title, subtitle, icon, pointName, address, period, responsible, setPointName, setAddress, setPeriod, setResponsible, showResponsible = true }: {
  title: string; subtitle: string; icon: string;
  pointName: string; address: string; period: string; responsible: string;
  setPointName: (v: string) => void; setAddress: (v: string) => void;
  setPeriod: (v: string) => void; setResponsible: (v: string) => void;
  showResponsible?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 print:shadow-none print:border print:p-2">
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
        <span className="text-2xl">{icon}</span>
        <div>
          <h2 className="text-lg font-bold text-red-700 print:text-base">{title}</h2>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 print:grid-cols-4 print:gap-2">
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Точка</label>
          <input type="text" value={pointName} onChange={(e) => setPointName(e.target.value)}
            className="w-full border-b border-gray-300 pb-0.5 text-sm font-medium focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Адрес</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
            className="w-full border-b border-gray-300 pb-0.5 text-sm font-medium focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Период</label>
          <input type="text" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="______ 202__ г."
            className="w-full border-b border-gray-300 pb-0.5 text-sm font-medium focus:outline-none focus:border-red-500 placeholder:text-gray-300" />
        </div>
        {showResponsible && (
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Ответственный</label>
            <input type="text" value={responsible} onChange={(e) => setResponsible(e.target.value)}
              className="w-full border-b border-gray-300 pb-0.5 text-sm font-medium focus:outline-none focus:border-red-500" />
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButtons({ onAdd, onPrint, total, violations }: { onAdd: () => void; onPrint: () => void; total: number; violations: number }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 print:hidden">
      <button onClick={onAdd}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
        <span>➕</span> Добавить запись
      </button>
      <button onClick={onPrint}
        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
        <span>🖨️</span> Печать
      </button>
      <div className="ml-auto flex items-center gap-3 text-sm text-gray-600">
        <span>Записей: <strong>{total}</strong></span>
        {violations > 0 && <span>Отклонений: <strong className="text-red-600">{violations}</strong></span>}
      </div>
    </div>
  );
}

function Modal({ show, onClose, title, children }: { show: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-red-700">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

function TableWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print:shadow-none">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

const thCls = "px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider text-white print:px-2 print:py-1 print:text-black";
const tdCls = "px-3 py-2.5 text-sm print:px-2 print:py-1";

// ============ JOURNAL 1 ============
function Journal1() {
  const [records, setRecords] = useState([
    { id: 1, date: '10.08', time: '09:00', fridge1: '+3,5', fridge2: '+4,0', freezer: '−19', saladette: '+5', signature: 'Иванов', notes: 'Норма' },
    { id: 2, date: '10.08', time: '15:00', fridge1: '+4,0', fridge2: '+4,2', freezer: '−18', saladette: '+5', signature: 'Петров', notes: 'Норма' },
    { id: 3, date: '10.08', time: '21:00', fridge1: '+3,8', fridge2: '+4,1', freezer: '−19', saladette: '+6', signature: 'Сидоров', notes: 'Норма' },
    { id: 4, date: '11.08', time: '09:00', fridge1: '+6,5', fridge2: '+4,0', freezer: '−18', saladette: '+5', signature: 'Иванов', notes: '*Неисправен, продукты перемещены' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({ date: '', time: '', fridge1: '', fridge2: '', freezer: '', saladette: '', signature: '', notes: '' });

  const pT = (v: string) => { const c = v.replace(/[°\s]/g, '').replace(',', '.').replace('−', '-').replace('–', '-'); const n = parseFloat(c); return isNaN(n) ? null : n; };
  const chkF = (v: string) => { const n = pT(v); return n === null ? true : n >= 0 && n <= 5; };
  const chkFr = (v: string) => { const n = pT(v); return n === null ? true : n <= -18; };
  const chkS = (v: string) => { const n = pT(v); return n === null ? true : n <= 6; };
  const cellCls = (v: string, ok: boolean) => ok ? 'text-green-700' : 'text-red-600 font-bold bg-red-50';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) setRecords(records.map(r => r.id === editId ? { ...f, id: editId } : r));
    else setRecords([...records, { ...f, id: Date.now() }]);
    setF({ date: '', time: '', fridge1: '', fridge2: '', freezer: '', saladette: '', signature: '', notes: '' });
    setEditId(null); setShowForm(false);
  };

  const violations = records.filter(r => !chkF(r.fridge1) || !chkF(r.fridge2) || !chkFr(r.freezer) || !chkS(r.saladette)).length;

  return (
    <>
      <NormBanner norms={['Холодильники: 0…+5 °C', 'Морозильник: ≤ −18 °C', 'Салатетта: ≤ +6 °C', 'Заполнять 2 раза в смену']} />
      <ActionButtons onAdd={() => { setEditId(null); setF({ date: '', time: '', fridge1: '', fridge2: '', freezer: '', saladette: '', signature: '', notes: '' }); setShowForm(true); }}
        onPrint={() => window.print()} total={records.length} violations={violations} />
      <TableWrapper>
        <table className="w-full text-sm">
          <thead><tr className="bg-gradient-to-r from-red-700 to-red-800 print:bg-red-50 print:border-b-2 print:border-red-700">
            <th className={thCls}>№</th><th className={thCls}>Дата</th><th className={thCls}>Время</th>
            <th className={`${thCls} text-center`}><div>Хол. №1</div><div className="text-[10px] font-normal opacity-75">(сырьё)</div></th>
            <th className={`${thCls} text-center`}><div>Хол. №2</div><div className="text-[10px] font-normal opacity-75">(готовое)</div></th>
            <th className={`${thCls} text-center`}>Морозильник</th><th className={`${thCls} text-center`}>Салатетта</th>
            <th className={thCls}>Подпись</th><th className={thCls}>Замечания</th>
            <th className={`${thCls} text-center print:hidden`}>⚙</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r, i) => {
              const f1 = chkF(r.fridge1), f2 = chkF(r.fridge2), fr = chkFr(r.freezer), s = chkS(r.saladette);
              const bad = !f1 || !f2 || !fr || !s;
              return (<tr key={r.id} className={`${bad ? 'bg-red-50/50' : i % 2 ? 'bg-gray-50/30' : ''} hover:bg-gray-50`}>
                <td className={`${tdCls} text-gray-500 text-xs`}>{i + 1}</td>
                <td className={`${tdCls} font-medium`}>{r.date}</td>
                <td className={`${tdCls} text-gray-600`}>{r.time}</td>
                <td className={`${tdCls} text-center font-mono font-medium ${cellCls(r.fridge1, f1)}`}>{r.fridge1}{!f1 && ' ⚠️'}</td>
                <td className={`${tdCls} text-center font-mono font-medium ${cellCls(r.fridge2, f2)}`}>{r.fridge2}{!f2 && ' ⚠️'}</td>
                <td className={`${tdCls} text-center font-mono font-medium ${cellCls(r.freezer, fr)}`}>{r.freezer}{!fr && ' ⚠️'}</td>
                <td className={`${tdCls} text-center font-mono font-medium ${cellCls(r.saladette, s)}`}>{r.saladette}{!s && ' ⚠️'}</td>
                <td className={tdCls}>{r.signature}</td>
                <td className={`${tdCls} text-xs ${bad ? 'text-red-600 font-medium' : 'text-gray-500'}`}>{r.notes}</td>
                <td className={`${tdCls} text-center print:hidden`}>
                  <button onClick={() => { setF({ date: r.date, time: r.time, fridge1: r.fridge1, fridge2: r.fridge2, freezer: r.freezer, saladette: r.saladette, signature: r.signature, notes: r.notes }); setEditId(r.id); setShowForm(true); }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">✏️</button>
                  <button onClick={() => setRecords(records.filter(x => x.id !== r.id))}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">🗑️</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
      </TableWrapper>
      <Modal show={showForm} onClose={() => setShowForm(false)} title={editId ? '✏️ Редактировать' : '➕ Новая запись'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Дата</label><input className={inputCls} value={f.date} onChange={e => setF({ ...f, date: e.target.value })} required /></div>
            <div><label className={labelCls}>Время</label><input className={inputCls} value={f.time} onChange={e => setF({ ...f, time: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Хол. №1 (сырьё) <span className="text-xs text-gray-400">(0…+5°C)</span></label><input className={inputCls} value={f.fridge1} onChange={e => setF({ ...f, fridge1: e.target.value })} required /></div>
            <div><label className={labelCls}>Хол. №2 (готовое) <span className="text-xs text-gray-400">(0…+5°C)</span></label><input className={inputCls} value={f.fridge2} onChange={e => setF({ ...f, fridge2: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Морозильник <span className="text-xs text-gray-400">(≤ −18°C)</span></label><input className={inputCls} value={f.freezer} onChange={e => setF({ ...f, freezer: e.target.value })} required /></div>
            <div><label className={labelCls}>Салатетта <span className="text-xs text-gray-400">(≤ +6°C)</span></label><input className={inputCls} value={f.saladette} onChange={e => setF({ ...f, saladette: e.target.value })} required /></div>
          </div>
          <div><label className={labelCls}>Подпись</label><input className={inputCls} value={f.signature} onChange={e => setF({ ...f, signature: e.target.value })} required /></div>
          <div><label className={labelCls}>Замечания</label><textarea className={inputCls} rows={2} value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium text-sm">{editId ? 'Сохранить' : 'Добавить'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm">Отмена</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ============ JOURNAL 2 ============
function Journal2() {
  const [records, setRecords] = useState([
    { id: 1, date: '10.08', time: '09:00', bath1: 'Заменено 09.08', bath2: 'Заменено 09.08', quality: 'Светлое, без запаха', pk: '18', signature: 'Иванов', replacement: '—', repSign: '—' },
    { id: 2, date: '10.08', time: '20:00', bath1: 'Процежено', bath2: 'Процежено', quality: 'Норма', pk: '22', signature: 'Сидоров', replacement: '—', repSign: '—' },
    { id: 3, date: '11.08', time: '09:00', bath1: 'Замена', bath2: 'Замена', quality: 'Темное, дымит', pk: '27', signature: 'Иванов', replacement: '11.08, 09:30', repSign: 'Упр.' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({ date: '', time: '', bath1: '', bath2: '', quality: '', pk: '', signature: '', replacement: '', repSign: '' });

  const checkPK = (v: string) => { const n = parseFloat(v.replace(',', '.')); return isNaN(n) ? true : n <= 25; };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) setRecords(records.map(r => r.id === editId ? { ...f, id: editId } : r));
    else setRecords([...records, { ...f, id: Date.now() }]);
    setF({ date: '', time: '', bath1: '', bath2: '', quality: '', pk: '', signature: '', replacement: '', repSign: '' });
    setEditId(null); setShowForm(false);
  };

  const violations = records.filter(r => !checkPK(r.pk)).length;

  return (
    <>
      <NormBanner norms={['Замена при: потемнении, пене, дыме, горечи', 'ПК > 25% — замена обязательна', 'Хранение жира: 3 года']} />
      <ActionButtons onAdd={() => { setEditId(null); setF({ date: '', time: '', bath1: '', bath2: '', quality: '', pk: '', signature: '', replacement: '', repSign: '' }); setShowForm(true); }}
        onPrint={() => window.print()} total={records.length} violations={violations} />
      <TableWrapper>
        <table className="w-full text-sm">
          <thead><tr className="bg-gradient-to-r from-red-700 to-red-800 print:bg-red-50 print:border-b-2 print:border-red-700">
            <th className={thCls}>№</th><th className={thCls}>Дата</th><th className={thCls}>Время</th>
            <th className={`${thCls} text-center`}>Ванна №1<br/><span className="text-[10px] font-normal opacity-75">(картофель)</span></th>
            <th className={`${thCls} text-center`}>Ванна №2<br/><span className="text-[10px] font-normal opacity-75">(курица)</span></th>
            <th className={thCls}>Признаки качества</th>
            <th className={`${thCls} text-center`}>ПК, %</th>
            <th className={thCls}>Подпись повара</th>
            <th className={thCls}>Замена масла</th>
            <th className={thCls}>Подпись отв.</th>
            <th className={`${thCls} text-center print:hidden`}>⚙</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r, i) => {
              const pkOk = checkPK(r.pk);
              return (<tr key={r.id} className={`${!pkOk ? 'bg-red-50/50' : i % 2 ? 'bg-gray-50/30' : ''} hover:bg-gray-50`}>
                <td className={`${tdCls} text-gray-500 text-xs`}>{i + 1}</td>
                <td className={`${tdCls} font-medium`}>{r.date}</td>
                <td className={`${tdCls} text-gray-600`}>{r.time}</td>
                <td className={`${tdCls} text-center`}>{r.bath1}</td>
                <td className={`${tdCls} text-center`}>{r.bath2}</td>
                <td className={tdCls}>{r.quality}</td>
                <td className={`${tdCls} text-center font-mono font-medium ${pkOk ? 'text-green-700' : 'text-red-600 font-bold bg-red-50'}`}>{r.pk}{!pkOk && ' ⚠️'}</td>
                <td className={tdCls}>{r.signature}</td>
                <td className={tdCls}>{r.replacement}</td>
                <td className={tdCls}>{r.repSign}</td>
                <td className={`${tdCls} text-center print:hidden`}>
                  <button onClick={() => { setF({ date: r.date, time: r.time, bath1: r.bath1, bath2: r.bath2, quality: r.quality, pk: r.pk, signature: r.signature, replacement: r.replacement, repSign: r.repSign }); setEditId(r.id); setShowForm(true); }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">✏️</button>
                  <button onClick={() => setRecords(records.filter(x => x.id !== r.id))}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">🗑️</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
      </TableWrapper>
      <Modal show={showForm} onClose={() => setShowForm(false)} title={editId ? '✏️ Редактировать' : '➕ Новая запись'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Дата</label><input className={inputCls} value={f.date} onChange={e => setF({ ...f, date: e.target.value })} required /></div>
            <div><label className={labelCls}>Время</label><input className={inputCls} value={f.time} onChange={e => setF({ ...f, time: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Ванна №1 (картофель)</label><input className={inputCls} value={f.bath1} onChange={e => setF({ ...f, bath1: e.target.value })} required /></div>
            <div><label className={labelCls}>Ванна №2 (курица)</label><input className={inputCls} value={f.bath2} onChange={e => setF({ ...f, bath2: e.target.value })} required /></div>
          </div>
          <div><label className={labelCls}>Признаки качества</label><input className={inputCls} value={f.quality} onChange={e => setF({ ...f, quality: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>ПК, % <span className="text-xs text-gray-400">(норма ≤ 25%)</span></label><input className={inputCls} value={f.pk} onChange={e => setF({ ...f, pk: e.target.value })} required /></div>
            <div><label className={labelCls}>Подпись повара</label><input className={inputCls} value={f.signature} onChange={e => setF({ ...f, signature: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Замена масла</label><input className={inputCls} value={f.replacement} onChange={e => setF({ ...f, replacement: e.target.value })} /></div>
            <div><label className={labelCls}>Подпись отв.</label><input className={inputCls} value={f.repSign} onChange={e => setF({ ...f, repSign: e.target.value })} /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium text-sm">{editId ? 'Сохранить' : 'Добавить'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm">Отмена</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ============ JOURNAL 3 ============
function Journal3() {
  const [records, setRecords] = useState([
    { id: 1, datetime: '10.08, 10:15', product: 'Котлета говядина', weight: '45 г', cookTime: '3 мин', temp: '+73', signature: 'Иванов', result: 'ОК' },
    { id: 2, datetime: '10.08, 10:15', product: 'Котлета говядина', weight: '90 г', cookTime: '5 мин', temp: '+74', signature: 'Иванов', result: 'ОК' },
    { id: 3, datetime: '10.08, 11:00', product: 'Котлета говядина', weight: '90 г', cookTime: '5 мин', temp: '+68', signature: 'Сидоров', result: '*Дожарка 1 мин' },
    { id: 4, datetime: '10.08, 12:30', product: 'Филе куриное', weight: 'порция', cookTime: '6 мин', temp: '+75', signature: 'Иванов', result: 'ОК' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({ datetime: '', product: '', weight: '', cookTime: '', temp: '', signature: '', result: '' });

  const pT = (v: string) => { const c = v.replace(/[°\s]/g, '').replace(',', '.').replace('−', '-').replace('–', '-'); const n = parseFloat(c); return isNaN(n) ? null : n; };
  const checkTemp = (v: string, product: string) => {
    const n = pT(v); if (n === null) return true;
    if (product.toLowerCase().includes('куриц') || product.toLowerCase().includes('филе')) return n >= 74;
    return n >= 71;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) setRecords(records.map(r => r.id === editId ? { ...f, id: editId } : r));
    else setRecords([...records, { ...f, id: Date.now() }]);
    setF({ datetime: '', product: '', weight: '', cookTime: '', temp: '', signature: '', result: '' });
    setEditId(null); setShowForm(false);
  };

  const violations = records.filter(r => !checkTemp(r.temp, r.product)).length;

  return (
    <>
      <NormBanner norms={['Курица: ≥ +74 °C', 'Котлета говядина: ≥ +71 °C']} />
      <ActionButtons onAdd={() => { setEditId(null); setF({ datetime: '', product: '', weight: '', cookTime: '', temp: '', signature: '', result: '' }); setShowForm(true); }}
        onPrint={() => window.print()} total={records.length} violations={violations} />
      <TableWrapper>
        <table className="w-full text-sm">
          <thead><tr className="bg-gradient-to-r from-red-700 to-red-800 print:bg-red-50 print:border-b-2 print:border-red-700">
            <th className={thCls}>№</th><th className={thCls}>Дата/время</th><th className={thCls}>Продукт</th>
            <th className={`${thCls} text-center`}>Вес</th><th className={`${thCls} text-center`}>Время</th>
            <th className={`${thCls} text-center`}>t° внутри</th><th className={thCls}>Подпись</th><th className={thCls}>Результат</th>
            <th className={`${thCls} text-center print:hidden`}>⚙</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r, i) => {
              const ok = checkTemp(r.temp, r.product);
              return (<tr key={r.id} className={`${!ok ? 'bg-red-50/50' : i % 2 ? 'bg-gray-50/30' : ''} hover:bg-gray-50`}>
                <td className={`${tdCls} text-gray-500 text-xs`}>{i + 1}</td>
                <td className={`${tdCls} font-medium`}>{r.datetime}</td>
                <td className={tdCls}>{r.product}</td>
                <td className={`${tdCls} text-center`}>{r.weight}</td>
                <td className={`${tdCls} text-center`}>{r.cookTime}</td>
                <td className={`${tdCls} text-center font-mono font-medium ${ok ? 'text-green-700' : 'text-red-600 font-bold bg-red-50'}`}>{r.temp}{!ok && ' ⚠️'}</td>
                <td className={tdCls}>{r.signature}</td>
                <td className={`${tdCls} ${!ok ? 'text-red-600 font-medium' : 'text-green-700'}`}>{r.result}</td>
                <td className={`${tdCls} text-center print:hidden`}>
                  <button onClick={() => { setF(r); setEditId(r.id); setShowForm(true); }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">✏️</button>
                  <button onClick={() => setRecords(records.filter(x => x.id !== r.id))}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">🗑️</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
      </TableWrapper>
      <Modal show={showForm} onClose={() => setShowForm(false)} title={editId ? '✏️ Редактировать' : '➕ Новая запись'}>
        <form onSubmit={submit} className="space-y-4">
          <div><label className={labelCls}>Дата/время</label><input className={inputCls} value={f.datetime} onChange={e => setF({ ...f, datetime: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Продукт</label><input className={inputCls} value={f.product} onChange={e => setF({ ...f, product: e.target.value })} required /></div>
            <div><label className={labelCls}>Вес</label><input className={inputCls} value={f.weight} onChange={e => setF({ ...f, weight: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Время жарки</label><input className={inputCls} value={f.cookTime} onChange={e => setF({ ...f, cookTime: e.target.value })} required /></div>
            <div><label className={labelCls}>t° внутри</label><input className={inputCls} value={f.temp} onChange={e => setF({ ...f, temp: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Подпись</label><input className={inputCls} value={f.signature} onChange={e => setF({ ...f, signature: e.target.value })} required /></div>
            <div><label className={labelCls}>Результат</label><input className={inputCls} value={f.result} onChange={e => setF({ ...f, result: e.target.value })} /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium text-sm">{editId ? 'Сохранить' : 'Добавить'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm">Отмена</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ============ JOURNAL 4 ============
function Journal4() {
  const [records, setRecords] = useState([
    { id: 1, date: '10.08', setTime: '11:00', product: 'Бургер классик', tempStart: '+72', temp30: '+70', temp60: '—', writeOffTime: '11:45', reason: 'Реализация', signature: 'Иванов' },
    { id: 2, date: '10.08', setTime: '12:30', product: 'Курица панир.', tempStart: '+74', temp30: '+71', temp60: '+68', writeOffTime: '13:30', reason: 'Истек срок', signature: 'Петров' },
    { id: 3, date: '10.08', setTime: '14:00', product: 'Бургер острый', tempStart: '+73', temp30: '+62', temp60: '—', writeOffTime: '14:45', reason: '*Падение t°', signature: 'Сидоров' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({ date: '', setTime: '', product: '', tempStart: '', temp30: '', temp60: '', writeOffTime: '', reason: '', signature: '' });

  const pT = (v: string) => { const c = v.replace(/[°\s]/g, '').replace(',', '.').replace('−', '-').replace('–', '-'); const n = parseFloat(c); return isNaN(n) ? null : n; };
  const chkTemp = (v: string) => { const n = pT(v); return n === null ? true : n >= 65; };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) setRecords(records.map(r => r.id === editId ? { ...f, id: editId } : r));
    else setRecords([...records, { ...f, id: Date.now() }]);
    setF({ date: '', setTime: '', product: '', tempStart: '', temp30: '', temp60: '', writeOffTime: '', reason: '', signature: '' });
    setEditId(null); setShowForm(false);
  };

  const violations = records.filter(r => !chkTemp(r.tempStart) || !chkTemp(r.temp30) || (r.temp60 !== '—' && !chkTemp(r.temp60))).length;

  return (
    <>
      <NormBanner norms={['t° ≥ +65 °C', 'Время ≤ 60 мин', 'Остыло ниже +65 °C — подогрев ЗАПРЕЩЁН, только списание']} />
      <ActionButtons onAdd={() => { setEditId(null); setF({ date: '', setTime: '', product: '', tempStart: '', temp30: '', temp60: '', writeOffTime: '', reason: '', signature: '' }); setShowForm(true); }}
        onPrint={() => window.print()} total={records.length} violations={violations} />
      <TableWrapper>
        <table className="w-full text-sm">
          <thead><tr className="bg-gradient-to-r from-red-700 to-red-800 print:bg-red-50 print:border-b-2 print:border-red-700">
            <th className={thCls}>№</th><th className={thCls}>Дата</th><th className={`${thCls} text-center`}>Время пост.</th>
            <th className={thCls}>Продукт</th><th className={`${thCls} text-center`}>t° пост.</th>
            <th className={`${thCls} text-center`}>30 мин</th><th className={`${thCls} text-center`}>60 мин</th>
            <th className={`${thCls} text-center`}>Время спис.</th><th className={thCls}>Причина</th><th className={thCls}>Подпись</th>
            <th className={`${thCls} text-center print:hidden`}>⚙</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r, i) => {
              const t1 = chkTemp(r.tempStart), t2 = chkTemp(r.temp30), t3 = r.temp60 === '—' || chkTemp(r.temp60);
              const bad = !t1 || !t2 || !t3;
              return (<tr key={r.id} className={`${bad ? 'bg-red-50/50' : i % 2 ? 'bg-gray-50/30' : ''} hover:bg-gray-50`}>
                <td className={`${tdCls} text-gray-500 text-xs`}>{i + 1}</td>
                <td className={`${tdCls} font-medium`}>{r.date}</td>
                <td className={`${tdCls} text-center`}>{r.setTime}</td>
                <td className={tdCls}>{r.product}</td>
                <td className={`${tdCls} text-center font-mono font-medium ${t1 ? 'text-green-700' : 'text-red-600 bg-red-50'}`}>{r.tempStart}{!t1 && ' ⚠️'}</td>
                <td className={`${tdCls} text-center font-mono font-medium ${t2 ? 'text-green-700' : 'text-red-600 bg-red-50'}`}>{r.temp30}{!t2 && ' ⚠️'}</td>
                <td className={`${tdCls} text-center font-mono font-medium ${t3 ? 'text-green-700' : 'text-red-600 bg-red-50'}`}>{r.temp60}{r.temp60 !== '—' && !t3 && ' ⚠️'}</td>
                <td className={`${tdCls} text-center`}>{r.writeOffTime}</td>
                <td className={`${tdCls} ${bad ? 'text-red-600 font-medium' : ''}`}>{r.reason}</td>
                <td className={tdCls}>{r.signature}</td>
                <td className={`${tdCls} text-center print:hidden`}>
                  <button onClick={() => { setF(r); setEditId(r.id); setShowForm(true); }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">✏️</button>
                  <button onClick={() => setRecords(records.filter(x => x.id !== r.id))}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">🗑️</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
      </TableWrapper>
      <Modal show={showForm} onClose={() => setShowForm(false)} title={editId ? '✏️ Редактировать' : '➕ Новая запись'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Дата</label><input className={inputCls} value={f.date} onChange={e => setF({ ...f, date: e.target.value })} required /></div>
            <div><label className={labelCls}>Время постановки</label><input className={inputCls} value={f.setTime} onChange={e => setF({ ...f, setTime: e.target.value })} required /></div>
          </div>
          <div><label className={labelCls}>Продукт</label><input className={inputCls} value={f.product} onChange={e => setF({ ...f, product: e.target.value })} required /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelCls}>t° при постановке</label><input className={inputCls} value={f.tempStart} onChange={e => setF({ ...f, tempStart: e.target.value })} required /></div>
            <div><label className={labelCls}>30 мин</label><input className={inputCls} value={f.temp30} onChange={e => setF({ ...f, temp30: e.target.value })} required /></div>
            <div><label className={labelCls}>60 мин</label><input className={inputCls} value={f.temp60} onChange={e => setF({ ...f, temp60: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Время списания</label><input className={inputCls} value={f.writeOffTime} onChange={e => setF({ ...f, writeOffTime: e.target.value })} /></div>
            <div><label className={labelCls}>Причина</label><input className={inputCls} value={f.reason} onChange={e => setF({ ...f, reason: e.target.value })} /></div>
          </div>
          <div><label className={labelCls}>Подпись</label><input className={inputCls} value={f.signature} onChange={e => setF({ ...f, signature: e.target.value })} required /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium text-sm">{editId ? 'Сохранить' : 'Добавить'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm">Отмена</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ============ JOURNAL 5 ============
function Journal5() {
  const [records, setRecords] = useState([
    { id: 1, date: '10.08', equipment: 'Блендер', type: 'Промывка после вкуса', agent: 'Вода питьевая', time: '10:30', signature: 'Бармен А.' },
    { id: 2, date: '10.08', equipment: 'Помпа сиропа', type: 'Ежедневная промывка', agent: 'Горячая вода', time: '22:15', signature: 'Бармен Б.' },
    { id: 3, date: '10.08', equipment: 'Электрогриль', type: 'Чистка поверхности', agent: 'Антижир', time: '22:30', signature: 'Повар В.' },
    { id: 4, date: '10.08', equipment: 'Блендер (разборка)', type: 'Полная дезинфекция', agent: 'Дез. раствор 0,5%', time: '22:45', signature: 'Бармен А.' },
    { id: 5, date: '10.08', equipment: 'Кофемашина (молочный контур)', type: 'Ежедневная автопромывка', agent: 'Автопрограмма', time: '22:50', signature: 'Бармен Б.' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({ date: '', equipment: '', type: '', agent: '', time: '', signature: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) setRecords(records.map(r => r.id === editId ? { ...f, id: editId } : r));
    else setRecords([...records, { ...f, id: Date.now() }]);
    setF({ date: '', equipment: '', type: '', agent: '', time: '', signature: '' });
    setEditId(null); setShowForm(false);
  };

  return (
    <>
      <NormBanner norms={['Ежедневная обработка после каждой смены', 'Полная дезинфекция — по графику', 'Средства — только разрешённые']} />
      <ActionButtons onAdd={() => { setEditId(null); setF({ date: '', equipment: '', type: '', agent: '', time: '', signature: '' }); setShowForm(true); }}
        onPrint={() => window.print()} total={records.length} violations={0} />
      <TableWrapper>
        <table className="w-full text-sm">
          <thead><tr className="bg-gradient-to-r from-red-700 to-red-800 print:bg-red-50 print:border-b-2 print:border-red-700">
            <th className={thCls}>№</th><th className={thCls}>Дата</th><th className={thCls}>Оборудование</th>
            <th className={thCls}>Вид обработки</th><th className={thCls}>Средство</th>
            <th className={`${thCls} text-center`}>Время</th><th className={thCls}>Подпись</th>
            <th className={`${thCls} text-center print:hidden`}>⚙</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r, i) => (
              <tr key={r.id} className={`${i % 2 ? 'bg-gray-50/30' : ''} hover:bg-gray-50`}>
                <td className={`${tdCls} text-gray-500 text-xs`}>{i + 1}</td>
                <td className={`${tdCls} font-medium`}>{r.date}</td>
                <td className={tdCls}>{r.equipment}</td>
                <td className={tdCls}>{r.type}</td>
                <td className={tdCls}>{r.agent}</td>
                <td className={`${tdCls} text-center`}>{r.time}</td>
                <td className={tdCls}>{r.signature}</td>
                <td className={`${tdCls} text-center print:hidden`}>
                  <button onClick={() => { setF(r); setEditId(r.id); setShowForm(true); }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">✏️</button>
                  <button onClick={() => setRecords(records.filter(x => x.id !== r.id))}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
      <Modal show={showForm} onClose={() => setShowForm(false)} title={editId ? '✏️ Редактировать' : '➕ Новая запись'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Дата</label><input className={inputCls} value={f.date} onChange={e => setF({ ...f, date: e.target.value })} required /></div>
            <div><label className={labelCls}>Время</label><input className={inputCls} value={f.time} onChange={e => setF({ ...f, time: e.target.value })} required /></div>
          </div>
          <div><label className={labelCls}>Оборудование</label><input className={inputCls} value={f.equipment} onChange={e => setF({ ...f, equipment: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Вид обработки</label><input className={inputCls} value={f.type} onChange={e => setF({ ...f, type: e.target.value })} required /></div>
            <div><label className={labelCls}>Средство</label><input className={inputCls} value={f.agent} onChange={e => setF({ ...f, agent: e.target.value })} required /></div>
          </div>
          <div><label className={labelCls}>Подпись</label><input className={inputCls} value={f.signature} onChange={e => setF({ ...f, signature: e.target.value })} required /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium text-sm">{editId ? 'Сохранить' : 'Добавить'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm">Отмена</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ============ JOURNAL 6 ============
function Journal6() {
  const [records, setRecords] = useState([
    { id: 1, datetime: '10.08, 09:15', product: 'Молоко УП 1 л (коктейли)', shelfLife: '≤ 24 ч', validUntil: '11.08, 09:15', signature: 'Бармен', note: 'В холодильник' },
    { id: 2, datetime: '10.08, 09:00', product: 'Соус «МАКСИ-БУРГЕР» (соусник)', shelfLife: '≤ 30 сут', validUntil: '09.09', signature: 'Бармен', note: 'Маркирован' },
    { id: 3, datetime: '10.08, 09:20', product: 'Халапеньо (переложен из банки)', shelfLife: '≤ 3 сут', validUntil: '13.08', signature: 'Бармен', note: 'Пласт. тара' },
    { id: 4, datetime: '10.08, 10:00', product: 'Айсберг нарезанный', shelfLife: '≤ 18 ч', validUntil: 'Конец смены', signature: 'Повар', note: '—' },
    { id: 5, datetime: '10.08, 14:00', product: 'Сироп «Карамель»', shelfLife: '≤ 7 сут', validUntil: '17.08', signature: 'Бармен', note: 'В холодильник' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({ datetime: '', product: '', shelfLife: '', validUntil: '', signature: '', note: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) setRecords(records.map(r => r.id === editId ? { ...f, id: editId } : r));
    else setRecords([...records, { ...f, id: Date.now() }]);
    setF({ datetime: '', product: '', shelfLife: '', validUntil: '', signature: '', note: '' });
    setEditId(null); setShowForm(false);
  };

  return (
    <>
      <NormBanner norms={['Молоко УП: макс. 24 ч при 0…+5 °C', 'Соусы и салатетта — по Реестру (Разд. 3)', 'Маркировка обязательна']} />
      <ActionButtons onAdd={() => { setEditId(null); setF({ datetime: '', product: '', shelfLife: '', validUntil: '', signature: '', note: '' }); setShowForm(true); }}
        onPrint={() => window.print()} total={records.length} violations={0} />
      <TableWrapper>
        <table className="w-full text-sm">
          <thead><tr className="bg-gradient-to-r from-red-700 to-red-800 print:bg-red-50 print:border-b-2 print:border-red-700">
            <th className={thCls}>№</th><th className={thCls}>Дата/время вскрытия</th><th className={thCls}>Продукт</th>
            <th className={`${thCls} text-center`}>Срок после вскрытия</th><th className={`${thCls} text-center`}>Годен до</th>
            <th className={thCls}>Подпись</th><th className={thCls}>Примечание</th>
            <th className={`${thCls} text-center print:hidden`}>⚙</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r, i) => (
              <tr key={r.id} className={`${i % 2 ? 'bg-gray-50/30' : ''} hover:bg-gray-50`}>
                <td className={`${tdCls} text-gray-500 text-xs`}>{i + 1}</td>
                <td className={`${tdCls} font-medium`}>{r.datetime}</td>
                <td className={tdCls}>{r.product}</td>
                <td className={`${tdCls} text-center`}>{r.shelfLife}</td>
                <td className={`${tdCls} text-center font-medium`}>{r.validUntil}</td>
                <td className={tdCls}>{r.signature}</td>
                <td className={`${tdCls} text-gray-500`}>{r.note}</td>
                <td className={`${tdCls} text-center print:hidden`}>
                  <button onClick={() => { setF(r); setEditId(r.id); setShowForm(true); }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">✏️</button>
                  <button onClick={() => setRecords(records.filter(x => x.id !== r.id))}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
      <Modal show={showForm} onClose={() => setShowForm(false)} title={editId ? '✏️ Редактировать' : '➕ Новая запись'}>
        <form onSubmit={submit} className="space-y-4">
          <div><label className={labelCls}>Дата/время вскрытия</label><input className={inputCls} value={f.datetime} onChange={e => setF({ ...f, datetime: e.target.value })} required /></div>
          <div><label className={labelCls}>Продукт</label><input className={inputCls} value={f.product} onChange={e => setF({ ...f, product: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Срок после вскрытия</label><input className={inputCls} value={f.shelfLife} onChange={e => setF({ ...f, shelfLife: e.target.value })} required /></div>
            <div><label className={labelCls}>Годен до</label><input className={inputCls} value={f.validUntil} onChange={e => setF({ ...f, validUntil: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Подпись</label><input className={inputCls} value={f.signature} onChange={e => setF({ ...f, signature: e.target.value })} required /></div>
            <div><label className={labelCls}>Примечание</label><input className={inputCls} value={f.note} onChange={e => setF({ ...f, note: e.target.value })} /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium text-sm">{editId ? 'Сохранить' : 'Добавить'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm">Отмена</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ============ JOURNAL 7 ============
function Journal7() {
  const [records, setRecords] = useState([
    { id: 1, date: '10.08', fio: 'Иванов И.', position: 'Повар', survey: 'Нет', hands: 'Без повреждений', empSign: 'Иванов', mgrSign: 'Упр.' },
    { id: 2, date: '10.08', fio: 'Петров П.', position: 'Повар', survey: 'Нет', hands: 'Чистые', empSign: 'Петров', mgrSign: 'Упр.' },
    { id: 3, date: '10.08', fio: 'Сидоров С.', position: 'Бармен', survey: 'Диарея*', hands: '—', empSign: '—', mgrSign: 'Отстранен' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({ date: '', fio: '', position: '', survey: '', hands: '', empSign: '', mgrSign: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) setRecords(records.map(r => r.id === editId ? { ...f, id: editId } : r));
    else setRecords([...records, { ...f, id: Date.now() }]);
    setF({ date: '', fio: '', position: '', survey: '', hands: '', empSign: '', mgrSign: '' });
    setEditId(null); setShowForm(false);
  };

  const hasIssue = (survey: string) => survey !== 'Нет' && survey !== '';

  return (
    <>
      <NormBanner norms={['При симптомах (диарея, рвота, t°, гнойнички) — НЕМЕДЛЕННОЕ ОТСТРАНЕНИЕ', 'Опрос ежедневно перед сменой']} />
      <ActionButtons onAdd={() => { setEditId(null); setF({ date: '', fio: '', position: '', survey: '', hands: '', empSign: '', mgrSign: '' }); setShowForm(true); }}
        onPrint={() => window.print()} total={records.length} violations={records.filter(r => hasIssue(r.survey)).length} />
      <TableWrapper>
        <table className="w-full text-sm">
          <thead><tr className="bg-gradient-to-r from-red-700 to-red-800 print:bg-red-50 print:border-b-2 print:border-red-700">
            <th className={thCls}>№</th><th className={thCls}>Дата</th><th className={thCls}>ФИО</th>
            <th className={thCls}>Должность</th><th className={`${thCls} text-center`}>Опрос (ЖКТ, t°, гнойнички)</th>
            <th className={thCls}>Руки</th><th className={thCls}>Подпись сотр.</th><th className={thCls}>Подпись упр.</th>
            <th className={`${thCls} text-center print:hidden`}>⚙</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r, i) => {
              const issue = hasIssue(r.survey);
              return (<tr key={r.id} className={`${issue ? 'bg-red-50/50' : i % 2 ? 'bg-gray-50/30' : ''} hover:bg-gray-50`}>
                <td className={`${tdCls} text-gray-500 text-xs`}>{i + 1}</td>
                <td className={`${tdCls} font-medium`}>{r.date}</td>
                <td className={tdCls}>{r.fio}</td>
                <td className={tdCls}>{r.position}</td>
                <td className={`${tdCls} text-center font-medium ${issue ? 'text-red-600 bg-red-50' : 'text-green-700'}`}>{r.survey}{issue && ' ⚠️'}</td>
                <td className={tdCls}>{r.hands}</td>
                <td className={tdCls}>{r.empSign}</td>
                <td className={`${tdCls} ${issue ? 'text-red-600 font-bold' : ''}`}>{r.mgrSign}</td>
                <td className={`${tdCls} text-center print:hidden`}>
                  <button onClick={() => { setF(r); setEditId(r.id); setShowForm(true); }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">✏️</button>
                  <button onClick={() => setRecords(records.filter(x => x.id !== r.id))}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">🗑️</button>
                </td>
              </tr>);
            })}
          </tbody>
        </table>
      </TableWrapper>
      <Modal show={showForm} onClose={() => setShowForm(false)} title={editId ? '✏️ Редактировать' : '➕ Новая запись'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Дата</label><input className={inputCls} value={f.date} onChange={e => setF({ ...f, date: e.target.value })} required /></div>
            <div><label className={labelCls}>Должность</label><input className={inputCls} value={f.position} onChange={e => setF({ ...f, position: e.target.value })} required /></div>
          </div>
          <div><label className={labelCls}>ФИО</label><input className={inputCls} value={f.fio} onChange={e => setF({ ...f, fio: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Опрос (ЖКТ, t°, гнойнички)</label><input className={inputCls} value={f.survey} onChange={e => setF({ ...f, survey: e.target.value })} required /></div>
            <div><label className={labelCls}>Руки</label><input className={inputCls} value={f.hands} onChange={e => setF({ ...f, hands: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Подпись сотрудника</label><input className={inputCls} value={f.empSign} onChange={e => setF({ ...f, empSign: e.target.value })} /></div>
            <div><label className={labelCls}>Подпись управляющего</label><input className={inputCls} value={f.mgrSign} onChange={e => setF({ ...f, mgrSign: e.target.value })} /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium text-sm">{editId ? 'Сохранить' : 'Добавить'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm">Отмена</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ============ JOURNAL 8 ============
function Journal8() {
  const [records, setRecords] = useState([
    { id: 1, date: '10.08', time: '09:00', iceState: 'Чистый, без запаха', scoop: 'Да, в холдере', cleanliness: 'Чисто', wash: '—', signature: 'Бармен' },
    { id: 2, date: '10.08', time: '22:00', iceState: 'Норма', scoop: 'Да', cleanliness: 'Норма', wash: 'Еженедельная дез.', signature: 'Упр.' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({ date: '', time: '', iceState: '', scoop: '', cleanliness: '', wash: '', signature: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) setRecords(records.map(r => r.id === editId ? { ...f, id: editId } : r));
    else setRecords([...records, { ...f, id: Date.now() }]);
    setF({ date: '', time: '', iceState: '', scoop: '', cleanliness: '', wash: '', signature: '' });
    setEditId(null); setShowForm(false);
  };

  return (
    <>
      <NormBanner norms={['Лёд брать ТОЛЬКО СОВКОМ', 'Совок — в холдере', 'Еженедельная дезинфекция бункера']} />
      <ActionButtons onAdd={() => { setEditId(null); setF({ date: '', time: '', iceState: '', scoop: '', cleanliness: '', wash: '', signature: '' }); setShowForm(true); }}
        onPrint={() => window.print()} total={records.length} violations={0} />
      <TableWrapper>
        <table className="w-full text-sm">
          <thead><tr className="bg-gradient-to-r from-red-700 to-red-800 print:bg-red-50 print:border-b-2 print:border-red-700">
            <th className={thCls}>№</th><th className={thCls}>Дата</th><th className={`${thCls} text-center`}>Время</th>
            <th className={thCls}>Состояние льда</th><th className={`${thCls} text-center`}>Совок на месте</th>
            <th className={thCls}>Чистота бункера</th><th className={thCls}>Мойка льдогенератора</th>
            <th className={thCls}>Подпись</th>
            <th className={`${thCls} text-center print:hidden`}>⚙</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r, i) => (
              <tr key={r.id} className={`${i % 2 ? 'bg-gray-50/30' : ''} hover:bg-gray-50`}>
                <td className={`${tdCls} text-gray-500 text-xs`}>{i + 1}</td>
                <td className={`${tdCls} font-medium`}>{r.date}</td>
                <td className={`${tdCls} text-center`}>{r.time}</td>
                <td className={tdCls}>{r.iceState}</td>
                <td className={`${tdCls} text-center`}>{r.scoop}</td>
                <td className={tdCls}>{r.cleanliness}</td>
                <td className={tdCls}>{r.wash}</td>
                <td className={tdCls}>{r.signature}</td>
                <td className={`${tdCls} text-center print:hidden`}>
                  <button onClick={() => { setF(r); setEditId(r.id); setShowForm(true); }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">✏️</button>
                  <button onClick={() => setRecords(records.filter(x => x.id !== r.id))}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
      <Modal show={showForm} onClose={() => setShowForm(false)} title={editId ? '✏️ Редактировать' : '➕ Новая запись'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Дата</label><input className={inputCls} value={f.date} onChange={e => setF({ ...f, date: e.target.value })} required /></div>
            <div><label className={labelCls}>Время</label><input className={inputCls} value={f.time} onChange={e => setF({ ...f, time: e.target.value })} required /></div>
          </div>
          <div><label className={labelCls}>Состояние льда</label><input className={inputCls} value={f.iceState} onChange={e => setF({ ...f, iceState: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Совок на месте</label><input className={inputCls} value={f.scoop} onChange={e => setF({ ...f, scoop: e.target.value })} required /></div>
            <div><label className={labelCls}>Чистота бункера</label><input className={inputCls} value={f.cleanliness} onChange={e => setF({ ...f, cleanliness: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Мойка льдогенератора</label><input className={inputCls} value={f.wash} onChange={e => setF({ ...f, wash: e.target.value })} /></div>
            <div><label className={labelCls}>Подпись</label><input className={inputCls} value={f.signature} onChange={e => setF({ ...f, signature: e.target.value })} required /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium text-sm">{editId ? 'Сохранить' : 'Добавить'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm">Отмена</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ============ JOURNAL 9 ============
function Journal9() {
  const [records, setRecords] = useState([
    { id: 1, date: '10.08', time: '13:30', product: 'Курица панированная', qty: '3 шт.', reason: 'Истек срок 60 мин в шкафу', chefSign: 'Иванов', mgrSign: 'Упр.' },
    { id: 2, date: '10.08', time: '14:45', product: 'Бургер острый', qty: '1 шт.', reason: 'Падение t° ниже +65 °C', chefSign: 'Петров', mgrSign: 'Упр.' },
    { id: 3, date: '10.08', time: '22:00', product: 'Айсберг нарезка', qty: '1 емк.', reason: 'Истек срок 18 ч', chefSign: 'Повар', mgrSign: 'Упр.' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({ date: '', time: '', product: '', qty: '', reason: '', chefSign: '', mgrSign: '' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) setRecords(records.map(r => r.id === editId ? { ...f, id: editId } : r));
    else setRecords([...records, { ...f, id: Date.now() }]);
    setF({ date: '', time: '', product: '', qty: '', reason: '', chefSign: '', mgrSign: '' });
    setEditId(null); setShowForm(false);
  };

  return (
    <>
      <NormBanner norms={['Списание при истечении срока хранения', 'Подпись повара и управляющего обязательна', 'Учёт для инвентаризации']} />
      <ActionButtons onAdd={() => { setEditId(null); setF({ date: '', time: '', product: '', qty: '', reason: '', chefSign: '', mgrSign: '' }); setShowForm(true); }}
        onPrint={() => window.print()} total={records.length} violations={0} />
      <TableWrapper>
        <table className="w-full text-sm">
          <thead><tr className="bg-gradient-to-r from-red-700 to-red-800 print:bg-red-50 print:border-b-2 print:border-red-700">
            <th className={thCls}>№</th><th className={thCls}>Дата</th><th className={`${thCls} text-center`}>Время</th>
            <th className={thCls}>Продукт</th><th className={`${thCls} text-center`}>Кол-во</th>
            <th className={thCls}>Причина списания</th><th className={thCls}>Подпись повара</th><th className={thCls}>Подпись упр.</th>
            <th className={`${thCls} text-center print:hidden`}>⚙</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r, i) => (
              <tr key={r.id} className={`${i % 2 ? 'bg-gray-50/30' : ''} hover:bg-gray-50`}>
                <td className={`${tdCls} text-gray-500 text-xs`}>{i + 1}</td>
                <td className={`${tdCls} font-medium`}>{r.date}</td>
                <td className={`${tdCls} text-center`}>{r.time}</td>
                <td className={tdCls}>{r.product}</td>
                <td className={`${tdCls} text-center font-medium`}>{r.qty}</td>
                <td className={`${tdCls} text-red-600`}>{r.reason}</td>
                <td className={tdCls}>{r.chefSign}</td>
                <td className={tdCls}>{r.mgrSign}</td>
                <td className={`${tdCls} text-center print:hidden`}>
                  <button onClick={() => { setF(r); setEditId(r.id); setShowForm(true); }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">✏️</button>
                  <button onClick={() => setRecords(records.filter(x => x.id !== r.id))}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
      <Modal show={showForm} onClose={() => setShowForm(false)} title={editId ? '✏️ Редактировать' : '➕ Новая запись'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Дата</label><input className={inputCls} value={f.date} onChange={e => setF({ ...f, date: e.target.value })} required /></div>
            <div><label className={labelCls}>Время</label><input className={inputCls} value={f.time} onChange={e => setF({ ...f, time: e.target.value })} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Продукт</label><input className={inputCls} value={f.product} onChange={e => setF({ ...f, product: e.target.value })} required /></div>
            <div><label className={labelCls}>Кол-во</label><input className={inputCls} value={f.qty} onChange={e => setF({ ...f, qty: e.target.value })} required /></div>
          </div>
          <div><label className={labelCls}>Причина списания</label><input className={inputCls} value={f.reason} onChange={e => setF({ ...f, reason: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Подпись повара</label><input className={inputCls} value={f.chefSign} onChange={e => setF({ ...f, chefSign: e.target.value })} required /></div>
            <div><label className={labelCls}>Подпись упр.</label><input className={inputCls} value={f.mgrSign} onChange={e => setF({ ...f, mgrSign: e.target.value })} required /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium text-sm">{editId ? 'Сохранить' : 'Добавить'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm">Отмена</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ============ JOURNAL 10 ============
function Journal10() {
  const [records, setRecords] = useState([
    { id: 1, date: '10.08', time: '22:50', cleanType: 'Ежедневная', actions: 'Автопромывка + мойка контейнера', testDrink: '—', barSign: 'Бармен Б.', mgrSign: '—' },
    { id: 2, date: '10.08', time: '23:30', cleanType: 'Еженедельная', actions: 'Разборка, замачивание 20 мин, сборка', testDrink: 'Норма', barSign: 'Бармен Б.', mgrSign: 'Упр.' },
    { id: 3, date: '15.08', time: '23:00', cleanType: 'Декальцинация', actions: 'Средство производителя, 3 промывки', testDrink: 'Норма', barSign: 'Бармен А.', mgrSign: 'Упр.' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [f, setF] = useState({ date: '', time: '', cleanType: '', actions: '', testDrink: '', barSign: '', mgrSign: '' });
  const [machineModel, setMachineModel] = useState('');
  const [serialNum, setSerialNum] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) setRecords(records.map(r => r.id === editId ? { ...f, id: editId } : r));
    else setRecords([...records, { ...f, id: Date.now() }]);
    setF({ date: '', time: '', cleanType: '', actions: '', testDrink: '', barSign: '', mgrSign: '' });
    setEditId(null); setShowForm(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4 print:shadow-none print:border print:p-2">
        <div className="grid grid-cols-2 gap-4 print:grid-cols-2 print:gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Модель кофемашины</label>
            <input type="text" value={machineModel} onChange={e => setMachineModel(e.target.value)} placeholder="______________"
              className="w-full border-b border-gray-300 pb-0.5 text-sm font-medium focus:outline-none focus:border-red-500 placeholder:text-gray-300" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Серийный №</label>
            <input type="text" value={serialNum} onChange={e => setSerialNum(e.target.value)} placeholder="______________"
              className="w-full border-b border-gray-300 pb-0.5 text-sm font-medium focus:outline-none focus:border-red-500 placeholder:text-gray-300" />
          </div>
        </div>
      </div>
      <NormBanner norms={['Ежедневно — автопромывка + мойка контейнера', 'Еженедельно — глубокая очистка с разборкой и тест-напитком', 'Декальцинация — по регламенту производителя']} />
      <ActionButtons onAdd={() => { setEditId(null); setF({ date: '', time: '', cleanType: '', actions: '', testDrink: '', barSign: '', mgrSign: '' }); setShowForm(true); }}
        onPrint={() => window.print()} total={records.length} violations={0} />
      <TableWrapper>
        <table className="w-full text-sm">
          <thead><tr className="bg-gradient-to-r from-red-700 to-red-800 print:bg-red-50 print:border-b-2 print:border-red-700">
            <th className={thCls}>№</th><th className={thCls}>Дата</th><th className={`${thCls} text-center`}>Время</th>
            <th className={thCls}>Вид очистки</th><th className={thCls}>Выполненные действия</th>
            <th className={`${thCls} text-center`}>Тест-напиток</th><th className={thCls}>Подпись бармена</th><th className={thCls}>Подпись упр.</th>
            <th className={`${thCls} text-center print:hidden`}>⚙</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r, i) => (
              <tr key={r.id} className={`${i % 2 ? 'bg-gray-50/30' : ''} hover:bg-gray-50`}>
                <td className={`${tdCls} text-gray-500 text-xs`}>{i + 1}</td>
                <td className={`${tdCls} font-medium`}>{r.date}</td>
                <td className={`${tdCls} text-center`}>{r.time}</td>
                <td className={`${tdCls} font-medium text-red-700`}>{r.cleanType}</td>
                <td className={tdCls}>{r.actions}</td>
                <td className={`${tdCls} text-center`}>{r.testDrink}</td>
                <td className={tdCls}>{r.barSign}</td>
                <td className={tdCls}>{r.mgrSign}</td>
                <td className={`${tdCls} text-center print:hidden`}>
                  <button onClick={() => { setF(r); setEditId(r.id); setShowForm(true); }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">✏️</button>
                  <button onClick={() => setRecords(records.filter(x => x.id !== r.id))}
                    className="p-1 text-gray-400 hover:text-red-600 rounded">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
      <Modal show={showForm} onClose={() => setShowForm(false)} title={editId ? '✏️ Редактировать' : '➕ Новая запись'}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Дата</label><input className={inputCls} value={f.date} onChange={e => setF({ ...f, date: e.target.value })} required /></div>
            <div><label className={labelCls}>Время</label><input className={inputCls} value={f.time} onChange={e => setF({ ...f, time: e.target.value })} required /></div>
          </div>
          <div><label className={labelCls}>Вид очистки</label>
            <select className={inputCls} value={f.cleanType} onChange={e => setF({ ...f, cleanType: e.target.value })} required>
              <option value="">— Выберите —</option>
              <option value="Ежедневная">Ежедневная</option>
              <option value="Еженедельная">Еженедельная</option>
              <option value="Декальцинация">Декальцинация</option>
            </select>
          </div>
          <div><label className={labelCls}>Выполненные действия</label><textarea className={inputCls} rows={2} value={f.actions} onChange={e => setF({ ...f, actions: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Тест-напиток</label><input className={inputCls} value={f.testDrink} onChange={e => setF({ ...f, testDrink: e.target.value })} /></div>
            <div><label className={labelCls}>Подпись бармена</label><input className={inputCls} value={f.barSign} onChange={e => setF({ ...f, barSign: e.target.value })} required /></div>
          </div>
          <div><label className={labelCls}>Подпись упр.</label><input className={inputCls} value={f.mgrSign} onChange={e => setF({ ...f, mgrSign: e.target.value })} /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium text-sm">{editId ? 'Сохранить' : 'Добавить'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm">Отмена</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ============ EXPORTS ============
export const journals: JournalDef[] = [
  { id: 1, title: 'ЖУРНАЛ № 1', subtitle: 'Учёт температурного режима (холодильники, морозильник, салатетта)', icon: '🌡️', norms: ['Холодильники: 0…+5 °C', 'Морозильник: ≤ −18 °C', 'Салатетта: ≤ +6 °C'], component: <Journal1 /> },
  { id: 2, title: 'ЖУРНАЛ № 2', subtitle: 'Учёт использования фритюрных жиров', icon: '🍟', norms: ['Замена при: потемнении, пене, дыме, горечи', 'ПК > 25% — замена обязательна'], component: <Journal2 /> },
  { id: 3, title: 'ЖУРНАЛ № 3', subtitle: 'Контроль термообработки', icon: '🍳', norms: ['Курица: ≥ +74 °C', 'Котлета говядина: ≥ +71 °C'], component: <Journal3 /> },
  { id: 4, title: 'ЖУРНАЛ № 4', subtitle: 'Горячее хранение (тепловой шкаф)', icon: '🔥', norms: ['t° ≥ +65 °C', 'Время ≤ 60 мин', 'Подогрев остывшего ЗАПРЕЩЁН'], component: <Journal4 /> },
  { id: 5, title: 'ЖУРНАЛ № 5', subtitle: 'Санитарная обработка оборудования', icon: '🧹', norms: ['Ежедневная обработка', 'Полная дезинфекция по графику'], component: <Journal5 /> },
  { id: 6, title: 'ЖУРНАЛ № 6', subtitle: 'Учёт вскрытия скоропортящихся упаковок', icon: '📦', norms: ['Молоко УП: макс. 24 ч при 0…+5 °C', 'Сроки соусов — по Реестру'], component: <Journal6 /> },
  { id: 7, title: 'ЖУРНАЛ № 7', subtitle: 'Здоровье персонала', icon: '🏥', norms: ['При симптомах — НЕМЕДЛЕННОЕ ОТСТРАНЕНИЕ', 'Опрос ежедневно перед сменой'], component: <Journal7 /> },
  { id: 8, title: 'ЖУРНАЛ № 8', subtitle: 'Контроль качества льда и льдогенератора', icon: '🧊', norms: ['Лёд брать ТОЛЬКО СОВКОМ', 'Еженедельная дезинфекция бункера'], component: <Journal8 /> },
  { id: 9, title: 'ЖУРНАЛ № 9', subtitle: 'Бракераж и списание продукции', icon: '🗑️', norms: ['Списание при истечении срока', 'Подпись повара и управляющего'], component: <Journal9 /> },
  { id: 10, title: 'ЖУРНАЛ № 10', subtitle: 'Очистка кофемашины', icon: '☕', norms: ['Ежедневно — автопромывка', 'Еженедельно — глубокая очистка', 'Декальцинация по регламенту'], component: <Journal10 /> },
];

export { JournalHeader, NormBanner };
