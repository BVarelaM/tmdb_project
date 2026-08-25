// test-tmdb.js
require('dotenv').config();
const tmdbProvider = require('./src/data/providers/tmdb'); // Ajusta la ruta a tu provider

async function testConnection() {
  console.log('🔄 Probando conexión con TMDB...');
  console.log('🔑 Token detectado:', process.env.TMDB_ACCESS_TOKEN ? 'SÍ (Configurado)' : 'NO (Falta en .env)');

  try {
    const result = await tmdbProvider.searchMovies('batman');
    console.log('✅ Conexión exitosa con TMDB!');
    console.log(`📊 Películas encontradas: ${result.total_results}`);
    console.log('🎬 Primera película:', result.results[0]?.title);
  } catch (error) {
    console.error('❌ Error al conectar con TMDB:', error.message);
  }
}

testConnection();