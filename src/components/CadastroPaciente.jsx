import { useState, useEffect } from 'react';
import { Save, Trash2, User } from 'lucide-react';

export default function CadastroPaciente({ pacienteId, onSave, onDelete }) {
  const STORAGE_KEY = `dental-paciente-${pacienteId}`;

  const [dados, setDados] = useState({
    nome: '',
    dataNascimento: '',
    cpf: '',
    rg: '',
    telefone: '',
    celular: '',
    email: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    profissao: '',
    estadoCivil: '',
    indicacao: '',
    convenio: '',
    numeroConvenio: '',
    historicoDental: '',
    alergiasMedicamentos: '',
    alergiasMateriais: '',
    doencasPreExistentes: '',
    medicamentosUso: '',
    observacoes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setDados(JSON.parse(saved));
    }
  }, [pacienteId]);

  const handleChange = (field, value) => {
    setDados(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    onSave(dados);
    alert('✅ Cadastro salvo com sucesso!');
  };

  const handleDelete = () => {
    if (window.confirm('⚠️ Tem certeza que deseja excluir este paciente?\n\nTodos os dados serão perdidos permanentemente!')) {
      localStorage.removeItem(STORAGE_KEY);
      onDelete(pacienteId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-dental-600" />
          <h2 className="text-xl font-semibold text-gray-800">Cadastro do Paciente</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-dental-600 text-white px-4 py-2 rounded-lg hover:bg-dental-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Salvar
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dados Pessoais */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
              <input
                type="text"
                value={dados.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                placeholder="Nome do paciente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label>
              <input
                type="date"
                value={dados.dataNascimento}
                onChange={(e) => handleChange('dataNascimento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                type="text"
                value={dados.cpf}
                onChange={(e) => handleChange('cpf', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
              <input
                type="text"
                value={dados.rg}
                onChange={(e) => handleChange('rg', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                placeholder="00.000.000-0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="tel"
                value={dados.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                placeholder="(00) 0000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Celular *</label>
              <input
                type="tel"
                value={dados.celular}
                onChange={(e) => handleChange('celular', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={dados.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                placeholder="email@exemplo.com"
              />
            </div>
          </div>
        </section>

        {/* Endereço */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
              <input
                type="text"
                value={dados.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                placeholder="Rua, número, complemento"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                type="text"
                value={dados.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <input
                type="text"
                value={dados.estado}
                onChange={(e) => handleChange('estado', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                placeholder="UF"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <input
                type="text"
                value={dados.cep}
                onChange={(e) => handleChange('cep', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                placeholder="00000-000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
              <input
                type="text"
                value={dados.profissao}
                onChange={(e) => handleChange('profissao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
              <select
                value={dados.estadoCivil}
                onChange={(e) => handleChange('estadoCivil', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="Solteiro(a)">Solteiro(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Viúvo(a)">Viúvo(a)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Como nos conheceu?</label>
              <input
                type="text"
                value={dados.indicacao}
                onChange={(e) => handleChange('indicacao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                placeholder="Ex: Indicação, Internet, etc."
              />
            </div>
          </div>
        </section>

        {/* Convênio */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Convênio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Convênio</label>
              <input
                type="text"
                value={dados.convenio}
                onChange={(e) => handleChange('convenio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                placeholder="Nome do convênio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número do Convênio</label>
              <input
                type="text"
                value={dados.numeroConvenio}
                onChange={(e) => handleChange('numeroConvenio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Histórico Odontológico */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico Odontológico</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Histórico Dental</label>
              <textarea
                value={dados.historicoDental}
                onChange={(e) => handleChange('historicoDental', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                rows={3}
                placeholder="Perdas dentárias, tratamentos anteriores, condições de gengiva, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alergias a Medicamentos</label>
              <textarea
                value={dados.alergiasMedicamentos}
                onChange={(e) => handleChange('alergiasMedicamentos', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                rows={2}
                placeholder="Liste medicamentos que causam alergia"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alergias a Materiais Odontológicos</label>
              <textarea
                value={dados.alergiasMateriais}
                onChange={(e) => handleChange('alergiasMateriais', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                rows={2}
                placeholder="Ex: látex, níquel, acrílico, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doenças Pré-existentes</label>
              <textarea
                value={dados.doencasPreExistentes}
                onChange={(e) => handleChange('doencasPreExistentes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                rows={2}
                placeholder="Diabetes, hipertensão, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicamentos em Uso</label>
              <textarea
                value={dados.medicamentosUso}
                onChange={(e) => handleChange('medicamentosUso', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                rows={2}
                placeholder="Medicamentos de uso contínuo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações Gerais</label>
              <textarea
                value={dados.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                rows={3}
                placeholder="Outras informações relevantes"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
