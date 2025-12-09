import React, { useState, useEffect } from 'react';
import { Send, Church, Users, Heart, Clock, List, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function ChurchMinistryForm() {
  const [view, setView] = useState('form');
  const [senhaAdmin, setSenhaAdmin] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [erroSenha, setErroSenha] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    tempoMembro: '',
    atividadesAnteriores: '',
    ministerios: [],
    disponibilidade: []
  });

  const [inscricoes, setInscricoes] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingInscricoes, setLoadingInscricoes] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const SENHA_ADMIN = 'IgrejaBN2026';

  const ministerios = [
    { id: 'infantil', nome: 'Departamento Infantil', icon: '👶' },
    { id: 'jovens', nome: 'Departamento de Jovens', icon: '🎓' },
    { id: 'mulheres', nome: 'Departamento de Mulheres', icon: '👩' },
    { id: 'homens', nome: 'Departamento de Homens', icon: '👨' },
    { id: 'escola_dominical', nome: 'Escola Dominical', icon: '📖' },
    { id: 'culto_oracao', nome: 'Culto de Oração', icon: '🙏' },
    { id: 'visitacao', nome: 'Visitação', icon: '🚶' },
    { id: 'pastoreio_lar', nome: 'Pastoreio do Lar', icon: '🏠' },
    { id: 'evangelismo_rua', nome: 'Evangelismo de Rua', icon: '📢' },
    { id: 'aconselhamento', nome: 'Aconselhamento Cristão', icon: '💬' },
    { id: 'louvor', nome: 'Louvor', icon: '🎵' }
  ];

  const disponibilidades = [
    { id: 'domingo_manha', label: 'Domingo - Manhã' },
    { id: 'domingo_noite', label: 'Domingo - Noite' },
    { id: 'segunda', label: 'Segunda-feira' },
    { id: 'terca', label: 'Terça-feira' },
    { id: 'quarta', label: 'Quarta-feira' },
    { id: 'quinta', label: 'Quinta-feira' },
    { id: 'sexta', label: 'Sexta-feira' },
    { id: 'sabado', label: 'Sábado' }
  ];

  useEffect(() => {
    carregarInscricoes();
  }, []);

  const carregarInscricoes = () => {
    const dados = localStorage.getItem('inscricoes_ibn');
    if (dados) {
      setInscricoes(JSON.parse(dados));
    }
  };

  const salvarInscricoes = (novasInscricoes) => {
    localStorage.setItem('inscricoes_ibn', JSON.stringify(novasInscricoes));
    setInscricoes(novasInscricoes);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMinisterioToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      ministerios: prev.ministerios.includes(id)
        ? prev.ministerios.filter(m => m !== id)
        : [...prev.ministerios, id]
    }));
  };

  const handleDisponibilidadeToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      disponibilidade: prev.disponibilidade.includes(id)
        ? prev.disponibilidade.filter(d => d !== id)
        : [...prev.disponibilidade, id]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.email || !formData.telefone || !formData.dataNascimento || !formData.tempoMembro) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.ministerios.length === 0) {
      alert('Selecione pelo menos um ministério.');
      return;
    }

    if (formData.disponibilidade.length === 0) {
      alert('Selecione pelo menos um horário de disponibilidade.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const inscricaoId = `inscricao_${Date.now()}`;
      const inscricaoData = {
        ...formData,
        id: inscricaoId,
        dataInscricao: new Date().toLocaleString('pt-BR')
      };

      const novasInscricoes = [...inscricoes, inscricaoData];
      salvarInscricoes(novasInscricoes);
      
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    if (!confirm('Tem certeza que deseja excluir esta inscrição?')) return;
    
    const novasInscricoes = inscricoes.filter(i => i.id !== id);
    salvarInscricoes(novasInscricoes);
    alert('Inscrição excluída com sucesso!');
  };

  const handleLimparTodas = () => {
    if (!confirm('⚠️ ATENÇÃO: Isso irá excluir TODAS as inscrições permanentemente. Deseja continuar?')) return;
    if (!confirm('Tem certeza absoluta? Esta ação não pode ser desfeita!')) return;
    
    salvarInscricoes([]);
    alert('Todas as inscrições foram excluídas com sucesso!');
  };

  const handleLoginAdmin = () => {
    if (senhaAdmin === SENHA_ADMIN) {
      setAutenticado(true);
      setView('admin');
      setErroSenha(false);
      setSenhaAdmin('');
    } else {
      setErroSenha(true);
      setTimeout(() => setErroSenha(false), 3000);
    }
  };

  const handleLogout = () => {
    setAutenticado(false);
    setView('form');
    setSenhaAdmin('');
  };

  const abrirLogin = () => {
    setView('login');
    setSenhaAdmin('');
    setErroSenha(false);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      dataNascimento: '',
      tempoMembro: '',
      atividadesAnteriores: '',
      ministerios: [],
      disponibilidade: []
    });
    setSubmitted(false);
  };

  const getMinisterioNome = (id) => {
    return ministerios.find(m => m.id === id)?.nome || id;
  };

  const getDisponibilidadeLabel = (id) => {
    return disponibilidades.find(d => d.id === id)?.label || id;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Inscrição Realizada com Sucesso!
          </h2>
          <p className="text-gray-600 mb-6">
            Obrigado por se voluntariar para servir no ministério da Igreja Batista Nacional. 
            Em breve entraremos em contato!
          </p>
          <div className="space-y-3">
            <button
              onClick={resetForm}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Nova Inscrição
            </button>
            {autenticado && (
              <button
                onClick={() => setView('admin')}
                className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center justify-center"
              >
                <List className="w-5 h-5 mr-2" />
                Ver Todas as Inscrições
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="mb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Acesso Administrativo
            </h2>
            <p className="text-gray-600 text-sm">
              Digite a senha para acessar o painel
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha do Administrador
              </label>
              <input
                type="password"
                value={senhaAdmin}
                onChange={(e) => setSenhaAdmin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLoginAdmin()}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  erroSenha ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Digite a senha"
                autoFocus
              />
              {erroSenha && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  ⚠️ Senha incorreta. Tente novamente.
                </p>
              )}
            </div>

            <button
              onClick={handleLoginAdmin}
              disabled={!senhaAdmin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Entrar
            </button>

            <button
              onClick={() => setView('form')}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Voltar
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>🔐 Senha Configurada:</strong> Use sua senha personalizada para acessar o painel administrativo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <List className="w-8 h-8 mr-3" />
                  <div>
                    <h1 className="text-2xl font-bold">Painel Administrativo</h1>
                    <p className="text-blue-100 text-sm">Gerenciar Inscrições Ministeriais</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setView('form')}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Nova Inscrição
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Total de Inscrições: {inscricoes.length}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={carregarInscricoes}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Atualizar
                  </button>
                  {inscricoes.length > 0 && (
                    <button
                      onClick={handleLimparTodas}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpar Tudo
                    </button>
                  )}
                </div>
              </div>

              {inscricoes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Church className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma inscrição cadastrada ainda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inscricoes.map((inscricao) => (
                    <div key={inscricao.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg">{inscricao.nome}</h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                            <span>📧 {inscricao.email}</span>
                            <span>📱 {inscricao.telefone}</span>
                            <span>📅 {inscricao.dataInscricao}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedId(expandedId === inscricao.id ? null : inscricao.id)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            {expandedId === inscricao.id ? (
                              <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(inscricao.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </div>

                      {expandedId === inscricao.id && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">Data de Nascimento:</p>
                              <p className="text-gray-600">{inscricao.dataNascimento}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-1">Tempo como Membro:</p>
                              <p className="text-gray-600">{inscricao.tempoMembro}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm font-semibold text-gray-700 mb-1">Ministérios de Interesse:</p>
                              <div className="flex flex-wrap gap-2">
                                {inscricao.ministerios.map(m => (
                                  <span key={m} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {getMinisterioNome(m)}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm font-semibold text-gray-700 mb-1">Disponibilidade:</p>
                              <div className="flex flex-wrap gap-2">
                                {inscricao.disponibilidade.map(d => (
                                  <span key={d} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    {getDisponibilidadeLabel(d)}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {inscricao.atividadesAnteriores && (
                              <div className="md:col-span-2">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Atividades Anteriores:</p>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{inscricao.atividadesAnteriores}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center flex-1">
                <Church className="w-12 h-12" />
              </div>
              <button
                onClick={abrirLogin}
                className="absolute right-8 top-8 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm"
              >
                <List className="w-4 h-4 mr-2" />
                Admin
              </button>
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">
              Igreja Batista Nacional
            </h1>
            <p className="text-center text-blue-100">
              Formulário de Inscrição para Atividades Ministeriais
            </p>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Dados Pessoais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="text"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="DD/MM/AAAA"
                    maxLength="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tempo como Membro *
                  </label>
                  <input
                    type="text"
                    name="tempoMembro"
                    value={formData.tempoMembro}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 2 anos, 6 meses..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Atividades Ministeriais que Já Atuou
                  </label>
                  <textarea
                    name="atividadesAnteriores"
                    value={formData.atividadesAnteriores}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Descreva suas experiências anteriores em ministérios (opcional)"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Ministérios de Interesse
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Selecione os ministérios que você tem interesse em participar:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ministerios.map(ministerio => (
                  <label
                    key={ministerio.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.ministerios.includes(ministerio.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.ministerios.includes(ministerio.id)}
                      onChange={() => handleMinisterioToggle(ministerio.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-2xl">{ministerio.icon}</span>
                    <span className="ml-2 text-gray-700 font-medium">
                      {ministerio.nome}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Disponibilidade
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Selecione os dias e horários em que você está disponível:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {disponibilidades.map(disp => (
                  <label
                    key={disp.id}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.disponibilidade.includes(disp.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.disponibilidade.includes(disp.id)}
                      onChange={() => handleDisponibilidadeToggle(disp.id)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-gray-700 text-sm font-medium">
                      {disp.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Inscrição
                  </>
                )}
              </button>
            </div>

            {formData.ministerios.length === 0 && (
              <p className="text-center text-sm text-red-600 mt-4">
                * Selecione pelo menos um ministério
              </p>
            )}
            {formData.disponibilidade.length === 0 && (
              <p className="text-center text-sm text-red-600 mt-2">
                * Selecione pelo menos um horário de disponibilidade
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}