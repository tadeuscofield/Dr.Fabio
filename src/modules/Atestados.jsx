import { useState, useEffect } from 'react';
import { FileBadge, Plus, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function Atestados({ pacienteId, pacienteNome }) {
  const STORAGE_KEY = `dental-atestados-${pacienteId}`;
  const [atestados, setAtestados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoAtestado, setNovoAtestado] = useState({
    data: new Date().toISOString().split('T')[0],
    tipo: 'Comparecimento',
    diasAfastamento: 1,
    motivo: '',
    cid: '',
    observacoes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setAtestados(JSON.parse(saved));
  }, [pacienteId]);

  const salvar = (novos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novos));
    setAtestados(novos);
  };

  const handleSalvar = () => {
    const atestado = {
      ...novoAtestado,
      id: `atestado_${Date.now()}`,
      dataCadastro: new Date().toISOString()
    };

    salvar([...atestados, atestado]);
    setNovoAtestado({
      data: new Date().toISOString().split('T')[0],
      tipo: 'Comparecimento',
      diasAfastamento: 1,
      motivo: '',
      cid: '',
      observacoes: ''
    });
    setShowModal(false);
    alert('✅ Atestado salvo!');
  };

  const gerarPDF = (atestado) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('ATESTADO ODONTOLÓGICO', 105, 30, { align: 'center' });

    doc.setFontSize(11);
    doc.text('Dr. Fábio Silva - CRO RJ 45678', 105, 40, { align: 'center' });
    doc.text('Especialista em Próteses Dentárias', 105, 46, { align: 'center' });

    let y = 70;
    doc.setFontSize(11);

    if (atestado.tipo === 'Comparecimento') {
      doc.text(`Atesto para os devidos fins que ${pacienteNome} compareceu a esta clínica`, 20, y);
      y += 7;
      doc.text(`odontológica no dia ${new Date(atestado.data).toLocaleDateString('pt-BR')} para consulta odontológica.`, 20, y);
    } else {
      doc.text(`Atesto para os devidos fins que ${pacienteNome} necessita de`, 20, y);
      y += 7;
      doc.text(`afastamento de suas atividades pelo período de ${atestado.diasAfastamento} dia(s),`, 20, y);
      y += 7;
      doc.text(`a partir de ${new Date(atestado.data).toLocaleDateString('pt-BR')}.`, 20, y);
    }

    if (atestado.motivo) {
      y += 10;
      doc.text(`Motivo: ${atestado.motivo}`, 20, y);
    }

    if (atestado.cid) {
      y += 7;
      doc.text(`CID: ${atestado.cid}`, 20, y);
    }

    y += 20;
    doc.text(`${new Date().toLocaleDateString('pt-BR')}`, 105, y, { align: 'center' });

    y += 20;
    doc.text('_________________________________', 105, y, { align: 'center' });
    y += 6;
    doc.text('Dr. Fábio Silva', 105, y, { align: 'center' });
    y += 6;
    doc.text('CRO RJ 45678', 105, y, { align: 'center' });

    doc.save(`atestado-${pacienteNome}-${atestado.id}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileBadge className="w-6 h-6 text-dental-600" />
          <h2 className="text-xl font-semibold text-gray-800">Atestados</h2>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-dental-600 text-white px-4 py-2 rounded-lg hover:bg-dental-700">
          <Plus className="w-4 h-4" />
          Novo Atestado
        </button>
      </div>

      {atestados.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileBadge className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Nenhum atestado emitido</p>
        </div>
      ) : (
        <div className="space-y-4">
          {atestados.map(atestado => (
            <div key={atestado.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{atestado.tipo} - {new Date(atestado.data).toLocaleDateString('pt-BR')}</h3>
                  {atestado.tipo === 'Afastamento' && (
                    <p className="text-sm text-gray-600">{atestado.diasAfastamento} dia(s) de afastamento</p>
                  )}
                  {atestado.motivo && <p className="text-sm text-gray-600 mt-1">{atestado.motivo}</p>}
                </div>
                <button onClick={() => gerarPDF(atestado)} className="text-dental-600 hover:text-dental-700">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Novo Atestado</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input type="date" value={novoAtestado.data} onChange={(e) => setNovoAtestado(prev => ({ ...prev, data: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select value={novoAtestado.tipo} onChange={(e) => setNovoAtestado(prev => ({ ...prev, tipo: e.target.value }))} className="w-full px-3 py-2 border rounded-lg">
                      <option value="Comparecimento">Comparecimento</option>
                      <option value="Afastamento">Afastamento</option>
                    </select>
                  </div>
                </div>

                {novoAtestado.tipo === 'Afastamento' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dias de Afastamento</label>
                    <input type="number" value={novoAtestado.diasAfastamento} onChange={(e) => setNovoAtestado(prev => ({ ...prev, diasAfastamento: parseInt(e.target.value) || 1 }))} className="w-full px-3 py-2 border rounded-lg" min="1" />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                  <input type="text" value={novoAtestado.motivo} onChange={(e) => setNovoAtestado(prev => ({ ...prev, motivo: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" placeholder="Ex: Instalação de prótese dentária" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CID (opcional)</label>
                  <input type="text" value={novoAtestado.cid} onChange={(e) => setNovoAtestado(prev => ({ ...prev, cid: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" placeholder="Ex: K08.1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea value={novoAtestado.observacoes} onChange={(e) => setNovoAtestado(prev => ({ ...prev, observacoes: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" rows={3} />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSalvar} className="flex-1 bg-dental-600 text-white py-2 rounded-lg hover:bg-dental-700">Salvar Atestado</button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
