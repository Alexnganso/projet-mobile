import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOBILE_PROJECT_DIR = path.join(__dirname, 'depot-manager-mobile');

interface ProjectFileEntry {
  relativePath: string;
  sizeBytes: number;
  language: string;
  content: string;
}

function detectLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.tsx' || ext === '.ts') return 'typescript';
  if (ext === '.json') return 'json';
  if (ext === '.js') return 'javascript';
  if (ext === '.md') return 'markdown';
  return 'plaintext';
}

async function collectProjectFiles(dirPath: string, baseDir: string): Promise<ProjectFileEntry[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const results: ProjectFileEntry[] = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.expo' || entry.name.startsWith('.DS_Store')) {
      continue;
    }
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectProjectFiles(fullPath, baseDir);
      results.push(...nested);
    } else if (entry.isFile()) {
      const content = await fs.readFile(fullPath, 'utf-8');
      const stat = await fs.stat(fullPath);
      const relativePath = path.relative(baseDir, fullPath).split(path.sep).join('/');
      results.push({
        relativePath,
        sizeBytes: stat.size,
        language: detectLanguage(fullPath),
        content,
      });
    }
  }

  return results.sort((a, b) => {
    const aDepth = a.relativePath.split('/').length;
    const bDepth = b.relativePath.split('/').length;
    if (aDepth !== bDepth) return aDepth - bDepth;
    return a.relativePath.localeCompare(b.relativePath);
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get('/api/mobile-project/files', async (_req, res) => {
    try {
      const files = await collectProjectFiles(MOBILE_PROJECT_DIR, MOBILE_PROJECT_DIR);
      res.json({
        folderName: 'depot-manager-mobile',
        framework: 'React Native 0.76 + Expo SDK 52 (TypeScript)',
        platforms: ['iOS 15+', 'Android 8.0+ (API 26+)'],
        totalFiles: files.length,
        files,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Impossible de lire le dossier depot-manager-mobile',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get('/api/mobile-project/download-zip', async (_req, res) => {
    try {
      const files = await collectProjectFiles(MOBILE_PROJECT_DIR, MOBILE_PROJECT_DIR);
      const zip = new JSZip();
      const rootFolder = zip.folder('depot-manager-mobile');

      if (rootFolder) {
        for (const file of files) {
          rootFolder.file(file.relativePath, file.content);
        }
      }

      const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="depot-manager-mobile-ios-android.zip"'
      );
      res.setHeader('Content-Length', zipBuffer.length);
      res.send(zipBuffer);
    } catch (error) {
      res.status(500).json({
        error: 'Impossible de générer l’archive ZIP du projet mobile',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DepotManager Studio server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
