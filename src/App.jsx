import { useState, useEffect, useRef } from 'react';
import { User, LogOut, Plus, Search, Users, Eye, EyeOff, Smile, Download, Upload } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TABS_DENTAL } from './config/modules';
import CadastroPaciente from './components/CadastroPaciente';
import Agendamento from './modules/Agendamento';
import ExamesMoldes from './modules/ExamesMoldes';
import PlanejamentoProteses from './modules/PlanejamentoProteses';
import AcompanhamentoPosInstalacao from './modules/AcompanhamentoPosInstalacao';
import Orcamento from './modules/Orcamento';
import Receituario from './modules/Receituario';
import Atestados from './modules/Atestados';
import * as Icons from 'lucide-react';

const STORAGE_PACIENTES = 'dental-pacientes';

function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (!result.success) {
      setError(result.error);
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-500 to-dental-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Smile className="w-16 h-16 mx-auto text-dental-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Sistema Odontológico</h1>
          <p className="text-gray-600 mt-2">Dr. Fábio Silva</p>
          <p className="text-gray-500 text-sm">CRO RJ 45678</p>
          <p className="text-gray-500 text-sm">Especialista em Próteses Dentárias</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-dental-600 text-white py-3 rounded-lg hover:bg-dental-700 transition-colors font-medium"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Usuários de teste:</p>
          <p className="mt-1">Dentista: <code className="bg-gray-100 px-2 py-1 rounded">fabio / FABIO2024</code></p>
          <p className="mt-1">Secretária: <code className="bg-gray-100 px-2 py-1 rounded">secretaria / SEC2024</code></p>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const { user, logout, isDentista, isSecretaria } = useAuth();
  const [pacientes, setPacientes] = useState([]);
  const [view, setView] = useState('lista');
  const [pacienteAtual, setPacienteAtual] = useState(null);
  const [activeTab, setActiveTab] = useState('cadastro');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    const savedPacientes = localStorage.getItem(STORAGE_PACIENTES);
    if (savedPacientes) {
      setPacientes(JSON.parse(savedPacientes));
    }
  }, []);

  const handleNovoPaciente = () => {
    const id = `pac_${Date.now()}`;
    const novoPaciente = {
      id,
      nome: 'Novo Paciente',
      dataNascimento: '',
      dataCadastro: new Date().toISOString()
    };

    const novosPacientes = [...pacientes, novoPaciente];
    setPacientes(novosPacientes);
    localStorage.setItem(STORAGE_PACIENTES, JSON.stringify(novosPacientes));

    setPacienteAtual(novoPaciente);
    setView('prontuario');
    setActiveTab('cadastro');
  };

  const handleSelecionarPaciente = (paciente) => {
    setPacienteAtual(paciente);
    setView('prontuario');
    setActiveTab('cadastro');
  };

  const handleVoltar = () => {
    setView('lista');
    setPacienteAtual(null);
  };

  const handleSaveCadastro = (dados) => {
    const novosPacientes = pacientes.map(p =>
      p.id === pacienteAtual.id ? { ...p, ...dados } : p
    );
    setPacientes(novosPacientes);
    localStorage.setItem(STORAGE_PACIENTES, JSON.stringify(novosPacientes));
    setPacienteAtual({ ...pacienteAtual, ...dados });
  };

  const handleDeletePaciente = (pacienteId) => {
    const novosPacientes = pacientes.filter(p => p.id !== pacienteId);
    setPacientes(novosPacientes);
    localStorage.setItem(STORAGE_PACIENTES, JSON.stringify(novosPacientes));
    setView('lista');
    setPacienteAtual(null);
  };

  const handleExportarDados = () => {
    const backup = {
      versao: '1.0',
      dataExportacao: new Date().toISOString(),
      pacientes: pacientes,
      dadosCompletos: {}
    };

    pacientes.forEach(paciente => {
      const dadosPaciente = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(paciente.id)) {
          dadosPaciente[key] = JSON.parse(localStorage.getItem(key));
        }
      }
      backup.dadosCompletos[paciente.id] = dadosPaciente;
    });

    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-odontologia-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    alert('✅ Backup exportado com sucesso!');
  };

  const fileInputRef = useRef(null);

  const handleImportarDados = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        if (!backup.versao || !backup.pacientes || !backup.dadosCompletos) {
          alert('❌ Arquivo de backup inválido!');
          return;
        }

        const confirmacao = window.confirm(
          `⚠️ ATENÇÃO!\n\nVocê está prestes a IMPORTAR um backup.\n\n` +
          `Este backup contém ${backup.pacientes.length} paciente(s).\n` +
          `Data do backup: ${new Date(backup.dataExportacao).toLocaleString('pt-BR')}\n\n` +
          `Deseja continuar?`
        );

        if (!confirmacao) return;

        const pacientesExistentes = JSON.parse(localStorage.getItem(STORAGE_PACIENTES) || '[]');
        const todosIds = new Set(pacientesExistentes.map(p => p.id));

        backup.pacientes.forEach(paciente => {
          if (!todosIds.has(paciente.id)) {
            pacientesExistentes.push(paciente);
          }
        });

        localStorage.setItem(STORAGE_PACIENTES, JSON.stringify(pacientesExistentes));
        setPacientes(pacientesExistentes);

        Object.keys(backup.dadosCompletos).forEach(pacienteId => {
          const dadosPaciente = backup.dadosCompletos[pacienteId];
          Object.keys(dadosPaciente).forEach(key => {
            localStorage.setItem(key, JSON.stringify(dadosPaciente[key]));
          });
        });

        alert(`✅ Backup importado com sucesso!\n\n${backup.pacientes.length} paciente(s) importado(s).`);
      } catch (error) {
        alert('❌ Erro ao importar backup:\n\n' + error.message);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const pacientesFiltrados = pacientes.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const renderTabContent = () => {
    if (!pacienteAtual) return null;

    switch (activeTab) {
      case 'cadastro':
        return <CadastroPaciente pacienteId={pacienteAtual.id} onSave={handleSaveCadastro} onDelete={handleDeletePaciente} />;
      case 'agendamento':
        return <Agendamento pacienteId={pacienteAtual.id} pacienteNome={pacienteAtual.nome} />;
      case 'exames':
        return <ExamesMoldes pacienteId={pacienteAtual.id} />;
      case 'planejamento':
        return <PlanejamentoProteses pacienteId={pacienteAtual.id} />;
      case 'acompanhamento':
        return <AcompanhamentoPosInstalacao pacienteId={pacienteAtual.id} />;
      case 'orcamento':
        return <Orcamento pacienteId={pacienteAtual.id} pacienteNome={pacienteAtual.nome} />;
      case 'receituario':
        return <Receituario pacienteId={pacienteAtual.id} pacienteNome={pacienteAtual.nome} />;
      case 'atestados':
        return <Atestados pacienteId={pacienteAtual.id} pacienteNome={pacienteAtual.nome} />;
      default:
        return <div className="text-center p-8 text-gray-500">Módulo em desenvolvimento</div>;
    }
  };

  const getIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : <Icons.FileText className="w-5 h-5" />;
  };

  if (view === 'prontuario' && pacienteAtual) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleVoltar}
                  className="text-dental-600 hover:text-dental-700 font-medium"
                >
                  ← Voltar
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{pacienteAtual.nome}</h1>
                  <p className="text-sm text-gray-600">
                    {pacienteAtual.dataNascimento && `Nascimento: ${new Date(pacienteAtual.dataNascimento).toLocaleDateString('pt-BR')}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  {user.cro && <p className="text-xs text-gray-500">CRO: {user.cro}</p>}
                  <p className="text-xs text-gray-500">{isDentista() ? 'Dentista' : 'Secretária'}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {TABS_DENTAL.filter(tab => {
                if (isDentista()) return true;
                // Secretária tem acesso a Cadastro e Agendamento
                return tab.id === 'cadastro' || tab.id === 'agendamento';
              }).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-dental-600 text-dental-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {getIcon(tab.icon)}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {renderTabContent()}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smile className="w-8 h-8 text-dental-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Sistema Odontológico</h1>
                <p className="text-sm text-gray-600">Dr. Fábio Silva - CRO RJ 45678</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                {user.cro && <p className="text-xs text-gray-500">CRO: {user.cro}</p>}
                <p className="text-xs text-gray-500">{isDentista() ? 'Dentista' : 'Secretária'}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar paciente..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dental-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleExportarDados}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            Exportar Backup
          </button>

          <button
            onClick={handleImportarDados}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Upload className="w-5 h-5" />
            Importar Backup
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            style={{ display: 'none' }}
          />

          <button
            onClick={handleNovoPaciente}
            className="flex items-center gap-2 bg-dental-600 text-white px-6 py-3 rounded-lg hover:bg-dental-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Novo Paciente
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Pacientes ({pacientesFiltrados.length})
            </h2>
          </div>

          {pacientesFiltrados.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Nenhum paciente encontrado</p>
              <p className="text-sm mt-2">Clique em "Novo Paciente" para começar</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pacientesFiltrados.map(paciente => (
                <div
                  key={paciente.id}
                  onClick={() => handleSelecionarPaciente(paciente)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-dental-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-dental-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{paciente.nome}</p>
                        <p className="text-sm text-gray-600">
                          {paciente.dataNascimento && `Nascimento: ${new Date(paciente.dataNascimento).toLocaleDateString('pt-BR')}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      Cadastrado em {new Date(paciente.dataCadastro).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <MainApp /> : <LoginScreen />;
}

export default App;
