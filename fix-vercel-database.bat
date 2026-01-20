@echo off
echo ========================================
echo Fixing Vercel Database Connection
echo ========================================
echo.

echo Step 1: Removing old DATABASE_URL...
vercel env rm DATABASE_URL production

echo.
echo Step 2: Adding correct DATABASE_URL...
echo postgres://postgres.qlmtudaozofwaccmrdyk:Gajagram%%40123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require | vercel env add DATABASE_URL production

echo.
echo Step 3: Triggering redeployment...
vercel --prod

echo.
echo ========================================
echo Done! Check https://emailreg.vercel.app
echo ========================================
pause
