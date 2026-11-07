# Publicação do EduTrainer TCG

## Revisão
Esta versão é um MVP de demonstração com 11 cartas. Valores foram transcritos das montagens; condição e estoque ainda não foram verificados. A etapa de WhatsApp depende da configuração do número comercial e da aprovação dos anúncios.

## GitHub
Crie um repositório privado `edutrainer-tcg` na conta GitHub que você controla, sem inicializar com README.

```bash
git remote add origin https://github.com/SEU_USUARIO/edutrainer-tcg.git
git push -u origin main
```

## Vercel
Importe o GitHub no painel da Vercel como projeto Next.js com Root Directory `/` e Production Branch `main`. O deploy sem variáveis é DEMO e não recebe pedidos comerciais reais.

## Supabase / WhatsApp
Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e `NEXT_PUBLIC_WHATSAPP_NUMBER` diretamente nas configurações da Vercel (nunca comite segredos). Execute e revise o SQL de schema e importação; crie a conta administrativa de forma privada, e confirme fotos, idioma, condição, quantidade e frete antes de publicar as cartas.

## Validação
Rode `npm install`, `npm run test:logic`, `npm run test:seed`, `npm run typecheck`, `npm run build` após liberar acesso ao npm.
