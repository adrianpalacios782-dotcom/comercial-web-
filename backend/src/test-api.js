import app from './app.js';
import { ENV } from './config/env.js';

const server = app.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;
  console.log(`Test server running on port ${port}`);

  try {
    // 1. Test Health
    const resHealth = await fetch(`${baseUrl}/health`);
    const dataHealth = await resHealth.json();
    console.log('✅ 1. Health check:', dataHealth.status === 'ok' ? 'PASS' : 'FAIL');

    // 2. Test Get Products (Public)
    const resProducts = await fetch(`${baseUrl}/products`);
    const dataProducts = await resProducts.json();
    console.log(`✅ 2. GET /products: PASS (${dataProducts.count} productos encontrados)`);

    // 3. Test Unauthorized Access to Protected Route
    const resProtectedFail = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Test', precio: 10, stock: 5, categoria: 'Snacks' })
    });
    console.log('✅ 3. Bloqueo sin Token (401 esperado):', resProtectedFail.status === 401 ? 'PASS' : 'FAIL');

    // 4. Test Login
    const resLogin = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: ENV.ADMIN_USERNAME,
        password: ENV.ADMIN_PASSWORD
      })
    });
    const dataLogin = await resLogin.json();
    console.log('✅ 4. Login JWT:', dataLogin.success ? 'PASS' : 'FAIL');

    // 5. Test Authorized Access with Bearer Token
    const resProtectedSuccess = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dataLogin.token}`
      },
      body: JSON.stringify({
        nombre: 'Galletas Rellenas Choco 120g',
        descripcion: 'Galletas crujientes rellenas de crema de chocolate.',
        precio: 1.10,
        stock: 30,
        categoria: 'Golosinas'
      })
    });
    const dataCreated = await resProtectedSuccess.json();
    console.log('✅ 5. Creación con JWT (201 esperado):', resProtectedSuccess.status === 201 ? 'PASS' : 'FAIL');

    server.close(() => {
      console.log('🎉 Todos los tests del Backend pasaron exitosamente!');
      process.exit(0);
    });
  } catch (err) {
    console.error('❌ Error en test:', err);
    server.close(() => process.exit(1));
  }
});
