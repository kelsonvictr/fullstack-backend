#!/usr/bin/env python3
"""
Extrai as 8 grandes secoes do index.html para arquivos .txt em texto plano,
preservando todo o conteudo (textos, codigos, comandos, listas).

As 8 secoes sao definidas por IDs-marco que delimitam o inicio de cada bloco
no DOM. O conteudo de cada secao vai do seu marco ate o marco da proxima
secao (a ultima inclui ate o final do <body>).
"""
import os
import re
from bs4 import BeautifulSoup, NavigableString, Tag

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
HTML_FILE = os.path.join(ROOT, "index.html")

# (numero, id_inicio, titulo)
# O fim de cada secao e o id_inicio da proxima. A ultima vai ate o fim do body.
SECTIONS = [
    ("1", "hero",            "Introducao - Visao Geral"),
    ("2", "tour-pg",         "Tour PostgreSQL"),
    ("3", "overview",        "Projeto Spring - Arquitetura e Setup"),
    ("4", "cap-forn",        "Capitulo 1 - Fornecedor"),
    ("5", "cap-prod",        "Capitulo 2 - Produto"),
    ("6", "cap-petshop",     "Desafio - PetShop"),
    ("7", "cap-cli",         "Capitulo 3 - Cliente"),
    ("8", "cap-forn-refac",  "Capitulo 4 - Refatorar Fornecedor"),
]


def slugify(s):
    s = s.lower()
    s = re.sub(r"[áàãâä]", "a", s)
    s = re.sub(r"[éèêë]", "e", s)
    s = re.sub(r"[íìîï]", "i", s)
    s = re.sub(r"[óòõôö]", "o", s)
    s = re.sub(r"[úùûü]", "u", s)
    s = re.sub(r"[ç]", "c", s)
    s = re.sub(r"[^a-z0-9]+", "_", s)
    s = re.sub(r"_+", "_", s).strip("_")
    return s


BLOCK_TAGS = {
    "p", "div", "section", "header", "footer", "nav", "article", "aside",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "dl", "dt", "dd",
    "table", "thead", "tbody", "tfoot", "tr",
    "blockquote", "pre", "figure", "figcaption",
    "hr", "br",
}


def has_class(node, cls):
    if not isinstance(node, Tag):
        return False
    classes = node.get("class") or []
    return cls in classes


def collect_text(node):
    if node is None:
        return ""
    txt = node.get_text(separator=" ", strip=False) if isinstance(node, Tag) else str(node)
    return re.sub(r"\s+", " ", txt).strip()


def render(node, out, in_pre=False, tooltip_buffer=None):
    if isinstance(node, NavigableString):
        text = str(node)
        if in_pre:
            out.append(text)
        else:
            text = re.sub(r"[ \t\r\f\v]+", " ", text)
            text = text.replace("\n", " ")
            out.append(text)
        return

    if not isinstance(node, Tag):
        return

    name = node.name.lower() if node.name else ""

    if name in {"script", "style", "noscript", "svg", "canvas", "iframe", "meta", "link"}:
        return

    if has_class(node, "line-numbers"):
        return

    if has_class(node, "anno-tooltip"):
        if tooltip_buffer is not None:
            tip_text = collect_text(node)
            if tip_text:
                tooltip_buffer.append(tip_text)
        return

    if name == "br":
        out.append("\n")
        return

    if name == "hr":
        out.append("\n----------\n")
        return

    if name == "pre":
        local_tips = []
        out.append("\n\n```\n")
        for child in node.children:
            render(child, out, in_pre=True, tooltip_buffer=local_tips)
        if out and not out[-1].endswith("\n"):
            out.append("\n")
        out.append("```\n")
        if local_tips:
            out.append("\nAnotacoes:\n")
            for t in local_tips:
                out.append(f"- {t}\n")
        out.append("\n")
        return

    if name == "code" and not in_pre:
        out.append("`")
        for child in node.children:
            render(child, out, in_pre=True, tooltip_buffer=tooltip_buffer)
        out.append("`")
        return

    if name == "li":
        out.append("\n- ")
        for child in node.children:
            render(child, out, in_pre=in_pre, tooltip_buffer=tooltip_buffer)
        return

    if name == "tr":
        cells = []
        for cell in node.find_all(["td", "th"], recursive=False):
            buf = []
            for child in cell.children:
                render(child, buf, in_pre=False, tooltip_buffer=tooltip_buffer)
            cells.append(re.sub(r"\s+", " ", "".join(buf)).strip())
        out.append("\n" + " | ".join(cells))
        return

    is_block = name in BLOCK_TAGS

    if is_block:
        out.append("\n")

    if name in {"h1", "h2", "h3", "h4", "h5", "h6"}:
        level = int(name[1])
        out.append("\n" + ("#" * level) + " ")

    for child in node.children:
        render(child, out, in_pre=in_pre, tooltip_buffer=tooltip_buffer)

    if is_block:
        out.append("\n")


def clean_output(text):
    lines = text.split("\n")
    cleaned = []
    in_code = False
    for ln in lines:
        if ln.strip().startswith("```"):
            in_code = not in_code
            cleaned.append(ln.rstrip())
            continue
        if in_code:
            cleaned.append(ln)
        else:
            ln = re.sub(r"[ \t]+", " ", ln)
            ln = ln.strip()
            cleaned.append(ln)
    text = "\n".join(cleaned)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() + "\n"


def find_node_by_id(soup, target_id):
    return soup.find(id=target_id)


def common_ancestor_path(node, root):
    """Retorna a cadeia de ancestrais de node ate root (inclusivo)."""
    path = []
    cur = node
    while cur is not None and cur is not root:
        path.append(cur)
        cur = cur.parent
    if cur is root:
        path.append(root)
    return path


def find_common_parent(nodes):
    """Encontra o ancestral comum mais profundo de uma lista de nos."""
    if not nodes:
        return None
    # Caminho de ancestrais do primeiro no
    base_path = []
    n = nodes[0]
    while n is not None:
        base_path.append(n)
        n = n.parent
    base_set = {id(x): i for i, x in enumerate(base_path)}

    common_idx = 0
    for node in nodes[1:]:
        cur = node
        while cur is not None and id(cur) not in base_set:
            cur = cur.parent
        if cur is None:
            return None
        common_idx = max(common_idx, base_set[id(cur)])
    return base_path[common_idx]


def ascend_to_child_of(node, target_parent):
    """Sobe `node` ate que seu .parent seja `target_parent`."""
    cur = node
    while cur is not None and cur.parent is not target_parent:
        cur = cur.parent
    return cur


def iter_nodes_between(common_parent, start_id_node, end_id_node):
    """
    Coleta os irmaos top-level (filhos diretos de common_parent) a partir do
    ancestral de start (inclusive) ate o ancestral de end (exclusivo). Se
    end_id_node for None, vai ate o ultimo filho do common_parent.
    """
    start_anc = ascend_to_child_of(start_id_node, common_parent)
    end_anc = ascend_to_child_of(end_id_node, common_parent) if end_id_node else None
    if start_anc is None:
        return []
    result = []
    cur = start_anc
    while cur is not None and cur is not end_anc:
        result.append(cur)
        cur = cur.next_sibling
    return result


def main():
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")

    # Localiza todos os nos-marco e calcula o ancestral comum (deve ser o
    # <div class="container"> que envolve o material do curso).
    marker_nodes = [find_node_by_id(soup, sid) for _, sid, _ in SECTIONS]
    if any(n is None for n in marker_nodes):
        missing = [SECTIONS[i][1] for i, n in enumerate(marker_nodes) if n is None]
        print(f"ERRO: marcadores nao encontrados: {missing}")
        return
    common_parent = find_common_parent(marker_nodes)
    if common_parent is None:
        print("ERRO: ancestral comum dos marcadores nao foi encontrado.")
        return

    written = 0
    for i, (num, sec_id, title) in enumerate(SECTIONS):
        start_node = marker_nodes[i]
        end_node = marker_nodes[i + 1] if i + 1 < len(SECTIONS) else None
        nodes = iter_nodes_between(common_parent, start_node, end_node)
        if not nodes:
            print(f"AVISO: nao foi possivel localizar conteudo para {sec_id}")
            continue

        out = []
        out.append(f"# {title}\n")
        next_sid = SECTIONS[i + 1][1] if i + 1 < len(SECTIONS) else None
        out.append(f"(id inicial: {sec_id}; ate: {next_sid or 'fim do documento'})\n\n")

        for node in nodes:
            buf = []
            render(node, buf, in_pre=False)
            out.append("".join(buf))

        text = clean_output("".join(out))
        fname = f"{num}_{slugify(title)}.txt"
        fpath = os.path.join(HERE, fname)
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(text)
        written += 1
        print(f"OK  {fname}  ({len(text)} chars)")

    print(f"\nTotal: {written}/{len(SECTIONS)} arquivos gerados.")


if __name__ == "__main__":
    main()
