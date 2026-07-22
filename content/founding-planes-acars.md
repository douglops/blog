+++
title = "spot nearby planes with acars when you're bored"
authors = ["Douglas"]
date = 2026-05-03
[taxonomies]

[extra]
+++

There was a time when I liked aircraft a lot. Like a really lot. But you know what is even more cool than flying a plane?
To me, it is the understanding of aircraft communication systems, avionics and embedded systems and the overall engineering
efforts applied to these amazing flying beasts!

## The ADS-B detour

My RTL-SDR is an old v2 dongle, and it just doesn't do a good job at 1090 MHz, which is what you need for ADS-B. I didn't
feel like buying a v3/v4 just to get that one band, so instead I went down a small rabbit hole with
[adsb_deku](https://github.com/rsadsb/adsb_deku), a Rust ADS-B decoder. The plan was to feed it from `dump1090_rs`
pointed at a SoapySDR remote endpoint instead of the dongle directly:

```
dump1090_rs --driver "remote, remote=tcp://127.0.0.1:55132, remote:driver=rtlsdr"
```

Honestly, I never confirmed whether the remote/SoapySDR hop was actually necessary for what I was doing, or just a
leftover from an earlier experiment — but I kept the command around, along with the
[RTL-SDR wiki](https://osmocom.org/projects/rtl-sdr/wiki), in case I revisit it with better hardware.

## ACARS: works with (basically) anything

Where the dongle has no trouble at all is VHF, and that's exactly where ACARS lives (airlines still send a lot of
short operational messages — gate info, weather, position reports — over VHF datalinks in the 130-137 MHz range).
On my MacBook Air, I fed [acarsdec](https://github.com/TLeconte/acarsdec) live from SoapySDR across the usual set of
international ACARS channels, and it picked up traffic right away:

```
acarsdec --output full:file --soapysdr driver=rtlsdr 131.450 131.525 131.550 131.725 131.825
```

No fiddling required — it just worked, which was a nice change of pace after the ADS-B detour above.

## acars_deku, someday

`adsb_deku` decodes and renders ADS-B frames so nicely that it left me wanting the same thing for ACARS — something
like `acars_deku`, parsing and rendering the messages `acarsdec` spits out instead of just logging them to a file.
Nothing built yet, just an idea sitting in my someday-maybe pile.

## Further reading

- [RTL-SDR project wiki](https://osmocom.org/projects/rtl-sdr/wiki)
- [adsb_deku](https://github.com/rsadsb/adsb_deku)
- [tar1090](https://github.com/wiedehopf/tar1090)
- [mode-s.org: 1090 MHz](https://mode-s.org/1090mhz/)
- [RTL-SDR.com: receiving ACARS airplane data](https://www.rtl-sdr.com/rtl-sdr-radio-scanner-tutorial-receiving-airplane-data-with-acars/)
- [UFRJ GTA: ACARS overview](https://www.gta.ufrj.br/ensino/eel878/redes1-2023-1/trabalhos/Grupo03/acars.html)
