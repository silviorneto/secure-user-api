# API REST Segura para Gestão de Utilizadores

Projecto académico — Desenvolvimento de Software Seguro, ISCTE-IUL MSc 2025/2026.

API REST de gestão de utilizadores implementada com Node.js + TypeScript + Express + PostgreSQL, aplicando princípios SSDLC, modelação de ameaças STRIDE e mitigações OWASP Top 10 (2025).

## Instalação e arranque

```bash
docker compose up -d                        # inicia PostgreSQL (requer Docker)
pnpm install                                # instala dependências
cp .env.example .env                        # configura variáveis de ambiente
pnpm dlx prisma migrate dev --name init     # cria tabelas (dev only)
pnpm run seed                               # cria utilizadores de teste
pnpm start                                  # arranca a API em localhost:3000
```

## Endpoints

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | /api/auth/register | Registo de utilizador | Nenhuma |
| POST | /api/auth/login | Login (devolve JWT) | Nenhuma |
| GET | /api/users/profile | Ver perfil próprio | JWT |
| PUT | /api/users/profile | Actualizar perfil | JWT |
| GET | /api/admin/users | Listar utilizadores | JWT + role ADMIN |

## Dependências principais e justificação de segurança

| Dependência | Finalidade de segurança |
|-------------|------------------------|
| `express` | Framework HTTP; base do pipeline de middleware |
| `prisma` + `@prisma/client` | ORM type-safe; `omit` API previne exposição de campos sensíveis |
| `zod` | Validação de input em runtime; previne injecção e dados malformados |
| `jsonwebtoken` | Autenticação stateless com expiração curta (15 min) |
| `bcrypt` | Hashing de passwords com cost factor 12; resistente a brute-force |
| `helmet` | Define HTTP security headers (CSP, HSTS, X-Frame-Options, etc.) |
| `express-rate-limit` | Protecção contra brute-force e DoS por rate limiting |
| `winston` | Logging estruturado com IP e timestamp; passwords nunca logadas |
| `cors` | CORS restritivo: apenas a origin definida em `.env` |

## Utilizadores de teste (seed)

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | Admin123! | ADMIN |
| user@test.com | User1234! | USER |

---

> Projecto académico — DSS ISCTE-IUL 2025/2026
