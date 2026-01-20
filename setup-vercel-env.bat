@echo off
echo Adding environment variables to Vercel...
echo.

echo Adding DATABASE_URL...
echo postgresql://postgres:Gajagram%%40123@db.qlmtudaozofwaccmrdyk.supabase.co:5432/postgres | vercel env add DATABASE_URL production

echo.
echo Adding EMAIL_USER...
echo agencyhack91@gmail.com | vercel env add EMAIL_USER production

echo.
echo Adding EMAIL_PASS...
echo joyk tnax uhqg wbuy | vercel env add EMAIL_PASS production

echo.
echo Adding ENABLE_EMAIL...
echo true | vercel env add ENABLE_EMAIL production

echo.
echo Adding NODE_ENV...
echo production | vercel env add NODE_ENV production

echo.
echo ========================================
echo All environment variables added!
echo ========================================
echo.
echo Now triggering redeployment...
vercel --prod

echo.
echo Done! Check https://emailreg.vercel.app in 1-2 minutes
pause
