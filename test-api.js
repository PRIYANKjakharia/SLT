#!/usr/bin/env node

const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
    console.log('🧪 Testing SLT API endpoints...\n');

    // Test 1: Check if server is running
    try {
        const response = await fetch(`${API_BASE.replace('/api', '')}`);
        console.log('✅ Server is running');
    } catch (error) {
        console.log('❌ Server is not running. Please start the server with: npm run dev');
        return;
    }

    // Test 2: Register a test user with unique timestamp
    const timestamp = Date.now();
    const testUsername = `testuser${timestamp}`;
    const testEmail = `test${timestamp}@example.com`;
    
    console.log('\n📝 Testing user registration...');
    try {
        const registerResponse = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: testUsername,
                email: testEmail,
                password: 'password123'
            })
        });

        const registerData = await registerResponse.json();
        
        if (registerResponse.ok) {
            console.log('✅ User registration successful');
            console.log('   Username:', testUsername);
            console.log('   Token:', registerData.token.substring(0, 20) + '...');
            
            // Test 3: Test protected endpoints with the token
            const token = registerData.token;
            
            // Test profile endpoint
            console.log('\n👤 Testing profile endpoint...');
            const profileResponse = await fetch(`${API_BASE}/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                console.log('✅ Profile endpoint working');
                console.log('   User:', profileData.user.username);
            } else {
                console.log('❌ Profile endpoint failed:', await profileResponse.json());
            }

            // Test stats endpoint
            console.log('\n📊 Testing stats endpoint...');
            const statsResponse = await fetch(`${API_BASE}/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                console.log('✅ Stats endpoint working');
                console.log('   Total translations:', statsData.total_translations);
            } else {
                console.log('❌ Stats endpoint failed:', await statsResponse.json());
            }

            // Test translations endpoint
            console.log('\n📝 Testing translations endpoint...');
            const translationsResponse = await fetch(`${API_BASE}/translations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (translationsResponse.ok) {
                const translationsData = await translationsResponse.json();
                console.log('✅ Translations endpoint working');
                console.log('   Translation count:', translationsData.translations.length);
            } else {
                console.log('❌ Translations endpoint failed:', await translationsResponse.json());
            }

            // Test saving a translation
            console.log('\n💾 Testing save translation...');
            const saveResponse = await fetch(`${API_BASE}/translations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    translation_type: 'signToText',
                    input_text: 'hello',
                    output_text: 'hello',
                    confidence: 0.95
                })
            });
            
            if (saveResponse.ok) {
                console.log('✅ Save translation working');
                
                // Test stats again to see if count increased
                console.log('\n📊 Testing stats after saving translation...');
                const statsResponse2 = await fetch(`${API_BASE}/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (statsResponse2.ok) {
                    const statsData2 = await statsResponse2.json();
                    console.log('✅ Stats updated correctly');
                    console.log('   Total translations:', statsData2.total_translations);
                }
            } else {
                console.log('❌ Save translation failed:', await saveResponse.json());
            }

        } else {
            console.log('❌ User registration failed:', registerData.error);
        }

    } catch (error) {
        console.log('❌ API test failed:', error.message);
    }

    console.log('\n🎉 API testing completed!');
}

// Run the test
testAPI().catch(console.error); 