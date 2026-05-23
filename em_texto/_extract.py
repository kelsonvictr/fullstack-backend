#!/usr/bin/env python3
"""
Extrai os 9 capitulos do material didatico (1 arquivo HTML por capitulo)
para arquivos .txt em texto plano, preservando o conteudo.

A partir da divisao do material em multiplos HTMLs (Maio/2026), cada
arquivo HTML eh um capitulo. O extrator le o <div class="container">
de cada arquivo (sem prof-banner / footer) e converte pra texto.
"""
import os
from bs4 import BeautifulSoup, Tag

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

CHAPTERS = [
    ("1", "cap-01-intro.html",                "Introducao - Visao Geral"),
    ("2", "cap-02-tour-postgresql.html",      "Tour PostgreSQL"),
    ("3", "cap-03-overview-spring.html",      "Projeto Spring - Arquitetura e Setup"),
    ("4", "cap-04-fornecedor.html",           "Capitulo 1 - Fornecedor"),
    ("5", "cap-05-produto.html",              "Capitulo 2 - Produto"),
    ("6", "cap-06-petshop.html",              "Desafio - PetShop"),
    ("7", "cap-07-cliente.html",              "Capitulo 3 - Cliente"),
    ("8", "cap-08-fornecedor-refator.html",   "Capitulo 4 - Refatorar Fornecedor"),
    ("9", "cap-09-autenticacao.html",         "Capitulo 5 - Autenticacao JWT"),
    ("10", "cap-10-integracao-frontend.html", "Capitulo 6 - Integracao Front x Back"),
    ("11", "cap-11-deploy-aws.html",          "Capitulo 7 - Deploy AWS"),
]


def extract_body(soup):
    container = soup.find("div", class_="container")
    if not container:
        return soup.body
    banner = container.find("div", class_="prof-banner")
    if banner:
        banner.decompose()
    footer = container.find("footer")
    if footer:
        footer.decompose()
    return container


def to_text(node):
    text = node.get_text(separator="\n")
    out, prev_blank = [], False
    for line in text.splitlines():
        s = line.strip()
        if not s:
            if not prev_blank:
                out.append("")
            prev_blank = True
        else:
            out.append(s)
            prev_blank = False
    return "\n".join(out).strip() + "\n"


def slug(s):
    return (s.lower()
              .replace("ç", "c").replace("ã", "a").replace("á", "a").replace("â", "a")
              .replace("é", "e").replace("ê", "e").replace("í", "i").replace("ó", "o")
              .replace("ô", "o").replace("ú", "u").replace(" - ", "_").replace(" ", "_"))


def main():
    for num, fname, title in CHAPTERS:
        src = os.path.join(ROOT, fname)
        if not os.path.exists(src):
            print(f"SKIP {fname} (not found)")
            continue
        with open(src, encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
        text = to_text(extract_body(soup))
        out_name = f"{num}_{slug(title)}.txt"
        out_path = os.path.join(HERE, out_name)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(f"# {title}\n# Fonte: {fname}\n\n{text}")
        print(f"wrote {out_name}")


if __name__ == "__main__":
    main()
