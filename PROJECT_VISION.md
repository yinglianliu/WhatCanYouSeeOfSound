# 🌌 What Can You See Of Sound - Project Vision

> **Prompt for AI**:
> When entering this project as a new conversation instance, please **make sure to read this file completely first**. This represents the ultimate intention and development constraints of the creator, and all code modifications must strictly comply with the bottom lines and design philosophy herein.

---

## I. Ultimate Vision
*(Write down your ultimate expectations for this project here, for example: hoping it becomes an audiovisual meditation tool that calms the mind, or an experimental interactive web page for gallery exhibitions.)*
- [ ] Vision Description: ...

## II. Core Design Philosophy
This project has an extremely high aesthetic threshold, and past iterations have formed solid constraints. **AI must absolutely abide by the following ironclad rules when modifying UI or visuals**:

1. **Brutalist Typography**: Completely abandon blurry film vibes or translucent filters in pursuit of clean, sharp background paint colors (solid premium gray/dark night). All text typography must boldly occupy space (such as enlarging titles to be visual focal points), and **Emojis are forbidden at the beginning of text** to maintain typographic purity.
2. **Text Bounding Box Strictness**: This is the most important technical deadline! All long text rendered based on `text()` (like long song titles, large Mood characters) must use the `(string, x, y, width, height)` format to build a restrictive Bounding Box, even by reducing `textSize` and increasing container `height` to ensure safe line wrapping. No matter what new controls are added later, **text content is absolutely not allowed to rush into, overlap, or exceed its Side Panel territory in any form**.
3. **Canvas Island**: The generative art or interactive canvas in the middle should float in the center as an independent frameless island (reserving 10%~15% of the "gray wall" breathing space outwards all around), and buttons or chaotic text must never step into this sacred territory.
4. **Sharp Brutalist Cuts**: Minimize rounded corners in UI elements! Whether it is the hover state of buttons or simulated glowing LED slots, extremely hard right angles or minimal rounded corners (`borderRadius: 0 ~ 1`) must be used uniformly, completely eliminating cylindrical/pill-shaped graphics.
5. **Chameleon Sync and Physical Light Layering Rule**: Surrounding accompanying physical array light effects (such as neon LEDs on the right) must have a real physical base light color layered at the bottom (like warm yellow filament during the day, quiet deep purple at night), and the core color must instantly absorb the hue of the central main canvas in real-time to do instantaneous burst flashing synchronization with music amplitude.

## III. Future Roadmap / To-Do List
*(List new features you want to add in the future and new technical ideas in this pool)*

- [ ] **Visual Enhancement**: Such as adding WebGL particles, more complex FFT (Fast Fourier Transform) audio analysis.
- [ ] **Mobile/Touch Support**: Make this UI run perfectly on the touch screen of mobile phones or even iPads.
- [ ] **API Integrations**: Besides the current regional weather (Open-Meteo), consider integrating Spotify real-time streaming or microphone input in the future?
- [ ] *[Add your new inspiration 1...]*
- [ ] *[Add your new inspiration 2...]*

## IV. Logic Quick Reference
1. **Music System**: Currently uses p5.sound, driving animations and light burst flashing through `amp` (Amplitude) changes.
2. **Weather & Emotion Interconnection**: Maps current weather signatures to three emotion modes: `Lively`, `Dream Pop`, `Rhythmic`.
3. **Fully Automatic Silent Seamless Day/Night Core**: The application system relies on the clock's 06:00 and 18:00 to control the basic tone, forcing global use of anti-ghosting `lerpColor` color transitions (ensuring interface background color changes are smooth like a movie gradient, without reloading the background canvas).
4. **Clock Standby Page**: Contains an anti-sleep square with edge bouncing random characteristics, and its appearance color scheme is also taken over by the day/night engine in real-time.

## V. Brainstorm & Notes
*(Jot down URLs, names of referenced artists, links to effects you fancy, etc...)*

- 
- 
