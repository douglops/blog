+++
title = "learning industrial controls as an it person"
date = 2026-09-26
authors = ["Douglas"]
[taxonomies]

[extra]
+++

**Notes on crossing the fence from IT into OT — PLCs, SCADA, MES, and the Purdue model, written down as I learn them.**

_This started as a plain study outline put together with Claude while figuring out where to even begin. I'm sharing the compiled version because the on-ramp from software into industrial controls is oddly poorly mapped for people coming from where I'm coming from — take the vendor picks as one reasonable path, not the only one, and open an issue if you spot something wrong._

---

## why cross over

Everything I've built professionally lives above an API boundary somewhere. Industrial controls live below one I'd never touched: sensors, relays, motor starters, a PLC scanning inputs in a tight loop, none of it caring what a `git blame` is. What pulled me in is that the integration problems are the same shape as the ones I already know — moving data correctly and safely between systems that don't trust each other — just wearing different clothes. A PLC talking OPC-UA to a SCADA gateway is not that far, conceptually, from a service talking gRPC to another service. The vocabulary is the barrier, not the concepts.

So this is the guide I wished existed: how the layers fit together, which vendors actually make sense to learn first if you're targeting emerging markets rather than a US/EU plant, and a path that doesn't require owning a factory to get hands-on.

## the map: the Purdue model

Before any vendor or protocol, get this hierarchy straight — it's the OSI model of this world, and everything else hangs off it. Low to high:

- **Level 0** — the physical process itself: sensors, actuators, motors.
- **Level 1** — basic control: PLCs and DCS controllers reading and writing Level 0 I/O.
- **Level 2** — supervisory control: local HMIs, area-level SCADA.
- **Level 3** — site operations: plant-wide SCADA, MES, historians.
- **Level 3.5 (the DMZ)** — the IT/OT security boundary. Most of what gets called "systems integration" happens at or across this line.
- **Level 4/5** — business systems: ERP, scheduling — the layer most IT people already live in.

Almost all integration work is about moving data safely across these levels, not writing application code the way IT usually means it.

## glossary, fast

- **PLC (Programmable Logic Controller)** — a ruggedized industrial computer that scans inputs, runs logic, and writes outputs in a continuous loop. Programmed per IEC 61131-3: Ladder Diagram, Function Block Diagram, Structured Text, others.
- **SCADA (Supervisory Control and Data Acquisition)** — the software layer that visualizes and supervises PLCs/DCS across a site: tag database, HMI screens, alarms, trends, historian.
- **MES (Manufacturing Execution System)** — sits between ERP and the control floor. Tracks work orders, production genealogy, real-time machine status. ISA-95 formally defines this boundary and the data that crosses it.
- **OEE (Overall Equipment Effectiveness)** — `Availability × Performance × Quality`. The one KPI manufacturing lives and dies by, usually computed from MES or historian data.
- **Systems Integration** — connecting the above. Mostly protocol work and data modeling, closer to writing an adapter than building an application.

## the stack, and why

I'm building toward emerging markets — Brazil and South America specifically — which changes the calculus from what a US-centric course would recommend. Licensing cost, import lead time, and local support depth matter as much as feature lists.

### control layer: siemens, with a shorter word on weg

**Siemens** (S7-1200/1500, TIA Portal) is the safe default here: the deepest installed base in the region — automotive plants, food and beverage, oil and gas — the largest integrator and technician pool to learn from or eventually hire, local manufacturing presence that softens import duty and lead-time pain, and a used-equipment market deep enough to make hardware cheap once you're past the learning stage.

Worth a shorter passage: **WEG**, a Brazilian manufacturer with a dominant domestic position in motors and drives, now building out its own CLP line. It matters when a plant already standardizes on WEG motors and drives — one vendor for the whole motor-to-control chain simplifies commissioning — or when local support and zero import friction outweigh Siemens' bigger ecosystem. The trade-off is smaller name recognition outside Brazil if the skill needs to travel.

### SCADA: Ignition

Traditional SCADA licensing (Wonderware, WinCC) charges per tag, which gets expensive fast on a real plant and actively punishes learning by trying things. **Ignition** (Inductive Automation) licenses per server instead — unlimited tags, unlimited clients — and ships a genuinely modern, web-based client (Perspective) alongside the older desktop-style one (Vision). Inductive University, their free training platform, is the best on-ramp I've found for any of this: structured, free, certificate-backed.

### the glue: Modbus + OPC-UA

**Modbus TCP** is the simplest possible protocol here — a client polls a server for coils and registers, no security model, but nearly every PLC and field device speaks it. Good first protocol precisely because there's nothing to hide behind.

**OPC-UA** is the one that feels like home coming from IT: an object-oriented, structured address space instead of flat registers, with real certificate-based security built in. It's also the primary path from a Siemens S7-1500 into Ignition. (The S7-1200 needs a bit more care — OPC-UA server support depends on the CPU firmware version, check before assuming it's there.)

Where each fits: Modbus for simple field devices and legacy gear, OPC-UA for structured PLC-to-SCADA/MES data exchange.

## how i'm actually learning this

1. **Electrical fundamentals** — digital vs. analog I/O, 4-20mA current loops, relays, motor starters, reading a basic circuit.
2. **Siemens ladder logic** — TIA Portal plus PLCSIM, its bundled simulator, so no hardware is required to start.
3. **Ignition** — the Inductive University track, pointed at PLCSIM over a simulated OPC-UA connection.
4. **A real integration project** — a PLC, real or simulated, talking both Modbus TCP and OPC-UA into Ignition, tags flowing end to end.
5. **MES and OEE** — the ISA-95 data model, then a simple OEE calculation built on top of simulated machine-state tags inside Ignition.

## books and resources

**Books**

- *Industrial Automation: Hands On* — Frank Lamb. Written for exactly this IT-to-OT switch, start here.
- *Programmable Logic Controllers* — Frank Petruzella. The standard PLC textbook.
- *Electrical Motor Controls for Integrated Systems* — Rockis and Mazur. Electrical fundamentals tied directly to PLC context.
- The ISA-95 standard itself (Enterprise-Control System Integration) — dense, but it's the canonical MES/ERP data model, worth owning rather than reading summaries of.
- *SCADA: Supervisory Control and Data Acquisition* — Stuart A. Boyer (ISA).

**Free or cheap, online**

- [Inductive University](https://inductiveuniversity.com) — free Ignition and SCADA training with certificates, the best structured starting point I found.
- [RealPars](https://realpars.com) — the best general explainer videos for PLCs, instrumentation, and SCADA, free on YouTube with paid tiers beyond that.
- [PLC Fiddle](https://plcfiddle.com) — a browser-based ladder logic simulator, zero hardware required.
- [AutomationDirect](https://www.automationdirect.com) — free PLC training paired with genuinely cheap hardware.
- r/PLC and r/automation — active, and the IT-to-OT switch is a recurring topic, not a novelty there.

**Hardware, cheap first**

- Click PLC (~$100, AutomationDirect) — the cheapest real first PLC worth owning.
- A Siemens S7-1200 starter kit — pricier, but matches this stack directly.
- A used Allen-Bradley MicroLogix off eBay — only if a Rockwell-standardized client or job actually needs it.
- Raspberry Pi running Ignition Edge — a cheap, always-on SCADA sandbox.

## project ideas, roughly in order

- Simulate a Siemens PLC in PLCSIM, expose it over OPC-UA, connect Ignition to it, build one live HMI screen.
- A Click PLC over Modbus TCP, polled by Ignition — the simplest real-hardware integration available.
- A simulated machine with run/idle/fault states feeding Ignition tags, turned into a basic OEE dashboard: Availability × Performance × Quality, computed for real instead of quoted as a formula.

## still missing (running list)

- A step-by-step TIA Portal setup walkthrough.
- An Ignition Gateway install and first-project walkthrough.
- Common ladder logic patterns: start/stop/seal-in, motor interlocks, timers and counters.
- The ISA-95 data model, mapped concretely onto an Ignition or MES data structure.
- IT/OT security basics: the Level 3.5 DMZ, network segmentation, what the actual attack surface looks like.

This page will grow as each of those gets filled in.
