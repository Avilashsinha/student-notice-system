const fs = require('fs');
const path = require('path');
const { sendWelcomeEmail } = require('./emailService');

// ⚠️ CHANGE THIS TO YOUR EMAIL ADDRESS TO RECEIVE WELCOME EMAIL!
const YOUR_EMAIL = "agencyhack91@gmail.com"; // <-- Put your email here

// Sample students to register (including you!)
const sampleStudents = [
    {
        id: 1,
        name: "Avilash Sinha Roy",
        phone_number: "9876543210",
        email: YOUR_EMAIL, // Your email - you'll receive the welcome email!
        registered_at: new Date().toISOString()
    },
    {
        id: 2,
        name: "Rahul Kumar",
        phone_number: "9876543211",
        email: "rahul.kumar@example.com",
        registered_at: new Date().toISOString()
    },
    {
        id: 3,
        name: "Priya Sharma",
        phone_number: "9876543212",
        email: "priya.sharma@example.com",
        registered_at: new Date().toISOString()
    },
    {
        id: 4,
        name: "Amit Patel",
        phone_number: "9876543213",
        email: "amit.patel@example.com",
        registered_at: new Date().toISOString()
    },
    {
        id: 5,
        name: "Sneha Gupta",
        phone_number: "9876543214",
        email: "sneha.gupta@example.com",
        registered_at: new Date().toISOString()
    },
    {
        id: 6,
        name: "Vikram Singh",
        phone_number: "9876543215",
        email: "vikram.singh@example.com",
        registered_at: new Date().toISOString()
    }
];

async function registerSampleStudents() {
    console.log('\n========================================');
    console.log('📝 Registering Sample Students');
    console.log('========================================\n');

    try {
        // Read existing students
        const STUDENTS_FILE = path.join(__dirname, 'students.json');
        let existingStudents = [];

        if (fs.existsSync(STUDENTS_FILE)) {
            const data = fs.readFileSync(STUDENTS_FILE, 'utf8');
            existingStudents = JSON.parse(data);
        }

        // Check which students are new
        const newStudents = sampleStudents.filter(newStudent =>
            !existingStudents.find(existing => existing.email === newStudent.email)
        );

        if (newStudents.length === 0) {
            console.log('✅ All sample students are already registered!');
            console.log(`📊 Total students in database: ${existingStudents.length}`);
            console.log('\n📋 Existing students:');
            existingStudents.forEach((student, index) => {
                console.log(`   ${index + 1}. ${student.name} - ${student.email}`);
            });
            console.log('\n========================================\n');
            return;
        }

        // Add new students (merge with existing, reassign IDs)
        const allStudents = [...existingStudents, ...newStudents].map((student, index) => ({
            ...student,
            id: index + 1
        }));

        // Save to file
        fs.writeFileSync(STUDENTS_FILE, JSON.stringify(allStudents, null, 2));

        console.log(`✅ Added ${newStudents.length} new student(s) to database\n`);

        // Send welcome emails
        console.log('📧 Sending welcome emails...\n');

        let sentCount = 0;
        let failedCount = 0;

        for (const student of newStudents) {
            try {
                await sendWelcomeEmail(student.name, student.email);
                console.log(`   ✅ ${student.name} (${student.email})`);
                sentCount++;
                // Small delay to avoid overwhelming email server
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`   ❌ ${student.name} (${student.email}) - Error: ${error.message}`);
                failedCount++;
            }
        }

        console.log('\n========================================');
        console.log('✅ Registration Complete!');
        console.log('========================================');
        console.log(`📊 Total students in system: ${allStudents.length}`);
        console.log(`📧 New registrations: ${newStudents.length}`);
        console.log(`✅ Emails sent: ${sentCount}`);
        if (failedCount > 0) {
            console.log(`❌ Emails failed: ${failedCount}`);
        }

        console.log('\n📋 All registered students:');
        allStudents.forEach((student, index) => {
            const isNew = newStudents.find(s => s.email === student.email);
            const badge = isNew ? '🆕' : '  ';
            console.log(`   ${badge} ${index + 1}. ${student.name} - ${student.email}`);
        });
        console.log('========================================\n');

        if (sentCount > 0) {
            console.log('🎉 CHECK YOUR EMAIL! You should receive welcome emails now!\n');
        }

    } catch (error) {
        console.error('❌ Error during registration:', error);
        throw error;
    }
}

// Run the registration
registerSampleStudents().then(() => {
    console.log('✅ Script completed successfully!\n');
    process.exit(0);
}).catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
});
