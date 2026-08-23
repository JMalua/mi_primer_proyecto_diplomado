import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

/**
 * Lee y parsea el archivo data/pqrs.json desde la raíz del proyecto.
 */
export function getPqrsData() {
  const filePath = path.resolve(process.cwd(), 'data', 'pqrs.json');
  const fileData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileData);
}

/**
 * Handler del endpoint GET /api/pqrs
 */
export function handleGetPqrs(_req: Request, res: Response) {
  try {
    const pqrsList = getPqrsData();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(pqrsList);
  } catch (error) {
    console.error('Error al leer el archivo data/pqrs.json:', error);
    res.status(500).json({ error: 'No se pudo leer el archivo de PQRS' });
  }
}

/**
 * Handler del endpoint GET /api/pqrs/:id
 */
export function handleGetPqrsById(req: Request, res: Response) {
  try {
    const pqrsList = getPqrsData();
    const pqrs = pqrsList.find((p: { id: string }) => p.id === req.params.id);
    if (!pqrs) {
      res.status(404).json({ error: 'Radicado no encontrado' });
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(pqrs);
  } catch (error) {
    console.error('Error al leer el archivo data/pqrs.json:', error);
    res.status(500).json({ error: 'No se pudo leer el archivo de PQRS' });
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Registra las rutas /api/pqrs
app.get('/api/pqrs/:id', handleGetPqrsById);
app.get('/api/pqrs', handleGetPqrs);

// Inicia el servidor backend en el puerto 3001 al ejecutarse directamente
if (process.argv[1]?.includes('pqrs') || process.env.START_SERVER === 'true') {
  app.listen(PORT, () => {
    console.log(`[Backend API] Servidor iniciado en http://localhost:${PORT}`);
    console.log(`[Backend API] Endpoint disponible en http://localhost:${PORT}/api/pqrs`);
  });
}

export default app;
