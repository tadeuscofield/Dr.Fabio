import { useState, useEffect } from 'react';
import { FileText, Plus, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function Receituario({ pacienteId, pacienteNome }) {
  const STORAGE_KEY = `dental-receitas-${pacienteId}`;
  const [receitas, setReceitas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novaReceita, setNovaReceita] = useState({
    data: new Date().toISOString().split('T')[0],
    medicamentos: [],
    orientacoes: ''
  });
  const [novoMed, setNovoMed] = useState({ nome: '', dosagem: '', frequencia: '', duracao: '' });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setReceitas(JSON.parse(saved));
  }, [pacienteId]);

  const salvar = (novos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novos));
    setReceitas(novos);
  };

  const addMedicamento = () => {
    if (!novoMed.nome) return;
    setNovaReceita(prev => ({
      ...prev,
      medicamentos: [...prev.medicamentos, { ...novoMed, id: Date.now() }]
    }));
    setNovoMed({ nome: '', dosagem: '', frequencia: '', duracao: '' });
  };

  const handleSalvar = () => {
    if (novaReceita.medicamentos.length === 0) {
      alert('⚠️ Adicione pelo menos um medicamento');
      return;
    }

    const receita = {
      ...novaReceita,
      id: `rec_${Date.now()}`,
      dataCadastro: new Date().toISOString()
    };

    salvar([...receitas, receita]);
    setNovaReceita({ data: new Date().toISOString().split('T')[0], medicamentos: [], orientacoes: '' });
    setShowModal(false);
    alert('✅ Receita salva!');
  };

  const gerarPDF = (receita) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('RECEITUÁRIO ODONTOLÓGICO', 105, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text('Dr. Fábio Silva - CRO RJ 45678', 105, 28, { align: 'center' });
    doc.text('Especialista em Próteses Dentárias', 105, 34, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Paciente: ${pacienteNome}`, 20, 50);
    doc.text(`Data: ${new Date(receita.data).toLocaleDateString('pt-BR')}`, 20, 56);

    let y = 70;
    doc.setFontSize(12);
    doc.text('PRESCRIÇÃO:', 20, y);

    y += 10;
    doc.setFontSize(10);
    receita.medicamentos.forEach((med, idx) => {
      doc.text(`${idx + 1}. ${med.nome}`, 20, y);
      y += 6;
      if (med.dosagem) {
        doc.text(`   Dosagem: ${med.dosagem}`, 20, y);
        y += 6;
      }
      if (med.frequencia) {
        doc.text(`   Frequência: ${med.frequencia}`, 20, y);
        y += 6;
      }
      if (med.duracao) {
        doc.text(`   Duração: ${med.duracao}`, 20, y);
        y += 6;
      }
      y += 3;
    });

    if (receita.orientacoes) {
      y += 5;
      doc.setFontSize(11);
      doc.text('ORIENTAÇÕES:', 20, y);
      y += 7;
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(receita.orientacoes, 170);
      doc.text(lines, 20, y);
    }

    doc.save(`receita-${pacienteNome}-${receita.id}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-dental-600" />
          <h2 className="text-xl font-semibold text-gray-800">Receituário</h2>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-dental-600 text-white px-4 py-2 rounded-lg hover:bg-dental-700">
          <Plus className="w-4 h-4" />
          Nova Receita
        </button>
      </div>

      {receitas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Nenhuma receita emitida</p>
        </div>
      ) : (
        <div className="space-y-4">
          {receitas.map(rec => (
            <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">Receita - {new Date(rec.data).toLocaleDateString('pt-BR')}</h3>
                  <p className="text-sm text-gray-600">{rec.medicamentos.length} medicamento(s)</p>
                </div>
                <button onClick={() => gerarPDF(rec)} className="text-dental-600 hover:text-dental-700">
                  <Download className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                {rec.medicamentos.map((med, idx) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded">
                    <p className="font-medium">{idx + 1}. {med.nome}</p>
                    {med.dosagem && <p className="text-gray-600">Dosagem: {med.dosagem}</p>}
                    {med.frequencia && <p className="text-gray-600">Frequência: {med.frequencia}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Nova Receita</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                  <input type="date" value={novaReceita.data} onChange={(e) => setNovaReceita(prev => ({ ...prev, data: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" />
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Adicionar Medicamento</h4>
                  <div className="space-y-3">
                    <input type="text" value={novoMed.nome} onChange={(e) => setNovoMed(prev => ({ ...prev, nome: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" placeholder="Nome do medicamento" />
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" value={novoMed.dosagem} onChange={(e) => setNovoMed(prev => ({ ...prev, dosagem: e.target.value }))} className="px-3 py-2 border rounded-lg" placeholder="Dosagem" />
                      <input type="text" value={novoMed.frequencia} onChange={(e) => setNovoMed(prev => ({ ...prev, frequencia: e.target.value }))} className="px-3 py-2 border rounded-lg" placeholder="Frequência" />
                      <input type="text" value={novoMed.duracao} onChange={(e) => setNovoMed(prev => ({ ...prev, duracao: e.target.value }))} className="px-3 py-2 border rounded-lg" placeholder="Duração" />
                    </div>
                    <button onClick={addMedicamento} className="w-full bg-dental-600 text-white px-4 py-2 rounded-lg hover:bg-dental-700">
                      <Plus className="w-5 h-5 inline mr-2" />
                      Adicionar Medicamento
                    </button>
                  </div>

                  {novaReceita.medicamentos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {novaReceita.medicamentos.map((med, idx) => (
                        <div key={med.id} className="bg-gray-50 p-3 rounded">
                          <p className="font-medium">{idx + 1}. {med.nome}</p>
                          {med.dosagem && <p className="text-sm text-gray-600">Dosagem: {med.dosagem}</p>}
                          {med.frequencia && <p className="text-sm text-gray-600">Frequência: {med.frequencia}</p>}
                          {med.duracao && <p className="text-sm text-gray-600">Duração: {med.duracao}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orientações</label>
                  <textarea value={novaReceita.orientacoes} onChange={(e) => setNovaReceita(prev => ({ ...prev, orientacoes: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" rows={4} placeholder="Orientações de uso e cuidados pós-procedimento" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSalvar} className="flex-1 bg-dental-600 text-white py-2 rounded-lg hover:bg-dental-700">Salvar Receita</button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
