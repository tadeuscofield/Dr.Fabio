import { useState, useEffect } from 'react';
import { Activity, Plus, Calendar, AlertCircle } from 'lucide-react';

export default function AcompanhamentoPosInstalacao({ pacienteId }) {
  const STORAGE_KEY = `dental-acompanhamento-${pacienteId}`;

  const [acompanhamentos, setAcompanhamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoAcomp, setNovoAcomp] = useState({
    proteseRef: '',
    dataInstalacao: '',
    dataRetorno: '',
    tipoRetorno: 'Ajuste',
    status: 'Agendado',
    conforto: '',
    funcionalidade: '',
    observacoes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAcompanhamentos(JSON.parse(saved));
    }
  }, [pacienteId]);

  const salvar = (novos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novos));
    setAcompanhamentos(novos);
  };

  const handleAdd = () => {
    if (!novoAcomp.proteseRef || !novoAcomp.dataInstalacao) {
      alert('⚠️ Preencha os campos obrigatórios');
      return;
    }

    const acomp = {
      ...novoAcomp,
      id: `acomp_${Date.now()}`,
      dataCadastro: new Date().toISOString()
    };

    salvar([...acompanhamentos, acomp]);
    setNovoAcomp({
      proteseRef: '',
      dataInstalacao: '',
      dataRetorno: '',
      tipoRetorno: 'Ajuste',
      status: 'Agendado',
      conforto: '',
      funcionalidade: '',
      observacoes: ''
    });
    setShowModal(false);
    alert('✅ Acompanhamento registrado!');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-dental-600" />
          <h2 className="text-xl font-semibold text-gray-800">Acompanhamento Pós-Instalação</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-dental-600 text-white px-4 py-2 rounded-lg hover:bg-dental-700"
        >
          <Plus className="w-4 h-4" />
          Novo Acompanhamento
        </button>
      </div>

      {acompanhamentos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Nenhum acompanhamento registrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {acompanhamentos.map(acomp => (
            <div key={acomp.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{acomp.proteseRef}</h3>
                  <p className="text-sm text-gray-600">
                    Instalação: {new Date(acomp.dataInstalacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  acomp.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {acomp.status}
                </span>
              </div>

              {acomp.dataRetorno && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  Retorno: {new Date(acomp.dataRetorno).toLocaleDateString('pt-BR')} - {acomp.tipoRetorno}
                </div>
              )}

              {(acomp.conforto || acomp.funcionalidade) && (
                <div className="space-y-1 text-sm mt-3 pt-3 border-t">
                  {acomp.conforto && <p><strong>Conforto:</strong> {acomp.conforto}</p>}
                  {acomp.funcionalidade && <p><strong>Funcionalidade:</strong> {acomp.funcionalidade}</p>}
                </div>
              )}

              {acomp.observacoes && (
                <p className="text-sm text-gray-600 mt-2 pt-2 border-t">
                  <strong>Obs:</strong> {acomp.observacoes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Novo Acompanhamento</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prótese *</label>
                  <input
                    type="text"
                    value={novoAcomp.proteseRef}
                    onChange={(e) => setNovoAcomp(prev => ({ ...prev, proteseRef: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dental-500"
                    placeholder="Ex: Prótese Total Superior"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Instalação *</label>
                    <input
                      type="date"
                      value={novoAcomp.dataInstalacao}
                      onChange={(e) => setNovoAcomp(prev => ({ ...prev, dataInstalacao: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dental-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Retorno</label>
                    <input
                      type="date"
                      value={novoAcomp.dataRetorno}
                      onChange={(e) => setNovoAcomp(prev => ({ ...prev, dataRetorno: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dental-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Retorno</label>
                    <select
                      value={novoAcomp.tipoRetorno}
                      onChange={(e) => setNovoAcomp(prev => ({ ...prev, tipoRetorno: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dental-500"
                    >
                      <option value="Ajuste">Ajuste</option>
                      <option value="Adaptação">Adaptação</option>
                      <option value="Correção">Correção</option>
                      <option value="Manutenção">Manutenção</option>
                      <option value="Revisão">Revisão</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={novoAcomp.status}
                      onChange={(e) => setNovoAcomp(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dental-500"
                    >
                      <option value="Agendado">Agendado</option>
                      <option value="Realizado">Realizado</option>
                      <option value="Concluído">Concluído</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conforto</label>
                  <textarea
                    value={novoAcomp.conforto}
                    onChange={(e) => setNovoAcomp(prev => ({ ...prev, conforto: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dental-500"
                    rows={2}
                    placeholder="Como o paciente está se sentindo com a prótese?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Funcionalidade</label>
                  <textarea
                    value={novoAcomp.funcionalidade}
                    onChange={(e) => setNovoAcomp(prev => ({ ...prev, funcionalidade: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dental-500"
                    rows={2}
                    placeholder="Avaliação da mastigação, fala, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={novoAcomp.observacoes}
                    onChange={(e) => setNovoAcomp(prev => ({ ...prev, observacoes: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dental-500"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-dental-600 text-white py-2 rounded-lg hover:bg-dental-700"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
