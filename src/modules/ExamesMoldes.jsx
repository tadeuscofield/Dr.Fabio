import { useState, useEffect } from 'react';
import { FileImage, Upload, Download, Plus, Trash2, Eye, Calendar } from 'lucide-react';

export default function ExamesMoldes({ pacienteId }) {
  const STORAGE_KEY = `dental-exames-${pacienteId}`;

  const [exames, setExames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoExame, setNovoExame] = useState({
    tipo: '',
    data: new Date().toISOString().split('T')[0],
    descricao: '',
    observacoes: '',
    arquivos: []
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setExames(JSON.parse(saved));
    }
  }, [pacienteId]);

  const salvarExames = (novosExames) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosExames));
    setExames(novosExames);
  };

  const handleAddExame = () => {
    if (!novoExame.tipo || !novoExame.data) {
      alert('⚠️ Preencha os campos obrigatórios (Tipo e Data)');
      return;
    }

    const exame = {
      ...novoExame,
      id: `exame_${Date.now()}`,
      dataCadastro: new Date().toISOString()
    };

    salvarExames([...exames, exame]);
    setNovoExame({
      tipo: '',
      data: new Date().toISOString().split('T')[0],
      descricao: '',
      observacoes: '',
      arquivos: []
    });
    setShowModal(false);
    alert('✅ Exame/Molde adicionado com sucesso!');
  };

  const handleDeleteExame = (id) => {
    if (window.confirm('⚠️ Deseja realmente excluir este exame/molde?')) {
      salvarExames(exames.filter(e => e.id !== id));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            nome: file.name,
            tipo: file.type,
            tamanho: file.size,
            data: event.target.result
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(arquivos => {
      setNovoExame(prev => ({
        ...prev,
        arquivos: [...prev.arquivos, ...arquivos]
      }));
    });
  };

  const tiposExame = [
    'Raio-X Panorâmico',
    'Raio-X Periapical',
    'Tomografia',
    'Foto Intraoral',
    'Foto Extraoral',
    'Molde Digital',
    'Molde Físico',
    'Scanner Intraoral',
    'Outro'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileImage className="w-6 h-6 text-dental-600" />
          <h2 className="text-xl font-semibold text-gray-800">Exames e Moldes</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-dental-600 text-white px-4 py-2 rounded-lg hover:bg-dental-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Exame/Molde
        </button>
      </div>

      {/* Lista de Exames */}
      {exames.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileImage className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Nenhum exame ou molde registrado</p>
          <p className="text-sm mt-2">Clique em "Novo Exame/Molde" para adicionar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {exames.map(exame => (
            <div key={exame.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-dental-100 text-dental-700 rounded-full text-sm font-medium">
                      {exame.tipo}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(exame.data).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {exame.descricao && (
                    <p className="text-gray-700 mb-2">{exame.descricao}</p>
                  )}

                  {exame.observacoes && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Observações:</strong> {exame.observacoes}
                    </p>
                  )}

                  {exame.arquivos && exame.arquivos.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Arquivos ({exame.arquivos.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exame.arquivos.map((arquivo, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded text-sm">
                            <FileImage className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700">{arquivo.nome}</span>
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = arquivo.data;
                                link.download = arquivo.nome;
                                link.click();
                              }}
                              className="text-dental-600 hover:text-dental-700"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteExame(exame.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Novo Exame */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Novo Exame/Molde</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select
                    value={novoExame.tipo}
                    onChange={(e) => setNovoExame(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                  >
                    <option value="">Selecione o tipo</option>
                    {tiposExame.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                  <input
                    type="date"
                    value={novoExame.data}
                    onChange={(e) => setNovoExame(prev => ({ ...prev, data: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={novoExame.descricao}
                    onChange={(e) => setNovoExame(prev => ({ ...prev, descricao: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                    rows={3}
                    placeholder="Detalhes do exame ou molde"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    value={novoExame.observacoes}
                    onChange={(e) => setNovoExame(prev => ({ ...prev, observacoes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                    rows={2}
                    placeholder="Marcações de áreas críticas, notas importantes, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arquivos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Clique para fazer upload de imagens ou PDFs
                      </p>
                    </label>
                  </div>
                  {novoExame.arquivos.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {novoExame.arquivos.map((arquivo, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                          <span className="text-sm text-gray-700">{arquivo.nome}</span>
                          <button
                            onClick={() => {
                              setNovoExame(prev => ({
                                ...prev,
                                arquivos: prev.arquivos.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddExame}
                  className="flex-1 bg-dental-600 text-white py-2 rounded-lg hover:bg-dental-700 transition-colors"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNovoExame({
                      tipo: '',
                      data: new Date().toISOString().split('T')[0],
                      descricao: '',
                      observacoes: '',
                      arquivos: []
                    });
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
