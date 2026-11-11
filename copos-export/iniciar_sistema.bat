@echo off
rem Inicia o sistema no Windows: verifica Node.js, instala dependencias e abre o navegador.
chcp 65001 >nul
cd /d "%~dp0"
title Vidraria Export

where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado.
  echo Vou abrir a pagina de download. Instale a versao LTS e de dois cliques neste arquivo de novo.
  start "" https://nodejs.org
  pause
  exit /b 1
)

for /f %%v in ('node -p "process.versions.node.split('.')[0]"') do set NODEMAJOR=%%v
if %NODEMAJOR% LSS 22 (
  echo [ERRO] Seu Node.js e antigo. Instale a versao LTS mais recente ^(22 ou superior^) em https://nodejs.org
  start "" https://nodejs.org
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando dependencias ^(apenas na primeira vez^)...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo [ERRO] Falha no npm install. Verifique a internet.
    pause
    exit /b 1
  )
)

rem Abre o navegador depois de 3 segundos, sem travar o servidor
start "" cmd /c "timeout /t 3 >nul & start http://localhost:3000"

echo Sistema em http://localhost:3000  ^(feche esta janela para encerrar^)
call npm start
pause
