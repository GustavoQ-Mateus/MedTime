# MedTime

Protótipo front-end (HTML/CSS/JS puro) para organizar horários de medicamentos, com cadastro/login local (localStorage), lista com próxima dose e contagem regressiva ao vivo, edição/remoção e modo claro/escuro.

## Recursos principais

- HTML, CSS e JavaScript puros (sem frameworks)
- Acessível e responsivo (mobile-first, foco visível, skip link na landing)
- Cadastro e login com validação de telefone (11 dígitos: DDD + 9)
- Sessão persistida (localStorage) e guarda de rotas nas páginas autenticadas
- Perfil editável (nome, data de nascimento, telefone, gênero, altura, peso)
- Módulo de medicamentos:
	- Cadastro/edição com dosagem, unidade, frequência, hora da primeira dose, início/fim
	- Cálculo da próxima dose e contagem regressiva ao vivo
	- Armazenamento de datas como YYYY-MM-DD (sem UTC) para evitar off-by-one
	- Edição/Exclusão via modal na lista
- Tema claro/escuro com persistência

## Estrutura do projeto

```
MedTime/
├─ index.html                      # Landing (Entrar / Criar Conta)
├─ login.html                      # Entrar
├─ cadastro.html                   # Criar Conta
├─ lista-medicamentos.html         # Lista (pós-login)
├─ cadastrar-medicamentos.html     # Criar/Editar medicamento
├─ perfil.html                     # Editar Perfil
├─ configuracoes.html              # Tema claro/escuro
├─ assets/
│  ├─ css/
│  │  └─ style.css                # Estilos globais, componentes e responsividade
│  └─ js/
│     ├─ auth.js                  # Cadastro/Login, persistência de usuários e sessão
│     ├─ session.js               # Guarda de sessão e logout
│     ├─ meds.js                  # CRUD de medicamentos, próxima dose e contagem
│     ├─ theme.js                 # Tema claro/escuro (localStorage)
│     ├─ nav.js                   # Destaque do link ativo no topo
│     └─ main.js                  # Utilidades simples (foco inicial, ano no rodapé)
└─ README.md
```

## Como executar

Opção 1 (abrir arquivo):
- Clique duas vezes em `index.html` (ou abra no navegador). Para as páginas autenticadas, entre primeiro via `login.html`.

Opção 2 (servidor local opcional):
- Python (se instalado):
```powershell
py -m http.server 5500
# depois, acesse: http://localhost:5500/
```

## Como usar

1) Criar Conta
- Acesse `cadastro.html` e preencha os campos. O telefone deve ter 11 dígitos (DDD + 9).

2) Entrar
- Acesse `login.html` com o telefone (11 dígitos) e senha cadastrados. Você será redirecionado para `lista-medicamentos.html`.

3) Lista e cadastro de medicamentos
- Em `lista-medicamentos.html` você vê os registros do usuário logado, com próxima dose e contagem regressiva.
- Para criar/editar, vá em `cadastrar-medicamentos.html`. As datas são salvas como `YYYY-MM-DD` (sem timezone). A edição pode ser acionada também clicando no card e escolhendo “Editar”.
- Para excluir, clique no card e escolha “Excluir”.

4) Perfil e sessão
- Em `perfil.html` edite seus dados. Se alterar o telefone, o app verifica duplicidade.
- O botão “Sair” encerra a sessão e volta para `login.html`.

## Tema claro/escuro (manual)

- Em `configuracoes.html`, use o switch para alternar entre claro/escuro. A escolha é salva e reaplicada nas próximas visitas.

## Autor
[GustavoQ-Mateus](https://github.com/GustavoQ-Mateus)

---

Projeto desenvolvido para aprendizado e prática em desenvolvimento web.
Este projeto é fornecido tal como está, sem garantias. Adapte livremente conforme sua necessidade.

