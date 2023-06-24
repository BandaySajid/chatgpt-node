@echo off

set "url=https://github.com/depler/curl-impersonate-win/releases/download/20230227/curl-impersonate-win.zip"
set "outputFile=bypass\windows\curl-impersonate-win.zip"

:: Create the output folder if it doesn't exist
mkdir "bypass\windows" 2>nul

:: Download the zip file using curl
curl -L -o "%outputFile%" "%url%"

:: Check if the download was successful
if not %errorlevel%==0 (
  echo Error: Failed to download the zip file.
  exit /b 1
)

:: Extract the contents of the zip file to the desired folder
powershell -Command "Expand-Archive -Path '%outputFile%' -DestinationPath 'bypass\windows' -Force"

:: Check if the extraction was successful
if not %errorlevel%==0 (
  echo Error: Failed to extract the zip file.
  exit /b 1
)

REM Remove the archive file
del "%outputFile%"

REM Get the current directory
for %%I in (.) do set "currentDir=%%~dpI"

REM Move the folder to the destination
move "\bypass\windows\curl-impersonate-win" "%currentDir%"

echo Zip file downloaded and extracted successfully.
exit /b 0
