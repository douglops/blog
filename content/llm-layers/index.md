+++
title = "llm seven layers stack model - or - why i'm feeling numb?"
date = 2026-07-19
authors = ["Douglas"]
[taxonomies]

[extra]
+++

💡 _This was an exercise on knowledge compression using inference via Claude to compile an up-to-date textbook, so take it with caution. You can open an issue in Github if you find any errors._

---

**Goal:** LLMs are a growing field, with tools changing as fast as the opening and closing of the Strait of Hormuz. For this reason, I began searching for a model similar to the "OSI"-like model to tame the endless complexity of LLM ecosystems and found a layered taxonomy proposed by Rishav Hada, ["LLM Application Tech
Stack in 2026" published last year (2025) in Future AGI](https://futureagi.com/blog/llm-application-tech-stack-2025/). Focused primarily on technologies, it addresses little of the relationship and technical considerations between each layer, which motivated me to compile a less fragmented and more engineering-oriented body of knowledge.

Some caveats worth noting:

1. the source is published by Future AGI
2. which sells into two of the seven layers it describes and ranks itself #1 in one
3. the taxonomy itself is sound and I kept it intact, but I put the rankings and the unsourced percentages (40–80% routing savings, 15–30% reranker lift) inside "Source-critical note" boxes with the conditions under which they could hold and the measurement procedure to check them on your own traffic
4. presenting those as facts would have been the weaker choice
5. the colophon and closing note make the provenance explicit

I asked Claude to consolidate a textbook that would be useful weather or new tooling will appear or fade into oblivion.

The result was a 78 pages, single self-contained .tex, and a companion pdfLaTeX file (no shell-escape, no missing packages, one harmless 0.3pt overfull box). You can take a look by yourself, the goal is to provide a clear foundation for understanding your interactions on each and every layer, and why and when sensible choices makes a difference.

**Structure:** Part I builds the layer formalism (contract tuple, latency-adds/quality-multiplies algebra, cost decomposition) that later chapters reuse. Part II is one chapter per layer. Part III is the reference architecture, a maturity model, and a critical review of the pitfalls. Appendices hold a vendor-neutral scorecard, a benchmark harness, and notation/glossary.

**Beyond:** Since the article's source is ~9 minutes of reading, to provide more depth, I added: KV-cache sizing and the bandwidth-bound decode argument (L1); Little's-law capacity formula, speculative-decoding speedup, build-vs-buy crossover (L2); the 
𝑝
𝑛
p
n
 reliability table and verifier-corrected 
𝑝
eff
p
eff
(L3); index sizing, RRF, IR metrics (L4); LSH dedup, chunking economics, ACL pre-filtering (L5); routing as constrained optimisation with the pointwise Lagrangian solution and cascade break-even (L6); and a heavily statistical L7 — power analysis, paired bootstrap, the multiple-comparisons trap in prompt search, judge validation via 𝜅. Every chapter ends with exercises, also.

---

You can access the rendered PDF file and the original tex file below:

- [Read the PDF](llm-seven-layer-stack.pdf)
- [Browse the LaTeX source](https://github.com/douglops/blog/tree/main/content/llm-layers/llm-seven-layer-stack_v1.tex)
