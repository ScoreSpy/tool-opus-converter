# tool-opus-converter

2 ways to run the application, either throw the binary in the folder you want to convert, or run it via CLI

```
-p OR --path | Specify target directory
-t OR --threads | Specify thread count
-h OR --help | Display help
```

This will convert ALL files with extensions .ogg .mp3 .wav to .opus and remove the old audio files, consider having a backup as we are not liable for the pain of redownloading songs

# FFMPEG is required to run this tool
if you do not have FFMPEG download the option with `with-FFMPEG` which will inclide the FFMPEG binary, make sure the FFMPEG binary is with the opus-converter binary or it will fail to find it
