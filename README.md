# 🏋️ IronLog — Deploy no Vercel

## Estrutura do projeto
```
ironlog/
├── public/
│   ├── manifest.json     ← PWA config
│   └── icon.svg          ← Ícone do app
├── src/
│   ├── App.jsx           ← App completo
│   └── main.jsx          ← Entry point
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

## 🚀 Deploy em 4 passos

### PASSO 1 — Criar conta no GitHub (gratuito)
1. Acesse **github.com** e crie uma conta
2. Clique em **"New repository"**
3. Nome: `ironlog` → **Create repository**

### PASSO 2 — Subir os arquivos
No GitHub, clique em **"uploading an existing file"** e arraste toda a pasta `ironlog/`.  
Clique em **"Commit changes"**.

### PASSO 3 — Criar conta no Vercel (gratuito)
1. Acesse **vercel.com**
2. Clique **"Sign Up"** → **"Continue with GitHub"**
3. Autorize o acesso

### PASSO 4 — Deploy
1. No Vercel, clique **"Add New Project"**
2. Importe o repositório `ironlog`
3. Configurações automáticas (Vite detectado) → clique **"Deploy"**
4. Aguarde ~1 minuto ✅

Seu app estará em: **https://ironlog.vercel.app** (ou similar)

---

## 📱 Instalar como app no celular

### Android (Chrome):
1. Abra o link no Chrome
2. Menu `⋮` → **"Adicionar à tela inicial"**
3. Confirme → ícone aparece na home

### iPhone (Safari):
1. Abra o link no Safari
2. Botão de compartilhar `□↑` → **"Adicionar à Tela de Início"**
3. Confirme → ícone aparece na home

---

## 🔄 Atualizar o app
Basta substituir o `App.jsx` no GitHub → Vercel faz novo deploy automático em ~1 min.

---

## ✅ Funcionalidades
- 🏋️ Registro de treinos + histórico
- 📐 6 programas (GVT, 5×5, PPL, Powerlifting, Arnold, Upper/Lower)
- 🏆 Recordes pessoais (1RM + carga máxima)
- ⏱️ Cronômetro de descanso automático
- 📹 GIF de execução + câmera de auto-gravação
- 🔥 HIIT com 3 níveis + calculadora de BPM (Karvonen)
- ⌚ Leitura de BPM via smartwatch (Web Bluetooth)
- 🎙️ Iron AI — assistente de voz com IA
- 💾 Dados salvos localmente no celular (sem servidor)
