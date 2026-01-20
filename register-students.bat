@echo off
echo ========================================
echo Registering Sample Students
echo ========================================
echo.
echo This will:
echo 1. Add 6 sample students to the database
echo 2. Send welcome emails to all new students
echo 3. You will receive a welcome email too!
echo.
pause
echo.
echo Starting registration...
echo.
node register-students-with-emails.js
echo.
pause
