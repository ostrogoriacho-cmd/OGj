import { useState, useRef } from 'react';

interface TemperatureRecord {
  id: number;
  date: string;
  time: string;
  fridge1: string;
  fridge2: string;
  freezer: string;
  saladette: string;
  signature: string;
  notes: string;
}

const NORMS = {
  fridge: { min: 0, max: 5, label: '0…+5 °C' },
  freezer: { max: -18, label: '≤ −18 °C' },
  saladette: { max: 6, label: '≤ +6 °C' },
};

const initialRecords: TemperatureRecord[] = [
  { id: 1, date: '10.08', time: '09:00', fridge1: '+3,5', fridge2: '+4,0', freezer: '−19', saladette: '+5', signature: 'Иванов', notes: 'Норма' },
  { id: 2, date: '10.08', time: '15:00', fridge1: '+4,0', fridge2: '+4,2', freezer: '−18', saladette: '+5', signature: 'Петров', notes: 'Норма' },
  { id: 3, date: '10.08', time: '21:00', fridge1: '+3,8', fridge2: '+4,1', freezer: '−19', saladette: '+6', signature: 'Сидоров', notes: 'Норма' },
  { id: 4, date: '11.08', time: '09:00', fridge1: '+6,5', fridge2: '+4,0', freezer: '−18', saladette: '+5', signature: 'Иванов', notes: '*Неисправен, продукты перемещены' },
];

function parseTemp(value: string): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[°\s]/g, '').replace(',', '.').replace('−', '-').replace('–', '-');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function checkFridge(value: string): boolean {
  const num = parseTemp(value);
  if (num === null) return true;
  return num >= NORMS.fridge.min && num <= NORMS.fridge.max;
}

function checkFreezer(value: string): boolean {
  const num = parseTemp(value);
  if (num === null) return true;
  return num <= NORMS.freezer.max;
}

function checkSaladette(value: string): boolean {
  const num = parseTemp(value);
  if (num === null) return true;
  return num <= NORMS.saladette.max;
}

function formatTempDisplay(value: string): string {
  return value;
}

function App() {
  const [records, setRecords] = useState<TemperatureRecord[]>(initialRecords);
  const [showForm, setShowForm] = useState(false);
  const [pointName, setPointName] = useState('ОстроГорячо');
  const [address, setAddress] = useState('г. Донецк, ул. Горького, 72');
  const [period, setPeriod] = useState('');
  const [responsible, setResponsible] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const [formData, setFormData] = useState<Omit<TemperatureRecord, 'id'>>({
    date: '',
    time: '',
    fridge1: '',
    fridge2: '',
    freezer: '',
    saladette: '',
    signature: '',
    notes: '',
  });

  const resetForm = () => {
    setFormData({ date: '', time: '', fridge1: '', fridge2: '', freezer: '', saladette: '', signature: '', notes: '' });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      setRecords(records.map(r => r.id === editingId ? { ...formData, id: editingId } : r));
    } else {
      const newRecord: TemperatureRecord = { ...formData, id: Date.now() };
      setRecords([...records, newRecord]);
    }
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (record: TemperatureRecord) => {
    setFormData({
      date: record.date,
      time: record.time,
      fridge1: record.fridge1,
      fridge2: record.fridge2,
      freezer: record.freezer,
      saladette: record.saladette,
      signature: record.signature,
      notes: record.notes,
    });
    setEditingId(record.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const getCellClass = (value: string, check: (v: string) => boolean): string => {
    if (!value) return '';
    return check(value) ? 'text-green-700' : 'text-red-600 font-bold bg-red-50';
  };

  const now = new Date();
  const todayStr = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-6 px-4 print:bg-white print:text-black print:py-3 print:border-b-2 print:border-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🌡️</span>
            <h1 className="text-2xl md:text-3xl font-bold print:text-xl">
              ЖУРНАЛ № 1
            </h1>
          </div>
          <h2 className="text-lg md:text-xl font-medium opacity-90 print:text-base">
            УЧЁТА ТЕМПЕРАТУРНОГО РЕЖИМА
          </h2>
          <p className="text-sm opacity-75 mt-1 print:text-xs">
            (холодильники, морозильник, салатетта)
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-4 print:py-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 print:shadow-none print:border print:p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Точка</label>
              <input
                type="text"
                value={pointName}
                onChange={(e) => setPointName(e.target.value)}
                className="w-full border-b border-gray-300 pb-1 text-sm font-medium focus:outline-none focus:border-blue-500 print:border-b print:pb-0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Адрес</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border-b border-gray-300 pb-1 text-sm font-medium focus:outline-none focus:border-blue-500 print:border-b print:pb-0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Период</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="______ 202__ г."
                className="w-full border-b border-gray-300 pb-1 text-sm font-medium focus:outline-none focus:border-blue-500 placeholder:text-gray-400 print:border-b print:pb-0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Ответственный</label>
              <input
                type="text"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full border-b border-gray-300 pb-1 text-sm font-medium focus:outline-none focus:border-blue-500 print:border-b print:pb-0"
              />
            </div>
          </div>
        </div>

        {/* Norms */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 print:bg-white print:border print:p-2">
          <div className="flex flex-wrap items-center gap-4 text-sm print:text-xs">
            <span className="font-semibold text-amber-800">⚠️ Нормы:</span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-sm"></span>
              Холодильники: <strong>0…+5 °C</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-purple-500 rounded-sm"></span>
              Морозильник: <strong>≤ −18 °C</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-sm"></span>
              Салатетта: <strong>≤ +6 °C</strong>
            </span>
            <span className="ml-auto text-amber-700 font-medium">Заполнять 2 раза в смену</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-4 print:hidden">
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            <span>➕</span> Добавить запись
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            <span>🖨️</span> Печать
          </button>
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
            <span>Записей: <strong>{records.length}</strong></span>
            <span className="text-gray-300">|</span>
            <span>Отклонений: <strong className="text-red-600">{records.filter(r => !checkFridge(r.fridge1) || !checkFridge(r.fridge2) || !checkFreezer(r.freezer) || !checkSaladette(r.saladette)).length}</strong></span>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:hidden">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingId ? '✏️ Редактировать запись' : '➕ Новая запись'}
                  </h3>
                  <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Дата</label>
                      <input
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        placeholder={todayStr}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Время</label>
                      <input
                        type="text"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        placeholder={currentTime}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        🧊 Холод. №1 (сырьё) <span className="text-xs text-gray-400">(0…+5°C)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fridge1}
                        onChange={(e) => setFormData({ ...formData, fridge1: e.target.value })}
                        placeholder="+3,5"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        🧊 Холод. №2 (готовое) <span className="text-xs text-gray-400">(0…+5°C)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fridge2}
                        onChange={(e) => setFormData({ ...formData, fridge2: e.target.value })}
                        placeholder="+4,0"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ❄️ Морозильник <span className="text-xs text-gray-400">(≤ −18°C)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.freezer}
                        onChange={(e) => setFormData({ ...formData, freezer: e.target.value })}
                        placeholder="−19"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        🥗 Салатетта <span className="text-xs text-gray-400">(≤ +6°C)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.saladette}
                        onChange={(e) => setFormData({ ...formData, saladette: e.target.value })}
                        placeholder="+5"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Подпись (ФИО)</label>
                    <input
                      type="text"
                      value={formData.signature}
                      onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                      placeholder="Иванов"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Замечания</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Норма / описание отклонения"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors"
                    >
                      {editingId ? 'Сохранить изменения' : 'Добавить запись'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); resetForm(); }}
                      className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print:shadow-none">
          <div className="overflow-x-auto">
            <table ref={tableRef} className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-700 to-blue-800 text-white print:bg-gray-100 print:text-black print:border-b-2 print:border-black">
                  <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider print:px-2 print:py-1">№</th>
                  <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider print:px-2 print:py-1">Дата</th>
                  <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider print:px-2 print:py-1">Время</th>
                  <th className="px-3 py-3 text-center font-semibold text-xs uppercase tracking-wider print:px-2 print:py-1">
                    <div>Хол. №1</div>
                    <div className="text-[10px] font-normal opacity-75">(сырьё)</div>
                  </th>
                  <th className="px-3 py-3 text-center font-semibold text-xs uppercase tracking-wider print:px-2 print:py-1">
                    <div>Хол. №2</div>
                    <div className="text-[10px] font-normal opacity-75">(готовое)</div>
                  </th>
                  <th className="px-3 py-3 text-center font-semibold text-xs uppercase tracking-wider print:px-2 print:py-1">Морозильник</th>
                  <th className="px-3 py-3 text-center font-semibold text-xs uppercase tracking-wider print:px-2 print:py-1">Салатетта</th>
                  <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider print:px-2 print:py-1">Подпись</th>
                  <th className="px-3 py-3 text-left font-semibold text-xs uppercase tracking-wider print:px-2 print:py-1">Замечания</th>
                  <th className="px-3 py-3 text-center font-semibold text-xs uppercase tracking-wider print:hidden">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((record, index) => {
                  const fridge1Ok = checkFridge(record.fridge1);
                  const fridge2Ok = checkFridge(record.fridge2);
                  const freezerOk = checkFreezer(record.freezer);
                  const saladetteOk = checkSaladette(record.saladette);
                  const hasViolation = !fridge1Ok || !fridge2Ok || !freezerOk || !saladetteOk;

                  return (
                    <tr
                      key={record.id}
                      className={`hover:bg-gray-50 transition-colors ${hasViolation ? 'bg-red-50/50' : ''} ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                    >
                      <td className="px-3 py-2.5 text-gray-500 text-xs print:px-2 print:py-1">{index + 1}</td>
                      <td className="px-3 py-2.5 font-medium text-gray-800 print:px-2 print:py-1">{record.date}</td>
                      <td className="px-3 py-2.5 text-gray-600 print:px-2 print:py-1">{record.time}</td>
                      <td className={`px-3 py-2.5 text-center font-mono font-medium print:px-2 print:py-1 ${getCellClass(record.fridge1, checkFridge)}`}>
                        {formatTempDisplay(record.fridge1)}
                        {!fridge1Ok && <span className="ml-1 text-xs">⚠️</span>}
                      </td>
                      <td className={`px-3 py-2.5 text-center font-mono font-medium print:px-2 print:py-1 ${getCellClass(record.fridge2, checkFridge)}`}>
                        {formatTempDisplay(record.fridge2)}
                        {!fridge2Ok && <span className="ml-1 text-xs">⚠️</span>}
                      </td>
                      <td className={`px-3 py-2.5 text-center font-mono font-medium print:px-2 print:py-1 ${getCellClass(record.freezer, checkFreezer)}`}>
                        {formatTempDisplay(record.freezer)}
                        {!freezerOk && <span className="ml-1 text-xs">⚠️</span>}
                      </td>
                      <td className={`px-3 py-2.5 text-center font-mono font-medium print:px-2 print:py-1 ${getCellClass(record.saladette, checkSaladette)}`}>
                        {formatTempDisplay(record.saladette)}
                        {!saladetteOk && <span className="ml-1 text-xs">⚠️</span>}
                      </td>
                      <td className="px-3 py-2.5 text-gray-700 print:px-2 print:py-1">{record.signature}</td>
                      <td className={`px-3 py-2.5 text-xs print:px-2 print:py-1 ${hasViolation ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        {record.notes}
                      </td>
                      <td className="px-3 py-2.5 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(record)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Редактировать"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Удалить"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {records.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm">Записей пока нет. Нажмите «Добавить запись» для начала.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400 pb-6 print:mt-4 print:pb-2">
          <p>Журнал ведётся в соответствии с требованиями СанПиН и ХАССП</p>
          <p className="mt-1">© {pointName} • {address}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
