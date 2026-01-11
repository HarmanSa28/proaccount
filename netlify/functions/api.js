const { neon } = require('@neondatabase/serverless');

console.log("DB URL:", process.env.NETLIFY_DATABASE_URL);

const sql = neon(process.env.NETLIFY_DATABASE_URL);


exports.handler = async (event) => {
  try {
    const { action, payload } = JSON.parse(event.body);

    // 🔐 LOGIN
    if (action === 'LOGIN') {
      const { username, password } = payload;

      const users = await sql`
        SELECT id, username, role
        FROM users
        WHERE username = ${username}
          AND password = ${password}
      `;

      if (users.length === 0) {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(users[0])
      };
    }

    // 👤 CREATE USER
    if (action === 'CREATE_USER') {
      const { username, password, role } = payload;

      await sql`
        INSERT INTO users (username, password, role)
        VALUES (${username}, ${password}, ${role || 'user'})
      `;

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    }

    // ❌ BİLİNMEYEN ACTION
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Unknown action' })
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
