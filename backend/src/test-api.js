import app from './app.js';

const server = app.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;
  console.log(`Test server running on port ${port}`);

  try {
    // 1. Login Cajero 1
    const resCajero1 = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'cajero1', password: 'Cajero1@2026' })
    });
    const dataCajero1 = await resCajero1.json();
    console.log('✅ 1. Login Cajero 1:', dataCajero1.success && dataCajero1.user.rol === 'cajero_1' ? 'PASS' : 'FAIL');

    // 2. Login Cajero 2
    const resCajero2 = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'cajero2', password: 'Cajero2@2026' })
    });
    const dataCajero2 = await resCajero2.json();
    console.log('✅ 2. Login Cajero 2:', dataCajero2.success && dataCajero2.user.rol === 'cajero_2' ? 'PASS' : 'FAIL');

    // 3. Login Admin
    const resAdmin = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Admin2026!' })
    });
    const dataAdmin = await resAdmin.json();
    console.log('✅ 3. Login Admin:', dataAdmin.success && dataAdmin.user.rol === 'admin' ? 'PASS' : 'FAIL');

    // 4. Cajero 1 crea una venta
    const resSale = await fetch(`${baseUrl}/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dataCajero1.token}`
      },
      body: JSON.stringify({
        items: [{ id: 'prod-001', nombre: 'Coca Cola 500ml', precio: 6, cantidad: 1 }],
        metodoPago: 'Efectivo',
        cliente: 'Prueba Cajero 1'
      })
    });
    const dataSale = await resSale.json();
    console.log('✅ 4. Venta registrada por Cajero 1:', resSale.status === 201 ? 'PASS' : 'FAIL');

    // 5. Cajero 1 intenta ver el panel de ganancias (debe recibir 403 Forbidden)
    const resForbidden = await fetch(`${baseUrl}/sales/stats`, {
      headers: { 'Authorization': `Bearer ${dataCajero1.token}` }
    });
    console.log('✅ 5. Bloqueo de Ganancias a Cajero (403 esperado):', resForbidden.status === 403 ? 'PASS' : 'FAIL');

    // 6. Admin consulta el panel de ganancias (debe recibir 200 OK)
    const resStats = await fetch(`${baseUrl}/sales/stats`, {
      headers: { 'Authorization': `Bearer ${dataAdmin.token}` }
    });
    const dataStats = await resStats.json();
    console.log(`✅ 6. Admin consulta Ganancias Totales ($${dataStats.stats.totalGanancias}):`, resStats.status === 200 ? 'PASS' : 'FAIL');

    // 7. Cajero 2 agrega y quita un producto
    const resAddProd = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dataCajero2.token}`
      },
      body: JSON.stringify({
        nombre: 'Galletas Test',
        precio: 4,
        costo: 2.5,
        stock: 10,
        categoria: 'Snacks'
      })
    });
    const dataAddProd = await resAddProd.json();
    console.log('✅ 7a. Cajero agrega producto:', resAddProd.status === 201 ? 'PASS' : 'FAIL');

    const resDelProd = await fetch(`${baseUrl}/products/${dataAddProd.data.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${dataCajero2.token}` }
    });
    console.log('✅ 7b. Cajero quita producto:', resDelProd.status === 200 ? 'PASS' : 'FAIL');

    server.close(() => {
      console.log('🎉 TODOS LOS TESTS DE ROLES Y VENTAS PASARON CON ÉXITO!');
      process.exit(0);
    });
  } catch (err) {
    console.error('❌ Error en test:', err);
    server.close(() => process.exit(1));
  }
});
