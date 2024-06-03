@echo off

call npx webpack
powershell Compress-Archive -Path images\*, mainPopup\*, manifest.json -DestinationPath chatgpt-thunderbird.xpi