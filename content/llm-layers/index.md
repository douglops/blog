+++
title = "llm seven layers stack model - or - why i'm feeling numb?"
date = 2026-07-19
authors = ["Douglas"]
[taxonomies]

[extra]
+++

💡 _This was an exercise on knowledge compression using inference via Claude to compile an up-to-date textbook, so take it with caution. You can open an issue in Github if you find any errors._

---

**Goal:** LLMs are a growing field, with tools changing as fast as the opening and closing of the Strait of Hormuz. For this reason, I began searching for a model similar to the "OSI" to tame the endless complexity of LLM ecosystems and found a layered taxonomy proposed by Rishav Hada, ["LLM Application Tech
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

**References:** 

Huyen's two books covers the production LLM application stack end to end — evaluation frameworks, prompt design, agent architectures, deployment tradeoffs. It's the nearest published thing to the textbook's scope, and her earlier Designing Machine Learning Systems (2022) is the better book on drift, data pipelines and monitoring even though it predates the LLM era entirely — Chapter 8's PSI and staleness material is downstream of it:

 * Huyen, C. (2025). AI engineering: Building applications with foundation models. O’Reilly Media.

 * Huyen, C. (2022). Designing machine learning systems: An iterative process. O’Reilly Media.

A layer-by-layer recommendation:

 * L1 — Foundation Models. Sebastian Raschka's Build a Large Language Model (From Scratch) if you want the arithmetic in Chapter 2 to become muscle memory; you implement attention, KV caching and sampling in PyTorch. Simon Prince's Understanding Deep Learning (free PDF from the author) is the better theory companion — modern, well-illustrated, and honest about what isn't understood.

 * L2 — Inference & Serving. No good book exists. The closest useful substitutes are Kirk & Hwu's Programming Massively Parallel Processors for reasoning about memory bandwidth and occupancy, which is what the decode-phase argument actually reduces to, and Kleppmann's Designing Data-Intensive Applications for the queueing and tail-latency intuitions behind Little's law and goodput.

 * L3 — Orchestration. Kleppmann again for exactly-once semantics and idempotency, plus Michael Nygard's Release It! — circuit breakers, bulkheads, timeouts and the stability antipatterns in it map one-to-one onto what goes wrong in agent loops. Google's Site Reliability Engineering (free online) for the error-budget framing.

 * L4 — Retrieval. This is the layer where reading old books pays best. Manning, Raghavan & Schütze's Introduction to Information Retrieval (free online) is still the canonical grounding for BM25, index structures and the evaluation metrics in §5.8 — most RAG failures are IR failures that the field solved in 2005. Sebastian Bruch's Foundations of Vector Retrieval (Springer, 2024) is the rigorous treatment of ANN: HNSW, IVF, product quantisation, the theory behind the recall/latency curves. Lin, Nogueira & Yates, Pretrained Transformers for Text Ranking, covers rerankers and dense retrieval properly.

 * L7 — Evaluation. Kohavi, Tang & Xu, Trustworthy Online Controlled Experiments. The multiple-comparisons trap, sample-size calculation, sequential testing and metric degeneracy in Chapter 8 are all treated at far greater depth there. If you take one book off this list beyond Huyen, take this one — the statistical failures in prompt optimisation are the same failures A/B testing spent twenty years learning to avoid.

_**A note on security:**_ John Sotiropoulos's Adversarial AI: Attacks, Mitigations and Defense Strategies is the most useful book-length treatment of the prompt-injection and supply-chain material in §7.9, and it's structured against the OWASP LLM Top 10, which is what your vendor questionnaires will end up referencing anyway. Pair it with the NIST AI RMF and its Generative AI Profile

---

You can access the rendered PDF file and the original tex file below:

- [Read the PDF](llm-seven-layer-stack.pdf)
- [Browse the LaTeX source](https://github.com/douglops/blog/tree/main/content/llm-layers/llm-seven-layer-stack_v1.tex)
