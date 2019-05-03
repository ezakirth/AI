TITLE Starting everything...
start cmd /k call "watch(typescript).bat"
timeout /T 5 /NOBREAK > nul
start cmd /k call "watch(browserify).bat"
