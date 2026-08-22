+++
title = "calisthenics 101"
date = 2026-08-22
authors = ["Douglas"]
[taxonomies]

[extra]
+++

# Where it all started

I've always been curious about strength and body building, and a friend taught 
me a thing or two about calisthenics in the past. Looking at the growing trend of 
body building and aesthetics sold as well being in general, something always 
seemed off to me. Years later I've started to workout on my own just to rediscover 
the world of calisthenics and strength development.

This developed in me a urge to learn more about how we could leverage our bodies to 
get healthier and stronger in any ways possible. This work as a living and growing 
development, towards that.

# Building a living calisthenics workbook

*40 muscles, 40 skills, two editions, and a pipeline that lied to me four times.*

Calisthenics has a measurement problem. A barbell athlete adds five kilos and knows
exactly where they are. A bodyweight athlete has one load — themselves — and changes
the movement instead. Which is elegant, until you try to answer "can you do a front
lever?" and discover the honest answer is a matter of opinion.

So I built the reference I wanted: an anatomy section, forty skills across five levels,
programming that turns the catalogue into a week, and a log to write in. Every skill
carries a **standard** — an objective, unambiguous description of what owning it means.
Twenty seconds. Chin over the bar. Hips level with the shoulders. Not "getting there."

The muscle figures rotate. That was the part I most wanted and least expected to get
for free.

## What "living" actually means

Two JSON files are the source of truth: `muscles.json` and `skills.json`. Forty muscle
entries with origin, insertion, action and a note on what the muscle does *in this
sport*. Forty skills with level, prerequisites, standard, cues, common faults, and 175
ordered progression steps.

Everything else is derived. The muscle reference chapter, the skill catalogue, the
coverage matrix showing which muscle groups each skill actually drives, the progression
tracker with a line per step, the benchmark sheet — all generated. Edit the JSON, run
`make`, and both editions change together. They cannot drift apart, because there is
nowhere for them to drift *to*.

```bash
make            # -> build/workbook.pdf + build/workbook.epub
```

The imagery is fetched by script too, not curated by hand into a folder. Anatomical
renders come from the BodyParts3D/Anatomography dataset via Wikimedia Commons, licensed
CC BY-SA. A clean checkout rebuilds the whole thing.

## Why there are two editions

A PDF cannot contain a GIF. That is a hard format limit, not an oversight.

The print edition embeds each animation as a 16-frame sequence played by LaTeX's
`animate` package. It rotates in Adobe Acrobat and shows a clean still frame in
Preview, Chrome and everything else — a designed fallback that loses only the rotation.

The EPUB has no such limit. There the figures are real animated GIFs, and they move in
Apple Books, Google Play Books, Calibre and Thorium. Kindle is the exception; its
converter flattens them.

Both come from the same data and the same prose. The reference chapters generate
straight to XHTML; the hand-written chapters run through pandoc. Nothing is written
twice.

## The part worth writing down: the bugs all lied

I expected this project to fail loudly. Instead almost every real bug produced output
that looked *fine*.

**A seashell engraving labelled "Planche."** Matching Commons filenames to skill names
seemed obviously correct. It gave me an 18th-century engraving of conches for "Planche",
a bowl of bean dip for "Dips", and a Cotswold village for "Row". Scoping the search to
fitness categories fixed the homonyms and left subtler ones: an empty dip station, a man
leaning on a fence, an acrobat balanced on a partner's ankles for "Handstand". There is
no clever fix. Every skill photograph in the book is now on an explicit allow-list,
added only after a human looked at it. In a technique manual a wrong photograph is worse
than none, so 35 of 40 skills simply show nothing in the shareable build.

**A muscle of the foot, captioned "Forearm extensors."** My alias for the forearm
extensor group was "extensor digitorum" — which matched *extensor digitorum brevis*, in
the foot. The plate rendered beautifully. It showed a pair of feet, under a heading
about grip.

**A chroma key that dissolved skeletons.** Some anatomical renders ship on chroma green.
Keying it out seemed trivial. But those particular renders draw a *translucent*
skeleton over the backdrop, so the green is blended into the bone pixels themselves —
a tolerance high enough to clear the halo dissolves the skeleton with it. Keying is now
scoped to opaque renders only, where it is safe and fixes a plate that read as a black
hole in the page.

**Photographs that looked badly shot and weren't.** Several images came out blown to
white and I nearly rejected them as poor sources. They were fine. I was compositing
full-range JPEG onto ffmpeg's limited-range white generator, which re-maps the levels
and crushes every shadow. The fix is one `format=rgba` on each branch. The lesson is
that I almost deleted good material because my own pipeline defamed it.

**Forty empty directories and a book that rebuilt happily.** The worst one. Frame
extraction computed a canvas that landed on an odd pixel height. The mjpeg encoder
cannot 4:2:0-subsample an odd side, and it responds by writing *no packets at all*
rather than by failing. Extraction "succeeded", the book rebuilt without error, and the
only symptom was a page count that went to 49 when it should have been 54.

None of these threw an exception. All of them produced a plausible artefact. The habit
that caught them was rendering pages and contact sheets and *looking* — checking output
rather than exit codes.

There was one loud failure, and it was the polite kind: Wikimedia returns a flat `429`
to a generic user agent. Put a real contact URL in it and the same file downloads
instantly. Their policy says exactly this; I just hadn't read it.

## Licensing, kept honest by the build

The default build is redistributable. Every image is CC-licensed or public domain, with
per-file credits generated into an appendix from the same manifest the fetcher writes —
so the book cannot credit an image it does not contain.

There is a second, opt-in path that pulls demonstration footage which is *not* freely
licensed, for a personal copy only. It writes to a gitignored directory, and
`make shareable` deletes every such asset and rebuilds. The size difference is the
tell: 11 MB and 8 MB for the pair you can share, 26 MB and 18 MB for the one you
cannot.

I skipped one suggested source entirely because its licence carries a non-commercial
clause, which is incompatible with distributing the book under CC BY-SA. A public-domain
Gray's plate covered the same muscle.

## Where it stands

49 pages shareable, 54 with demonstrations. 40 muscle entries, 37 with a plate and 26 of
those animated. 40 skills, 175 progression steps, a coverage matrix, a glossary, and
four printable sheets. About 1,500 lines of Python doing the fetching, the image work
and the generation; the rest is LaTeX and two JSON files.

The thing I would tell anyone building something similar: put the content in data early,
and check what you produced rather than whether the command exited zero. Both of those
paid for themselves several times over — mostly by catching output that was confidently,
plausibly wrong.
