import app from './app.js';
import { ENV } from './config/env.js';

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Servidor backend escuchando en: http://localhost:${PORT}`);
  console.log(`🔒 Entorno: ${ENV.NODE_ENV}`);
  console.log(`🛡️  Seguridad activa: Helmet, CORS, Rate Limiters`);
  console.log(`📦 Catálogo de productos: http://localhost:${PORT}/api/products`);
  console.log(`===============================================`);
});
