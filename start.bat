@echo off
echo Demarrage de KBB App...

REM Verifier si node est installe
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js n'est pas installe. Veuillez l'installer pour continuer.
    pause
    exit /b 1
)

REM Verifier si npm est installe
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo npm n'est pas installe. Veuillez l'installer pour continuer.
    pause
    exit /b 1
)

echo Installation des dependances...
call npm install

echo Lancement de l'environnement de developpement...
call npm run dev
pause
