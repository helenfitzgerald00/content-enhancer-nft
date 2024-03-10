const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Secret key for JWT. In a real application, keep this secure and out of your codebase!
const jwtSecretKey = 'your_secret_key';

async function authenticateUser(username, password, usersDB) {
    // Example user authentication
    const user = usersDB.find(user => user.username === username);
    if (!user) {
        return { success: false, message: 'User not found' };
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (match) {
        const token = jwt.sign({ userId: user.id }, jwtSecretKey, { expiresIn: '1h' });
        return { success: true, token };
    } else {
        return { success: false, message: 'Password is incorrect' };
    }
}

async function recommendContent(userId, contentDB) {
    // Simplified recommendation logic based on user preferences
    const userPreferences = contentDB.userPreferences.find(pref => pref.userId === userId);
    const recommendedContent = contentDB.contents.filter(content =>
        userPreferences.interests.includes(content.category)
    );
    return recommendedContent;
}

module.exports = { authenticateUser, recommendContent };
