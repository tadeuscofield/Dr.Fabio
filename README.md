# Sistema de Gestão Odontológica - Dr. Fábio Amaral

Sistema completo de gestão para clínica odontológica especializada em próteses dentárias.

## Especialidade: Próteses Dentárias

Sistema desenvolvido especificamente para dentistas especialistas em próteses, com módulos adaptados para:
- Planejamento de próteses (fixas, removíveis, sobre implantes)
- Gestão de exames e moldes
- Acompanhamento pós-instalação
- Orçamentos detalhados
- Controle de laboratórios

## Funcionalidades Principais

### 1. Cadastro de Pacientes
- Dados pessoais completos
- Histórico odontológico detalhado
- Perdas dentárias e condições de gengiva
- Alergias a materiais odontológicos (látex, níquel, acrílico, etc.)
- Alergias a medicamentos
- Doenças pré-existentes
- Convênios

### 2. Exames e Moldes
- Upload de raios-X (panorâmico, periapical)
- Tomografias
- Fotos intraorais e extraorais
- Moldes digitais e físicos
- Scanner intraoral
- Marcações de áreas críticas
- Organização por data e paciente

### 3. Planejamento de Próteses
- Tipos: fixa, removível, total, sobre implante, coroa, ponte, faceta
- Materiais: cerâmica, porcelana, acrílico, resina, zircônia, metalocerâmica
- Status do trabalho: planejamento, fabricação, prova, instalado
- Integração com laboratório
- Especificações técnicas
- Controle de custos (materiais + laboratório)
- Seleção de cor
- Localização (dentes específicos)

### 4. Acompanhamento Pós-Instalação
- Registro da data de instalação
- Agenda de retornos (1 semana, 1 mês)
- Avaliação de conforto
- Avaliação de funcionalidade (mastigação, fala)
- Ajustes e correções
- Feedback do paciente
- Lembretes de manutenção

### 5. Orçamentos
- Cálculo detalhado por procedimento
- Sistema de descontos
- Parcelamento
- Controle de aprovação
- Geração de PDF para o paciente
- Histórico de orçamentos

### 6. Receituário
- Prescrição de medicamentos pós-procedimento
- Analgésicos e anti-inflamatórios
- Dosagem, frequência e duração
- Orientações de uso
- Geração de PDF

### 7. Atestados
- Atestado de comparecimento
- Atestado de afastamento
- Dias de afastamento personalizáveis
- CID (opcional)
- Geração de PDF

## Controles de Acesso

### Dentista (Dr. Fábio)
- Login: `fabio`
- Senha: `FABIO2024`
- Acesso total a todos os módulos

### Secretária
- Login: `secretaria`
- Senha: `SEC2024`
- Acesso apenas a: Cadastro de Pacientes e Agendamento

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto em modo desenvolvimento:
```bash
npm run dev
```

3. Acesse no navegador:
```
http://localhost:5173
```

## Build para Produção

```bash
npm run build
```

O build será gerado na pasta `dist/`.

## Tecnologias Utilizadas

- **React 18.2** - Framework JavaScript
- **Vite** - Build tool
- **TailwindCSS 3.3** - Framework CSS
- **Lucide React** - Ícones
- **jsPDF** - Geração de PDFs
- **LocalStorage** - Armazenamento local de dados

## Recursos Especiais

### Backup e Restauração
- Exportação completa de todos os dados
- Importação de backups
- Formato JSON
- Inclui todos os pacientes e seus dados relacionados

### Armazenamento de Arquivos
- Upload de imagens (raios-X, fotos)
- Upload de PDFs
- Armazenamento em Base64 no navegador

### Geração de Documentos
- PDFs profissionais para orçamentos
- PDFs para receitas médicas
- PDFs para atestados
- Cabeçalho personalizado com dados do dentista

## Estrutura de Pastas

```
dentista-fabio/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   └── CadastroPaciente.jsx
│   ├── contexts/          # Contextos React
│   │   └── AuthContext.jsx
│   ├── config/            # Configurações
│   │   └── modules.js
│   ├── modules/           # Módulos principais
│   │   ├── ExamesMoldes.jsx
│   │   ├── PlanejamentoProteses.jsx
│   │   ├── AcompanhamentoPosInstalacao.jsx
│   │   ├── Orcamento.jsx
│   │   ├── Receituario.jsx
│   │   └── Atestados.jsx
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Entry point
│   └── index.css          # Estilos globais
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Personalização

Para personalizar o sistema para outro dentista:

1. **Dados do Dentista**: Edite `src/contexts/AuthContext.jsx`
2. **Cores do Sistema**: Edite `tailwind.config.js`
3. **Tipos de Próteses**: Edite `src/config/modules.js`
4. **Materiais**: Edite `src/config/modules.js`

## Suporte

Sistema desenvolvido para gestão profissional de clínicas odontológicas especializadas em próteses dentárias.

---

**Dr. Fábio Amaral - CRO RJ 45678**
*Especialista em Próteses Dentárias*
