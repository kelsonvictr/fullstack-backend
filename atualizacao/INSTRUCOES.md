# Instruções para Montar o HTML Atualizado

## Visão Geral
O HTML original precisa de 3 alterações:

---

## Alteração 1: Atualizar o Sidebar (menu lateral)

**Localizar:** O bloco `<div class="sidebar-group">` que contém "Capítulo 1 — Fornecedor"

**Substituir** os dois sidebar-groups (Fornecedor + Próximos capítulos) pelo conteúdo do arquivo `sidebar-updates.html`

Isso adiciona:
- Link "Testando no Insomnia" dentro de Fornecedor
- Seção completa "Capítulo 2 — Produto" com todos os links
- Atualiza "Próximos capítulos" para mostrar Cliente

---

## Alteração 2: Inserir seção Insomnia após Demo do Fornecedor

**Localizar:** O fechamento da section `forn-demo`:
```html
</section>

<div class="section-connector"><div class="line"></div></div>
```
(Que fica logo antes do comentário "PRÓXIMOS CAPÍTULOS")

**Inserir** o conteúdo de `section-insomnia.html` + um `<div class="section-connector"><div class="line"></div></div>` DEPOIS da section forn-demo

---

## Alteração 3: Substituir "Próximos Capítulos" pelo Capítulo de Produto

**Localizar:** Todo o bloco desde:
```html
<!-- ════════════════════════════════════════ -->
<!-- PRÓXIMOS CAPÍTULOS (COMING SOON) -->
```

Até o fechamento dessa section (antes do "RESUMO FINAL" do Fornecedor).

**Substituir** por:
1. `section-produto-concepts.html` (conceitos didáticos)
2. `section-produto-code.html` (código de cada arquivo)
3. `section-proximos.html` (novo "Próximos capítulos" atualizado)

---

## Alteração 4: Atualizar o Roadmap na seção "overview"

**Localizar:** O roadmap com as 3 fases dentro da section `id="overview"`.

**Atualizar** a Fase 1 para:
```html
<span style="font-size:0.7rem;background:rgba(73,204,144,0.15);color:#49cc90;padding:2px 8px;border-radius:4px;margin-left:6px">CONCLUÍDO ✅</span>
```

E a Fase 2 para:
```html
<span style="font-size:0.7rem;background:rgba(73,204,144,0.15);color:#49cc90;padding:2px 8px;border-radius:4px;margin-left:6px">AGORA</span>
```

---

## Ordem final das seções no HTML:

1. Hero
2. Tour PostgreSQL (tudo igual)
3. Arquitetura em Camadas (igual)
4. Setup do Projeto (igual)
5. **Capítulo 1 — Fornecedor** (igual + NOVA seção Insomnia)
6. **Capítulo 2 — Produto** (NOVO - conceitos + código)
7. Próximos Capítulos (ATUALIZADO)
8. Resumo Final (manter o do Fornecedor, mas ajustar texto)
9. Footer
