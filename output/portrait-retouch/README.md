# Production portrait retouch — 2026-09-14

Method: built-in imagegen image editing. Original production files retained under originals/img. PNG masters and original-dimension JPEG/WebP outputs are under corrected/. generated.json maps the masters; manifest.json records delivered hashes and dimensions.

Prompt: Retouch this exact photograph ONLY to correct excessive dark brown/gray circles directly beneath both eyes of Pinhas Ratzon (bald man in navy suit and kippah). Lighten the dark under-eye patches to a healthy natural skin tone matching adjacent cheek, retain natural fine wrinkles and lower eyelid definition. Preserve his exact identity, facial geometry, age, gaze, smile/expression, skin texture, pose, clothing, all other people and entire background and composition. No other beautification, no changed framing. Same aspect ratio. Return one corrected photograph.

The sharing-card edit additionally required preserving all Hebrew text, numbers, typography and gold frame.

Delivery: replace targeted images in production and source checkout; stamp live HTML references with ?v=retouch-20260914. Preserve CMS slot paths and configuration. deploy-assets.py backs up the entire web root and source images before mutation, verifies unrelated files and configuration unchanged. verify-live.py checks public image hashes and page references. No full-site rebuild or unrelated local changes included.
