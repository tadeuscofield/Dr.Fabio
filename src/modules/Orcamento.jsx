import { useState, useEffect } from 'react';
import { Calculator, Plus, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function Orcamento({ pacienteId, pacienteNome }) {
  const STORAGE_KEY = `dental-orcamento-${pacienteId}`;

  const [orcamentos, setOrcamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novoOrc, setNovoOrc] = useState({
    data: new Date().toISOString().split('T')[0],
    descricao: '',
    procedimentos: [],
    desconto: 0,
    formaPagamento: '',
    parcelas: 1,
    status: 'Pendente',
    observacoes: ''
  });

  const [novoProcedimento, setNovoProcedimento] = useState({ descricao: '', valor: '' });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setOrcamentos(JSON.parse(saved));
    }
  }, [pacienteId]);

  const salvar = (novos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novos));
    setOrcamentos(novos);
  };

  const addProcedimento = () => {
    if (!novoProcedimento.descricao || !novoProcedimento.valor) return;

    setNovoOrc(prev => ({
      ...prev,
      procedimentos: [...prev.procedimentos, { ...novoProcedimento, id: Date.now() }]
    }));
    setNovoProcedimento({ descricao: '', valor: '' });
  };

  const calcularTotal = (procedimentos, desconto = 0) => {
    const subtotal = procedimentos.reduce((acc, p) => acc + parseFloat(p.valor || 0), 0);
    return subtotal - (subtotal * (desconto / 100));
  };

  const handleSalvar = () => {
    if (novoOrc.procedimentos.length === 0) {
      alert('⚠️ ATENÇÃO!\n\nVocê precisa adicionar pelo menos um procedimento ao orçamento.\n\n📋 Passos:\n1. Preencha a descrição do procedimento\n2. Preencha o valor\n3. Clique no botão "Adicionar" (+)\n4. Depois clique em "Salvar Orçamento"');
      return;
    }

    const orc = {
      ...novoOrc,
      id: `orc_${Date.now()}`,
      total: calcularTotal(novoOrc.procedimentos, novoOrc.desconto),
      dataCadastro: new Date().toISOString()
    };

    salvar([...orcamentos, orc]);
    setNovoOrc({
      data: new Date().toISOString().split('T')[0],
      descricao: '',
      procedimentos: [],
      desconto: 0,
      formaPagamento: '',
      parcelas: 1,
      status: 'Pendente',
      observacoes: ''
    });
    setShowModal(false);
    alert('✅ Orçamento salvo!');
  };

  const gerarPDF = (orc) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('ORÇAMENTO ODONTOLÓGICO', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text('Dr. Fábio Silva - CRO RJ 45678', 105, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Paciente: ${pacienteNome}`, 20, 50);
    doc.text(`Data: ${new Date(orc.data).toLocaleDateString('pt-BR')}`, 20, 57);
    doc.text(`Orçamento: #${orc.id}`, 20, 64);

    let y = 80;
    doc.setFontSize(12);
    doc.text('PROCEDIMENTOS:', 20, y);

    y += 10;
    doc.setFontSize(10);
    orc.procedimentos.forEach((proc, idx) => {
      doc.text(`${idx + 1}. ${proc.descricao}`, 20, y);
      doc.text(`R$ ${parseFloat(proc.valor).toFixed(2)}`, 160, y);
      y += 7;
    });

    y += 10;
    const subtotal = orc.procedimentos.reduce((acc, p) => acc + parseFloat(p.valor || 0), 0);
    doc.text(`Subtotal: R$ ${subtotal.toFixed(2)}`, 140, y);

    if (orc.desconto > 0) {
      y += 7;
      doc.text(`Desconto (${orc.desconto}%): R$ ${(subtotal * (orc.desconto / 100)).toFixed(2)}`, 140, y);
    }

    y += 7;
    doc.setFontSize(12);
    doc.text(`TOTAL: R$ ${orc.total.toFixed(2)}`, 140, y);

    if (orc.formaPagamento) {
      y += 10;
      doc.setFontSize(10);
      doc.text(`Forma de Pagamento: ${orc.formaPagamento}`, 20, y);
      if (orc.parcelas > 1) {
        y += 7;
        doc.text(`Parcelamento: ${orc.parcelas}x de R$ ${(orc.total / orc.parcelas).toFixed(2)}`, 20, y);
      }
    }

    doc.save(`orcamento-${pacienteNome}-${orc.id}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-dental-600" />
          <h2 className="text-xl font-semibold text-gray-800">Orçamentos</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-dental-600 text-white px-4 py-2 rounded-lg hover:bg-dental-700"
        >
          <Plus className="w-4 h-4" />
          Novo Orçamento
        </button>
      </div>

      {orcamentos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Nenhum orçamento registrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orcamentos.map(orc => (
            <div key={orc.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Orçamento - {new Date(orc.data).toLocaleDateString('pt-BR')}
                  </h3>
                  <p className="text-sm text-gray-600">{orc.descricao}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    orc.status === 'Aprovado' ? 'bg-green-100 text-green-700' :
                    orc.status === 'Rejeitado' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {orc.status}
                  </span>
                  <button
                    onClick={() => gerarPDF(orc)}
                    className="text-dental-600 hover:text-dental-700"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-sm mb-3">
                {orc.procedimentos.map((proc, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{proc.descricao}</span>
                    <span className="font-medium">R$ {parseFloat(proc.valor).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">TOTAL:</span>
                  <span className="text-lg font-bold text-dental-600">R$ {orc.total.toFixed(2)}</span>
                </div>
                {orc.parcelas > 1 && (
                  <p className="text-sm text-gray-600 text-right">
                    {orc.parcelas}x de R$ {(orc.total / orc.parcelas).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Novo Orçamento</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      type="date"
                      value={novoOrc.data}
                      onChange={(e) => setNovoOrc(prev => ({ ...prev, data: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dental-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={novoOrc.status}
                      onChange={(e) => setNovoOrc(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dental-500"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Aprovado">Aprovado</option>
                      <option value="Rejeitado">Rejeitado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={novoOrc.descricao}
                    onChange={(e) => setNovoOrc(prev => ({ ...prev, descricao: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dental-500"
                    placeholder="Ex: Prótese Total Superior e Inferior"
                  />
                </div>

                <div className="border-2 border-dental-200 rounded-lg p-4 bg-dental-50">
                  <h4 className="font-semibold mb-3 text-dental-800">📋 Adicionar Procedimento</h4>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={novoProcedimento.descricao}
                      onChange={(e) => setNovoProcedimento(prev => ({ ...prev, descricao: e.target.value }))}
                      className="flex-1 px-3 py-2 border-2 border-dental-300 rounded-lg focus:ring-2 focus:ring-dental-500"
                      placeholder="Descrição do procedimento"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={novoProcedimento.valor}
                      onChange={(e) => setNovoProcedimento(prev => ({ ...prev, valor: e.target.value }))}
                      className="w-40 px-3 py-2 border-2 border-dental-300 rounded-lg focus:ring-2 focus:ring-dental-500"
                      placeholder="Valor R$"
                    />
                    <button
                      onClick={addProcedimento}
                      className="bg-dental-600 text-white px-6 py-2 rounded-lg hover:bg-dental-700 font-medium flex items-center gap-2"
                      title="Clique aqui para adicionar o procedimento à lista"
                    >
                      <Plus className="w-5 h-5" />
                      Adicionar
                    </button>
                  </div>
                  <p className="text-xs text-dental-600">💡 Preencha os campos acima e clique em "Adicionar" para incluir o procedimento no orçamento</p>

                  {novoOrc.procedimentos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {novoOrc.procedimentos.map((proc, idx) => (
                        <div key={proc.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                          <span>{proc.descricao}</span>
                          <span className="font-medium">R$ {parseFloat(proc.valor).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t flex justify-between font-semibold">
                        <span>Subtotal:</span>
                        <span>R$ {calcularTotal(novoOrc.procedimentos).toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (%)</label>
                    <input
                      type="number"
                      value={novoOrc.desconto}
                      onChange={(e) => setNovoOrc(prev => ({ ...prev, desconto: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Forma Pagamento</label>
                    <select
                      value={novoOrc.formaPagamento}
                      onChange={(e) => setNovoOrc(prev => ({ ...prev, formaPagamento: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Selecione</option>
                      <option value="Dinheiro">Dinheiro</option>
                      <option value="Cartão">Cartão</option>
                      <option value="PIX">PIX</option>
                      <option value="Transferência">Transferência</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parcelas</label>
                    <input
                      type="number"
                      value={novoOrc.parcelas}
                      onChange={(e) => setNovoOrc(prev => ({ ...prev, parcelas: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="1"
                    />
                  </div>
                </div>

                {novoOrc.procedimentos.length > 0 && (
                  <div className="bg-dental-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>TOTAL:</span>
                      <span className="text-dental-600">
                        R$ {calcularTotal(novoOrc.procedimentos, novoOrc.desconto).toFixed(2)}
                      </span>
                    </div>
                    {novoOrc.parcelas > 1 && (
                      <p className="text-sm text-gray-600 text-right mt-1">
                        {novoOrc.parcelas}x de R$ {(calcularTotal(novoOrc.procedimentos, novoOrc.desconto) / novoOrc.parcelas).toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSalvar}
                  className="flex-1 bg-dental-600 text-white py-2 rounded-lg hover:bg-dental-700"
                >
                  Salvar Orçamento
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
