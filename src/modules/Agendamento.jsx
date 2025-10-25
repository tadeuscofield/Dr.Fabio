import { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Check, X, Edit2, Trash2, AlertCircle } from 'lucide-react';

export default function Agendamento({ pacienteId, pacienteNome }) {
  const STORAGE_KEY = `dental-agendamentos-${pacienteId}`;

  const [agendamentos, setAgendamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [novoAgendamento, setNovoAgendamento] = useState({
    data: '',
    hora: '',
    tipo: 'Consulta',
    status: 'Agendado',
    observacoes: '',
    lembrete: true
  });

  const tiposConsulta = [
    'Consulta',
    'Avaliação',
    'Molde',
    'Prova de Prótese',
    'Instalação',
    'Ajuste',
    'Manutenção',
    'Retorno',
    'Urgência'
  ];

  const statusConsulta = [
    { valor: 'Agendado', cor: 'bg-blue-100 text-blue-700', icone: Clock },
    { valor: 'Confirmado', cor: 'bg-green-100 text-green-700', icone: Check },
    { valor: 'Realizado', cor: 'bg-teal-100 text-teal-700', icone: Check },
    { valor: 'Cancelado', cor: 'bg-red-100 text-red-700', icone: X },
    { valor: 'Faltou', cor: 'bg-orange-100 text-orange-700', icone: AlertCircle }
  ];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setAgendamentos(JSON.parse(saved));
    }
  }, [pacienteId]);

  const salvar = (novos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novos));
    setAgendamentos(novos);
  };

  const handleSalvar = () => {
    if (!novoAgendamento.data || !novoAgendamento.hora) {
      alert('⚠️ Preencha a data e hora do agendamento');
      return;
    }

    if (editando) {
      salvar(agendamentos.map(a => a.id === editando ? { ...novoAgendamento, id: editando } : a));
      setEditando(null);
      alert('✅ Agendamento atualizado!');
    } else {
      const agendamento = {
        ...novoAgendamento,
        id: `agend_${Date.now()}`,
        dataCadastro: new Date().toISOString()
      };
      salvar([...agendamentos, agendamento]);
      alert('✅ Agendamento criado com sucesso!');
    }

    setNovoAgendamento({
      data: '',
      hora: '',
      tipo: 'Consulta',
      status: 'Agendado',
      observacoes: '',
      lembrete: true
    });
    setShowModal(false);
  };

  const handleEditar = (agendamento) => {
    setNovoAgendamento(agendamento);
    setEditando(agendamento.id);
    setShowModal(true);
  };

  const handleExcluir = (id) => {
    if (window.confirm('⚠️ Deseja realmente excluir este agendamento?')) {
      salvar(agendamentos.filter(a => a.id !== id));
      alert('✅ Agendamento excluído!');
    }
  };

  const handleCancelar = () => {
    setShowModal(false);
    setEditando(null);
    setNovoAgendamento({
      data: '',
      hora: '',
      tipo: 'Consulta',
      status: 'Agendado',
      observacoes: '',
      lembrete: true
    });
  };

  const getStatusInfo = (status) => {
    return statusConsulta.find(s => s.valor === status) || statusConsulta[0];
  };

  const agendamentosPorData = agendamentos.sort((a, b) => {
    const dataHoraA = new Date(`${a.data}T${a.hora}`);
    const dataHoraB = new Date(`${b.data}T${b.hora}`);
    return dataHoraA - dataHoraB;
  });

  const agendamentosFuturos = agendamentosPorData.filter(a => {
    const dataHora = new Date(`${a.data}T${a.hora}`);
    return dataHora >= new Date() && a.status !== 'Cancelado' && a.status !== 'Realizado';
  });

  const agendamentosPassados = agendamentosPorData.filter(a => {
    const dataHora = new Date(`${a.data}T${a.hora}`);
    return dataHora < new Date() || a.status === 'Realizado' || a.status === 'Cancelado';
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-dental-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Agendamentos</h2>
            <p className="text-sm text-gray-600">{pacienteNome}</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-dental-600 text-white px-4 py-2 rounded-lg hover:bg-dental-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </button>
      </div>

      {/* Próximos Agendamentos */}
      {agendamentosFuturos.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-dental-600" />
            Próximos Agendamentos ({agendamentosFuturos.length})
          </h3>
          <div className="space-y-3">
            {agendamentosFuturos.map(agend => {
              const statusInfo = getStatusInfo(agend.status);
              const StatusIcon = statusInfo.icone;
              return (
                <div key={agend.id} className="border-l-4 border-dental-500 bg-dental-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2 text-dental-700 font-semibold">
                          <Calendar className="w-5 h-5" />
                          {new Date(agend.data).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1 text-dental-600 font-medium">
                          <Clock className="w-4 h-4" />
                          {agend.hora}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-white text-dental-700 rounded-full text-sm font-medium border border-dental-300">
                          {agend.tipo}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusInfo.cor}`}>
                          <StatusIcon className="w-4 h-4" />
                          {agend.status}
                        </span>
                      </div>

                      {agend.observacoes && (
                        <p className="text-sm text-gray-700 mt-2 bg-white p-2 rounded">
                          <strong>Obs:</strong> {agend.observacoes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditar(agend)}
                        className="text-dental-600 hover:text-dental-700 p-2 hover:bg-white rounded"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleExcluir(agend.id)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-white rounded"
                        title="Excluir"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Histórico */}
      {agendamentosPassados.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Histórico ({agendamentosPassados.length})
          </h3>
          <div className="space-y-2">
            {agendamentosPassados.map(agend => {
              const statusInfo = getStatusInfo(agend.status);
              const StatusIcon = statusInfo.icone;
              return (
                <div key={agend.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-700">
                          {new Date(agend.data).toLocaleDateString('pt-BR')} às {agend.hora}
                        </div>
                        <div className="text-gray-600">{agend.tipo}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${statusInfo.cor}`}>
                        <StatusIcon className="w-3 h-3" />
                        {agend.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleExcluir(agend.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {agend.observacoes && (
                    <p className="text-xs text-gray-600 mt-2">{agend.observacoes}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {agendamentos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Nenhum agendamento registrado</p>
          <p className="text-sm mt-2">Clique em "Novo Agendamento" para começar</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {editando ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                    <input
                      type="date"
                      value={novoAgendamento.data}
                      onChange={(e) => setNovoAgendamento(prev => ({ ...prev, data: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora *</label>
                    <input
                      type="time"
                      value={novoAgendamento.hora}
                      onChange={(e) => setNovoAgendamento(prev => ({ ...prev, hora: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Consulta</label>
                    <select
                      value={novoAgendamento.tipo}
                      onChange={(e) => setNovoAgendamento(prev => ({ ...prev, tipo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500"
                    >
                      {tiposConsulta.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={novoAgendamento.status}
                      onChange={(e) => setNovoAgendamento(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500"
                    >
                      {statusConsulta.map(status => (
                        <option key={status.valor} value={status.valor}>{status.valor}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={novoAgendamento.observacoes}
                    onChange={(e) => setNovoAgendamento(prev => ({ ...prev, observacoes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500"
                    rows={3}
                    placeholder="Informações adicionais sobre o agendamento..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lembrete"
                    checked={novoAgendamento.lembrete}
                    onChange={(e) => setNovoAgendamento(prev => ({ ...prev, lembrete: e.target.checked }))}
                    className="w-4 h-4 text-dental-600 rounded"
                  />
                  <label htmlFor="lembrete" className="text-sm text-gray-700">
                    Enviar lembrete ao paciente
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSalvar}
                  className="flex-1 bg-dental-600 text-white py-2 rounded-lg hover:bg-dental-700 transition-colors font-medium"
                >
                  {editando ? 'Atualizar' : 'Salvar'}
                </button>
                <button
                  onClick={handleCancelar}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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
