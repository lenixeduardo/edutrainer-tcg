# Cadastro obrigatório antes do WhatsApp

1. O cliente escolhe cartas e abre o carrinho; a ação **Informar dados e continuar** apresenta a etapa de cadastro.
2. Campos obrigatórios: nome, sobrenome, e-mail, telefone com DDD, CEP, rua/avenida, número, bairro, cidade e UF. Complemento é opcional.
3. Validar dados e consentimento expresso para envio ao WhatsApp. A mensagem inclui os dados de contato, endereço e o resumo das cartas; **não confirma venda nem reserva estoque**.
4. Dados não são enviados nem armazenados no servidor do catálogo. Só são salvos em **localStorage no dispositivo**, caso o cliente marque a opção de salvar; caso contrário são utilizados apenas durante o envio. Não há criação de conta nem senha.
5. O número de destino segue `NEXT_PUBLIC_WHATSAPP_NUMBER=5511984477950` no projeto da Vercel.
6. A aplicação é demonstrativa; não há cálculo automático de frete, transação ou confirmação de estoque.
7. O JavaScript prepara a URL `wa.me` via `encodeURIComponent` e a navegação é feita somente após validação e rechecagem do estoque.
8. Não enviar PII para analytics, logs ou URLs internas. Se implementar persistência de clientes no Supabase futuramente, acrescentar autenticação, políticas de acesso e mecanismos LGPD apropriados.
