import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { TIPOS_PROTESE, MATERIAIS_PROTESE, STATUS_PROTESE } from '../config/modules';

export default function PlanejamentoProteses({ pacienteId }) {
  const STORAGE_KEY = `dental-proteses-${pacienteId}`;

  const [proteses, setProteses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [novaProtese, setNovaProtese] = useState({
    tipo: '',
    material: '',
    localizacao: '',
    status: 'Em Planejamento',
    dataInicio: new Date().toISOString().split('T')[0],
    dataPrevisao: '',
    laboratorio: '',
    cor: '',
    especificacoes: '',
    custoMaterial: '',
    custoLaboratorio: '',
    observacoes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProteses(JSON.parse(saved));
    }
  }, [pacienteId]);

  const salvarProteses = (novasProteses) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novasProteses));
    setProteses(novasProteses);
  };

  const handleAddProtese = () => {
    if (!novaProtese.tipo || !novaProtese.material) {
      alert('⚠️ Preencha os campos obrigatórios (Tipo e Material)');
      return;
    }

    if (editando) {
      salvarProteses(proteses.map(p => p.id === editando ? { ...novaProtese, id: editando } : p));
      setEditando(null);
      alert('✅ Prótese atualizada com sucesso!');
    } else {
      const protese = {
        ...novaProtese,
        id: `protese_${Date.now()}`,
        dataCadastro: new Date().toISOString()
      };
      salvarProteses([...proteses, protese]);
      alert('✅ Prótese adicionada com sucesso!');
    }

    setNovaProtese({
      tipo: '',
      material: '',
      localizacao: '',
      status: 'Em Planejamento',
      dataInicio: new Date().toISOString().split('T')[0],
      dataPrevisao: '',
      laboratorio: '',
      cor: '',
      especificacoes: '',
      custoMaterial: '',
      custoLaboratorio: '',
      observacoes: ''
    });
    setShowModal(false);
  };

  const handleEditProtese = (protese) => {
    setNovaProtese(protese);
    setEditando(protese.id);
    setShowModal(true);
  };

  const handleDeleteProtese = (id) => {
    if (window.confirm('⚠️ Deseja realmente excluir esta prótese?')) {
      salvarProteses(proteses.filter(p => p.id !== id));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Em Planejamento': 'bg-gray-100 text-gray-700',
      'Aguardando Aprovação': 'bg-yellow-100 text-yellow-700',
      'Aprovado': 'bg-green-100 text-green-700',
      'Em Fabricação': 'bg-blue-100 text-blue-700',
      'Pronto para Prova': 'bg-purple-100 text-purple-700',
      'Em Ajuste': 'bg-orange-100 text-orange-700',
      'Instalado': 'bg-teal-100 text-teal-700',
      'Em Manutenção': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-6 h-6 text-dental-600" />
          <h2 className="text-xl font-semibold text-gray-800">Planejamento de Próteses</h2>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setEditando(null);
            setNovaProtese({
              tipo: '',
              material: '',
              localizacao: '',
              status: 'Em Planejamento',
              dataInicio: new Date().toISOString().split('T')[0],
              dataPrevisao: '',
              laboratorio: '',
              cor: '',
              especificacoes: '',
              custoMaterial: '',
              custoLaboratorio: '',
              observacoes: ''
            });
          }}
          className="flex items-center gap-2 bg-dental-600 text-white px-4 py-2 rounded-lg hover:bg-dental-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Prótese
        </button>
      </div>

      {/* Lista de Próteses */}
      {proteses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Nenhuma prótese planejada</p>
          <p className="text-sm mt-2">Clique em "Nova Prótese" para adicionar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {proteses.map(protese => (
            <div key={protese.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{protese.tipo}</h3>
                  <p className="text-sm text-gray-600">{protese.material}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProtese(protese)}
                    className="text-dental-600 hover:text-dental-700 p-1"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProtese(protese.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(protese.status)}`}>
                    {protese.status}
                  </span>
                </div>

                {protese.localizacao && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Localização:</span>
                    <span className="text-gray-800">{protese.localizacao}</span>
                  </div>
                )}

                {protese.cor && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cor:</span>
                    <span className="text-gray-800">{protese.cor}</span>
                  </div>
                )}

                {protese.laboratorio && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Laboratório:</span>
                    <span className="text-gray-800">{protese.laboratorio}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Data Início:</span>
                  <span className="text-gray-800">{new Date(protese.dataInicio).toLocaleDateString('pt-BR')}</span>
                </div>

                {protese.dataPrevisao && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Previsão:</span>
                    <span className="text-gray-800">{new Date(protese.dataPrevisao).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}

                {(protese.custoMaterial || protese.custoLaboratorio) && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-gray-700">Custos:</span>
                      <span className="text-dental-600">
                        R$ {(parseFloat(protese.custoMaterial || 0) + parseFloat(protese.custoLaboratorio || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {protese.especificacoes && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-gray-600 text-xs">
                      <strong>Especificações:</strong> {protese.especificacoes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nova/Editar Prótese */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {editando ? 'Editar Prótese' : 'Nova Prótese'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select
                    value={novaProtese.tipo}
                    onChange={(e) => setNovaProtese(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                  >
                    <option value="">Selecione o tipo</option>
                    {TIPOS_PROTESE.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material *</label>
                  <select
                    value={novaProtese.material}
                    onChange={(e) => setNovaProtese(prev => ({ ...prev, material: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                  >
                    <option value="">Selecione o material</option>
                    {MATERIAIS_PROTESE.map(material => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                  <input
                    type="text"
                    value={novaProtese.localizacao}
                    onChange={(e) => setNovaProtese(prev => ({ ...prev, localizacao: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                    placeholder="Ex: Dentes 11, 12, 13"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                  <input
                    type="text"
                    value={novaProtese.cor}
                    onChange={(e) => setNovaProtese(prev => ({ ...prev, cor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                    placeholder="Ex: A2, B1, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={novaProtese.status}
                    onChange={(e) => setNovaProtese(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                  >
                    {STATUS_PROTESE.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Laboratório</label>
                  <input
                    type="text"
                    value={novaProtese.laboratorio}
                    onChange={(e) => setNovaProtese(prev => ({ ...prev, laboratorio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                    placeholder="Nome do laboratório"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                  <input
                    type="date"
                    value={novaProtese.dataInicio}
                    onChange={(e) => setNovaProtese(prev => ({ ...prev, dataInicio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Previsão</label>
                  <input
                    type="date"
                    value={novaProtese.dataPrevisao}
                    onChange={(e) => setNovaProtese(prev => ({ ...prev, dataPrevisao: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custo Material (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novaProtese.custoMaterial}
                    onChange={(e) => setNovaProtese(prev => ({ ...prev, custoMaterial: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custo Laboratório (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novaProtese.custoLaboratorio}
                    onChange={(e) => setNovaProtese(prev => ({ ...prev, custoLaboratorio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especificações</label>
                  <textarea
                    value={novaProtese.especificacoes}
                    onChange={(e) => setNovaProtese(prev => ({ ...prev, especificacoes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                    rows={3}
                    placeholder="Detalhes técnicos, medidas, especificações especiais..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={novaProtese.observacoes}
                    onChange={(e) => setNovaProtese(prev => ({ ...prev, observacoes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                    rows={2}
                    placeholder="Observações gerais..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddProtese}
                  className="flex-1 bg-dental-600 text-white py-2 rounded-lg hover:bg-dental-700 transition-colors"
                >
                  {editando ? 'Atualizar' : 'Adicionar'}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditando(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
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
