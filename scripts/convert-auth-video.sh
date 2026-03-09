#!/bin/bash
# Script to convert the heavy .mov background video to optimized MP4
# Run this from the frontend/ directory
# Requires ffmpeg

# Convert .mov to H.264 MP4 (much smaller and better browser support)
ffmpeg -i public/images/auth/desktop-bg.mov \
  -c:v libx264 \
  -crf 23 \
  -preset medium \
  -an \
  -movflags +faststart \
  -vf "scale=1920:-2" \
  public/images/auth/desktop-bg.mp4

# Generate poster image (first frame)
ffmpeg -i public/images/auth/desktop-bg.mov \
  -vframes 1 \
  -q:v 2 \
  -vf "scale=1920:-2" \
  public/images/auth/desktop-bg-poster.jpg

echo "Done! Files created:"
echo "  - public/images/auth/desktop-bg.mp4"
echo "  - public/images/auth/desktop-bg-poster.jpg"
