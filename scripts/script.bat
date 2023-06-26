@echo off

setlocal

set "dir=%~dp0"
set "outputFile=%dir%\..\bypass\windows\curl-impersonate-win.zip"
set "url=https://github.com/BandaySajid/chatgpt-node/releases/download/v1.0.8/curl-impersonate-win.zip"


:: Create the output folder if it doesn't exist
mkdir "%dir%\..\bypass\windows" 2>nul

:: Download the zip file using curl
curl -L -o "%outputFile%" "%url%"

:: Check if the download was successful
if not %errorlevel%==0 (
  echo Error: Failed to download the zip file.
  exit /b 1
)

:: Extract the contents of the zip file to the desired folder
powershell -Command "Expand-Archive -Path '%outputFile%' -DestinationPath '%dir%\..\bypass\windows' -Force"

:: Check if the extraction was successful
if not %errorlevel%==0 (
  echo Error: Failed to extract the zip file.
  exit /b 1
)

REM Remove the archive file
del "%dir%\..\outputFile%"

echo Zip file downloaded and extracted successfully.
exit /b 0