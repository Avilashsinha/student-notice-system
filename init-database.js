const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initializeDatabase() {
    console.log('🔄 Initializing database...');
    console.log('📍 Database URL:', process.env.DATABASE_URL ? 'Connected' : 'NOT FOUND');

    try {
        // Test connection
        console.log('\n1️⃣ Testing database connection...');
        const testResult = await pool.query('SELECT NOW()');
        console.log('✅ Database connection successful!');
        console.log('   Current time:', testResult.rows[0].now);

        // Create students table
        console.log('\n2️⃣ Creating students table...');
        await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Students table created successfully!');

        // Create notices table
        console.log('\n3️⃣ Creating notices table...');
        await pool.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Notices table created successfully!');

        // Verify tables exist
        console.log('\n4️⃣ Verifying tables...');
        const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

        console.log('✅ Tables in database:');
        tablesResult.rows.forEach(row => {
            console.log(`   - ${row.table_name}`);
        });

        // Check table structures
        console.log('\n5️⃣ Checking table structures...');

        const studentsColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'students'
      ORDER BY ordinal_position
    `);

        console.log('\n📋 Students table structure:');
        studentsColumns.rows.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULLABLE'})`);
        });

        const noticesColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'notices'
      ORDER BY ordinal_position
    `);

        console.log('\n📋 Notices table structure:');
        noticesColumns.rows.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULLABLE'})`);
        });

        console.log('\n✅ Database initialization complete!');
        console.log('🎉 Your database is ready to use!');

    } catch (error) {
        console.error('\n❌ Error initializing database:', error.message);
        console.error('Full error:', error);
    } finally {
        await pool.end();
        console.log('\n🔌 Database connection closed.');
    }
}

// Run the initialization
initializeDatabase();
