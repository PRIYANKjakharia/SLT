#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 SLT - Sign Language Translator Setup');
console.log('=====================================\n');

// Check if Node.js is installed
try {
    const nodeVersion = process.version;
    console.log(`✅ Node.js version: ${nodeVersion}`);
    
    // Check if version is 14 or higher
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (majorVersion < 14) {
        console.log('❌ Node.js version 14 or higher is required');
        process.exit(1);
    }
} catch (error) {
    console.log('❌ Node.js is not installed. Please install Node.js first.');
    process.exit(1);
}

// Check if package.json exists
if (!fs.existsSync('package.json')) {
    console.log('❌ package.json not found. Please run this script from the project root directory.');
    process.exit(1);
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
} catch (error) {
    console.log('❌ Failed to install dependencies');
    process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const configEnvPath = path.join(__dirname, 'config.env');

if (!fs.existsSync(envPath) && fs.existsSync(configEnvPath)) {
    try {
        fs.copyFileSync(configEnvPath, envPath);
        console.log('✅ Environment file created from config.env');
    } catch (error) {
        console.log('⚠️  Could not create .env file. Please manually copy config.env to .env');
    }
} else if (!fs.existsSync(envPath)) {
    // Create a basic .env file
    const envContent = `PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
`;
    try {
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Basic .env file created');
    } catch (error) {
        console.log('⚠️  Could not create .env file. Please create it manually');
    }
}

// Check if database directory exists
const dbPath = path.join(__dirname, 'slt_database.db');
if (fs.existsSync(dbPath)) {
    console.log('✅ Database file already exists');
} else {
    console.log('ℹ️  Database will be created on first run');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start the server: npm run dev');
console.log('2. Open your browser to: http://localhost:3000');
console.log('3. Register a new account or login');
console.log('4. Start translating sign language!');
console.log('\n💡 For development, use: npm run dev');
console.log('💡 For production, use: npm start');
console.log('\n📚 Check README.md for more information'); 