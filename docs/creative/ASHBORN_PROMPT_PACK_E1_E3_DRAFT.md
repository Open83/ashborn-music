# ASHBORN — MARATHON: Exploration Prompt Pack (DRAFT, NOT RUN)

- **Status:** Provisional. **Nothing here has been run.** Prepared on 2026-10-30. No platform or model is chosen, and checkpoint 1 (terms check) is not done, so the wording is not yet adapted to any platform's syntax.
- **Source of truth:** `docs/creative/ASHBORN_AI_ARTWORK_PRODUCTION_BRIEF.md`, section 6 (base prompt, composition clauses, negative prompt) and section 7 (explorations). This file only joins those texts. If it disagrees with the brief, the brief wins, and this file is corrected.
- **Scope:** master explorations E1, E2 and E3 only. It contains no lyric text and no landing-page prompts. The landing-page exploration round comes after Gate 2, and its prompts are not drafted here.

## Run settings (record every value in the generation record)

| Setting | Value |
| --- | --- |
| Aspect ratio | Portrait 2:3 (Provisional). If the platform has no 2:3 option, record the nearest ratio. Never stretch or auto-crop |
| Candidates | At least three per exploration, proposed nine in all |
| Change per run | One variable at a time. Keep the seed where supported |
| Originals | Never overwrite or delete. Reject with a recorded reason |
| Prohibited in any prompt or upload | Names of living artists or existing artworks, the existing MARATHON cover, lettering, lyric text |

## Shared base prompt (Provisional)

> A single continuous natural cotton filament, twisted, lying on a warm, mineral-textured surface. One part of the filament is intact and pale bone-white, with visible twisted cotton structure and fine fibre fuzz. Along its length the same filament transitions gradually into charcoal-grey, ash-like fibres that keep the original twist and the continuity of the filament. Physically believable fibres. Natural directional side lighting with soft shadows. Meaningful negative space and a sophisticated asymmetrical composition. A warm, desaturated palette of taupe, mineral grey, charcoal and bone. Quiet, still, intimate. Realistic matte material texture.

## Negative prompt, shared and kept separate (Provisional)

> flames, fire, smoke, embers, sparks, glow, floating particles, bokeh, lens flare, disconnected or unrelated loose fibres, scattered debris, text, lettering, watermark, people, hands, extra objects, saturated colour, strict symmetry, plastic or glossy look, hyper-sharp HDR.

## E1 The Unravelling — fragility and vulnerability

Prompt = base prompt, then this composition clause:

> A close, intimate material study. The filament occupies a significant part of the composition. Intricate cotton fibre structure, visible twisting, fraying and gradual carbonisation. The physical material quality is the focal point

## E2 The Absence — absence, loss and isolation

Prompt = base prompt, then this composition clause:

> A small, delicate filament within an expansive mineral environment. Generous negative space and an asymmetrical composition with restrained natural lighting. The surrounding empty environment is an important compositional element

## E3 What Remains — transformation, continuity

Prompt = base prompt, then this composition clause:

> The transition between cotton and ash is the main focal point, and the original filament structure remains recognisable. Intricate charcoal-grey fibres. A distinctive asymmetrical composition with strong material contrast and no artificial effects

## Before any run

1. The owner chooses the platform and model.
2. Checkpoint 1 is completed and the dated terms are saved (brief, section 5).
3. The generation record is created at the first run (brief, section 12).
4. The prompt is adapted to the platform's syntax. The adapted text, not this file, goes in the record, verbatim.
