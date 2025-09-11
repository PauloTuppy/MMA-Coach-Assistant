#!/usr/bin/env node

/**
 * Script de teste para verificar se o setup está correto
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verificando configuração do MMA Coach Assistant...\n');

// Verificar se .env.local existe
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    console.log('✅ Arquivo .env.local encontrado');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Verificar se tem API key do Gemini
    if (envContent.includes('VITE_GEMINI_API_KEY=') && !envContent.includes('your_gemini_api_key_here')) {
        console.log('✅ Gemini API key configurada');
    } else {
        console.log('⚠️  Gemini API key não configurada ou usando valor padrão');
        console.log('   Configure VITE_GEMINI_API_KEY no arquivo .env.local');
    }
    
    // Verificar configuração GCS
    if (envContent.includes('GOOGLE_CLOUD_PROJECT_ID=') && !envContent.includes('your_project_id')) {
        console.log('✅ Google Cloud Storage configurado');
    } else {
        console.log('ℹ️  Google Cloud Storage não configurado (opcional)');
        console.log('   Para arquivos grandes, configure GCS no .env.local');
    }
    
} else {
    console.log('❌ Arquivo .env.local não encontrado');
    console.log('   Execute: cp .env.local.example .env.local');
}

// Verificar se node_modules existe
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('✅ Dependências instaladas');
} else {
    console.log('❌ Dependências não instaladas');
    console.log('   Execute: npm install');
}

// Verificar arquivos principais
const requiredFiles = [
    'package.json',
    'index.html',
    'App.tsx',
    'services/geminiCoachService.ts',
    'services/gcsService.ts',
    'services/uploadService.ts',
    'server/index.ts'
];

let missingFiles = [];
requiredFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} não encontrado`);
        missingFiles.push(file);
    }
});

console.log('\n📋 Resumo:');

if (missingFiles.length === 0) {
    console.log('✅ Todos os arquivos necessários estão presentes');
} else {
    console.log(`❌ ${missingFiles.length} arquivo(s) faltando:`, missingFiles);
}

console.log('\n🚀 Comandos para iniciar:');
console.log('   Frontend apenas:     npm run dev');
console.log('   Frontend + Backend:  npm run dev:full');

console.log('\n🎥 Vídeos de teste:');
console.log('   Benoit vs Ruffy:     https://drive.google.com/file/d/1D9xNZ0V-XGWetxOfmOO-ei4b584PUewO/view');
console.log('   Imavov vs Borralho:  https://drive.google.com/file/d/10Zngl7uWBrO8I9H4fKuyUonDEqDNKow5/view');

console.log('\n💡 Dicas:');
console.log('   • Para arquivos ≤ 50MB: método base64 (automático)');
console.log('   • Para arquivos > 50MB: método GCS (automático se configurado)');
console.log('   • Limite máximo: 100MB');
console.log('   • Formatos suportados: MP4, MOV, AVI, WEBM');
console.log('   • Duração recomendada: 2-5 minutos');
