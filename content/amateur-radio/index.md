+++
title = "Amateur Radio Tutorial for Hackers"
date = 2026-07-21

[taxonomies]

[extra]
+++

**A Free, Country-Agnostic Textbook for Every Radio Amateur**

Ham radio has a strange problem: the physics is universal, but almost every study guide isn't. Ohm's law doesn't care which country issued your callsign, yet most textbooks are written around one nation's exam syllabus, band plan, and licensing bureaucracy — which means the moment you cross a border (or just want to actually *understand* the material instead of memorizing a question pool), you're stuck.

*The Complete Amateur Radio Operator* is our attempt to fix that. It grew out of the study materials built for [radioescola.pt](https://radioescola.pt), a resource originally created to help Portuguese candidates prepare for their national amateur radio exam — the diagrams, worked examples, and topic coverage built up there over time turned out to be too good a foundation to keep locked to one country's syllabus. So we rebuilt it: stripped out everything specific to Portugal's regulator, rewrote and substantially expanded the technical content in English, and turned it into a free, 175-page textbook covering everything underneath every national amateur radio exam in the world.

It runs from electricity and circuit theory through AC and reactance, semiconductors and op-amps, receiver architectures, modulation, antennas, transmission lines, and ionospheric propagation — built up from first principles, with worked examples, exam tips, and end-of-chapter problems throughout. It's organized in five tiers that roughly track the entry-level → intermediate → full-privilege progression used almost everywhere, so you can stop wherever your target license requires, or keep going all the way to advanced RF engineering.

What it deliberately *doesn't* do is teach any single country's regulations. Instead, it covers the genuinely international layer — the ITU, IARU, CEPT, the Q-code, the NATO phonetic alphabet, standardized emission designators — the stuff that's the same whether you're studying in Lisbon or Lagos or Los Angeles. National band plans and paperwork change; a half-wave dipole doesn't.

A few things we're especially glad made it in: a full appendix of every formula in the book, organized by chapter, for last-minute review, alongside SI prefixes, physical constants, and a resistor color code quick-reference. And a closing bonus chapter, outside the exam material entirely, on aviation, maritime, and military radio monitoring with SDR — ACARS, ADS-B, AIS, NAVTEX, and the rest of the signals now trivially receivable with a $20 USB dongle, framed with a clear-eyed note that monitoring legality varies by country and is worth checking before you start.

It's built in LaTeX, with hand-drawn circuit diagrams and plots rather than screenshots, so it reads like an actual textbook rather than a printed webpage.

Whether you're chasing your first license or just want to finally understand *why* your antenna tuner does what it does, we hope this is useful. 73.

---

The finished PDF file and the tex files can be found below:

- [Read the PDF](radio_textbook/main.pdf)
- [Browse the LaTeX source](https://github.com/douglops/blog/content/amateur-radio/radio_textbook/)
