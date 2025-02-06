#!/bin/bash

# assumes docker is there and is set to work with GPUs

docker run --gpus all -it -v ".:/app" ghcr.io/jim60105/whisperx:large-v3-en -- --output_format json --align_model WAV2VEC2_ASR_LARGE_LV60K_960H --output_dir /app /app/audio/joined.wav

