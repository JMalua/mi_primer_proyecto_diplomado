import './ConsultasPage.css';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  RefreshCw,
  Droplet,
  Trash2,
  Lightbulb,
  FileText,
  AlertTriangle,
  Inbox,
  Clock,
  CheckCircle2,
  Calendar,
  Scale,
  User,
} from 'lucide-react';

/** Tipo para un registro PQRS devuelto por la API */
interface Pqrs {
  id: string;
  solicitante: string;
  categoria: 'Agua' | 'Basuras' | 'Alumbrado';
  descripcion: string;
  estado: 'En trámite' | 'Resuelto';
  fechaRadicacion: string;
  plazoLegal: string;
  respuestaOficial: string;
}

/** Mapeo de iconos por categoría */
const iconCategoria: Record<string, React.ReactNode> = {
  Agua: <Droplet size={18} />,
  Basuras: <Trash2 size={18} />,
  Alumbrado: <Lightbulb size={18} />,
};

/** Formatea una fecha ISO a formato legible colombiano */
function formatFecha(iso: string): string {
  const date = new Date(iso + 'T12:00:00');
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ConsultasPage() {
  const [pqrsList, setPqrsList] = useState<Pqrs[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPqrs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pqrs');
      if (!res.ok) throw new Error(`Error del servidor (${res.status})`);
      const data: Pqrs[] = await res.json();
      setPqrsList(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo conectar con el servidor'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPqrs();
  }, [fetchPqrs]);

  // Filtro en tiempo real sobre múltiples campos
  const filtrados = pqrsList.filter((p) => {
    const termino = busqueda.toLowerCase();
    return (
      p.id.toLowerCase().includes(termino) ||
      p.solicitante.toLowerCase().includes(termino) ||
      p.categoria.toLowerCase().includes(termino) ||
      p.descripcion.toLowerCase().includes(termino) ||
      p.estado.toLowerCase().includes(termino)
    );
  });

  // ─── Estado 1: Cargando ────────────────────────────────
  if (isLoading) {
    return (
      <div className="consultas-page">
        <div className="consultas-estado-container">
          <div className="estado-cargando">
            <div className="spinner" />
            <h3>Consultando radicados…</h3>
            <p>Estamos conectándonos con el sistema de trámites.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Estado 2: Error ───────────────────────────────────
  if (error) {
    return (
      <div className="consultas-page">
        <div className="consultas-estado-container">
          <div className="estado-error">
            <div className="estado-error-icon">
              <AlertTriangle size={32} />
            </div>
            <h3>No se pudieron cargar los trámites</h3>
            <p>{error}</p>
            <button className="btn-reintentar" onClick={fetchPqrs}>
              <RefreshCw size={16} />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Estados 3 y 4: Vacío / Lista con Datos ───────────
  return (
    <div className="consultas-page">
      {/* Encabezado de sección */}
      <div className="consultas-header">
        <div className="consultas-header-text">
          <div className="consultas-header-icon">
            <FileText size={22} />
          </div>
          <div>
            <h2>Consulta de Radicados PQRS</h2>
            <p>
              {pqrsList.length} trámites registrados — Busque por nombre,
              categoría, radicado o estado.
            </p>
          </div>
        </div>

        {/* Resumen de estado */}
        <div className="consultas-stats">
          <div className="stat-chip stat-chip--tramite">
            <Clock size={14} />
            <span>
              {pqrsList.filter((p) => p.estado === 'En trámite').length} En
              trámite
            </span>
          </div>
          <div className="stat-chip stat-chip--resuelto">
            <CheckCircle2 size={14} />
            <span>
              {pqrsList.filter((p) => p.estado === 'Resuelto').length}{' '}
              Resueltos
            </span>
          </div>
        </div>
      </div>

      {/* Buscador en tiempo real */}
      <div className="consultas-searchbar">
        <Search className="consultas-search-icon" size={18} />
        <input
          id="buscador-pqrs"
          type="text"
          placeholder="Buscar por radicado, solicitante, categoría o estado…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar PQRS"
        />
        {busqueda && (
          <button
            className="consultas-search-clear"
            onClick={() => setBusqueda('')}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {/* Estado 3: Vacío (sin resultados) */}
      {filtrados.length === 0 ? (
        <div className="consultas-estado-container">
          <div className="estado-vacio">
            <div className="estado-vacio-icon">
              <Inbox size={36} />
            </div>
            <h3>No se encontraron trámites</h3>
            <p>
              No hay resultados para "<strong>{busqueda}</strong>". Intente con
              otro término de búsqueda.
            </p>
            <button
              className="btn-limpiar-busqueda"
              onClick={() => setBusqueda('')}
            >
              Limpiar búsqueda
            </button>
          </div>
        </div>
      ) : (
        /* Estado 4: Lista con datos */
        <>
          {busqueda && (
            <p className="consultas-resultados-info">
              Mostrando <strong>{filtrados.length}</strong> de{' '}
              <strong>{pqrsList.length}</strong> trámites
            </p>
          )}
          <div className="consultas-grid">
            {filtrados.map((pqrs) => (
              <Link
                key={pqrs.id}
                to={`/consultas/${pqrs.id}`}
                className="pqrs-card-link"
              >
                <article className="pqrs-card">
                  {/* Barra superior de color por categoría */}
                  <div
                    className={`pqrs-card-accent pqrs-card-accent--${pqrs.categoria.toLowerCase()}`}
                  />

                  <div className="pqrs-card-top">
                    <div className="pqrs-card-badges">
                      <span
                        className={`pqrs-badge-categoria pqrs-badge--${pqrs.categoria.toLowerCase()}`}
                      >
                        {iconCategoria[pqrs.categoria]}
                        {pqrs.categoria}
                      </span>
                      <span
                        className={`pqrs-badge-estado ${
                          pqrs.estado === 'Resuelto'
                            ? 'pqrs-badge-estado--resuelto'
                            : 'pqrs-badge-estado--tramite'
                        }`}
                      >
                        {pqrs.estado === 'Resuelto' ? (
                          <CheckCircle2 size={13} />
                        ) : (
                          <Clock size={13} />
                        )}
                        {pqrs.estado}
                      </span>
                    </div>
                    <span className="pqrs-card-id">{pqrs.id}</span>
                  </div>

                  <p className="pqrs-card-descripcion">{pqrs.descripcion}</p>

                  <div className="pqrs-card-meta">
                    <div className="pqrs-meta-item">
                      <User size={14} />
                      <span>{pqrs.solicitante}</span>
                    </div>
                    <div className="pqrs-meta-item">
                      <Calendar size={14} />
                      <span>{formatFecha(pqrs.fechaRadicacion)}</span>
                    </div>
                    <div className="pqrs-meta-item">
                      <Scale size={14} />
                      <span>Plazo: {pqrs.plazoLegal}</span>
                    </div>
                  </div>

                  <div className="pqrs-card-respuesta">
                    <span className="pqrs-respuesta-label">
                      Respuesta oficial
                    </span>
                    <p>{pqrs.respuestaOficial}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ConsultasPage;
