# Quotation

Simple mobile app to train pronunciation/recitation of poetry.
Only Android build is available, iOS version needs investigation by somebody else.

Initially ready to use app comes with public domain Shakespeare's Sonnets reading.
Second use case is to produce own app with any text and audio of reading that roughly aligns with it, with possibly some added or missing short segments.

<p align="center">
  <img src="visuals/toc.png?raw=true" alt="Table of contents view" width="45%" style="display:inline-block; margin-right:10px;" />
  <img src="visuals/main.png?raw=true" alt="Main view" width="45%" style="display:inline-block;" />
</p>


Features/Usage:
- start with table of contents to navigate
- tap a line to play from it to the end of paragraph (in general case)
- tap white space aside of paragraph to play it from the start
- use pause, replay, record, hear-recording buttons
- long tap white space to get back to table of contents

Shakespeare's Sonnets app version download page: https://github.com/sowcow/quotation/releases

## Usage (own audio + text)

This is the most generic use case.
In my case I use audio file downloaded by Libation and corresponding text found on the internet.
Then I add headers markers into the text for table of contents.

- `export JKS_PASS=aoeuaoeu` - this should be enough for own usage (alternatively `have_key` and `sign` steps can be removed from `Rakefile` to do it manually)
- https://github.com/sowcow/quotation-align use steps from the repo to produce `resources/` dir
- produce .apk: `docker run -e JKS_PASS -v "$(pwd)/resources:/app/resources" -v "$(pwd)/jks.jks:/app/jks.jks" -v "$(pwd)/signed.apk:/app/signed.apk" quotation-build:latest sh -c "rake reg_make"` (TODO: GHCR)
- install .apk into the device, use the app

## Development

Requires `docker` and any `ruby`.
Assuming Android device is connected by USB and `adb` connects with it:

- `rake apk`
- `rake push`
- `sudo chmod -R 777 tauri_app/src-tauri/gen` - need to run this or `rm -rf` it after initial run, so it does not fail on consecutive runs

For quicker preview that may be not fully functional, one could install dependencies from Dockerfile locally and then run desktop version: `cd tauri_app; rake`.

## Big Picture

- `tauri_app/` - code for the mobile app with no content
- `resources/` - content that app bundles with itself (audio + text + alignment, in the shape that is over-optimized for current use-cases); by default it has ready for use Sonnets data
- `inputs/` - "pipelines" that generate `resources/` (incomplete, one dir has scripts working with Librivox)
- `Rakefile` - scripts that use `Dockerfile` to build the app; also there are lower level scripts at `tauri_app/Rakefile`

# License: [DAFUQPL](https://github.com/dafuqpl/dafuqpl)
