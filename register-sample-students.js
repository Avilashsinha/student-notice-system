const fs = require('fs');
const path = require('path');
const { sendWelcomeEmail } = require('./emailService');

// Sample students to register
const sampleStudents = [
    {
        id: 1,
        name: "Rahul Kumar",
        phone_number: "9876543210",
        email: "rahul.kumar@example.com",
        registered_at: new Date().toISOString()
    },
    {
        id: 2,
        name: "Priya Sharma",
        phone_number: "9876543211",
        email: "priya.sharma@example.com",
        registered_at: new Date().toISOString()
    },
    {
        id: 3,
        name: "Amit Patel",
        phone_number: "9876543212",
        email: "amit.patel@example.com",
        registered_at: new Date().toISOString()
    },
    {
        id: 4,
        name: "Sneha Gupta",
        phone_number: "9876543213",
        email: "sneha.gupta@example.com",
        registered_at: new Date().toISOString()
    },
    {
        id: 5,
        name: "Vikram Singh",
        phone_number: "9876543214",
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
            console.log('\nExisting students:');
            existingStudents.forEach((student, index) => {
                console.log(`${index + 1}. ${student.name} (${student.email})`);
            });
            return;
        }

        // Add new students
        const allStudents = [...existingStudents, ...newStudents];

        // Save to file
        fs.writeFileSync(STUDENTS_FILE, JSON.stringify(allStudents, null, 2));

        console.log(`✅ Added ${newStudents.length} new student(s) to database\n`);

        // Send welcome emails
        console.log('📧 Sending welcome emails...\n');

        for (const student of newStudents) {
            try {
                await sendWelcomeEmail(student.name, student.email);
                console.log(`✅ Welcome email sent to: ${student.name} (${student.email})`);
                // Small delay to avoid overwhelming email server
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`❌ Failed to send email to ${student.email}:`, error.message);
            }
        }

        console.log('\n========================================');
        console.log('✅ Registration Complete!');
        console.log('========================================');
        console.log(`📊 Total students: ${allStudents.length}`);
        console.log(`📧 New registrations: ${newStudents.length}`);
        console.log('\nRegistered students:');
        allStudents.forEach((student, index) => {
            console.log(`${index + 1}. ${student.name} - ${student.email}`);
        });
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Error during registration:', error);
    }
}

// Run the registration
registerSampleStudents().then(() => {
    console.log('✅ Script completed successfully!');
    process.exit(0);
}).catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
});
