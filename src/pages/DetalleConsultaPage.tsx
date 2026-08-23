import './DetalleConsultaPage.css';
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  Droplet,
  Trash2,
  Lightbulb,
  Clock,
  CheckCircle2,
  Calendar,
  Scale,
  User,
  FileText,
  AlertTriangle,
  Hash,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';

/** Tipo para un registro PQRS */
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

/** Iconos grandes por categoría */
const iconCategoria: Record<string, React.ReactNode> = {
  Agua: <Droplet size={28} />,
  Basuras: <Trash2 size={28} />,
  Alumbrado: <Lightbulb size={28} />,
};

/** Formatea una fecha ISO a formato legible colombiano */
function formatFecha(iso: string): string {
  const date = new Date(iso + 'T12:00:00');
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function DetalleConsultaPage() {
  const { id } = useParams<{ id: string }>();
  const [pqrs, setPqrs] = useState<Pqrs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  const fetchDetalle = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pqrs/${id}`);
      if (res.status === 404) throw new Error('Radicado no encontrado');
      if (!res.ok) throw new Error(`Error del servidor (${res.status})`);
      const data: Pqrs = await res.json();
      setPqrs(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo conectar con el servidor'
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetalle();
  }, [fetchDetalle]);

  const handleCopiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Fallback para navegadores que no soportan clipboard API
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  // ─── Cargando ──────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="detalle-page">
        <div className="detalle-estado-container">
          <div className="estado-cargando">
            <div className="spinner" />
            <h3>Cargando ficha técnica…</h3>
            <p>Consultando los datos del radicado.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error / No encontrado ─────────────────────────────
  if (error || !pqrs) {
    return (
      <div className="detalle-page">
        <div className="detalle-estado-container">
          <div className="estado-error">
            <div className="estado-error-icon">
              <AlertTriangle size={32} />
            </div>
            <h3>{error === 'Radicado no encontrado' ? 'Radicado no encontrado' : 'Error al cargar el radicado'}</h3>
            <p>{error || 'No se encontraron datos para este radicado.'}</p>
            <div className="detalle-error-actions">
              <Link to="/" className="btn-volver">
                <ArrowLeft size={16} />
                Volver a Consultas
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Ficha técnica completa ────────────────────────────
  const categoriaLower = pqrs.categoria.toLowerCase();

  return (
    <div className="detalle-page">
      {/* Acciones superiores */}
      <div className="detalle-topbar">
        <Link to="/" className="btn-volver">
          <ArrowLeft size={16} />
          Volver a Consultas
        </Link>

        <button
          className={`btn-copiar-enlace ${copiado ? 'btn-copiar-enlace--copiado' : ''}`}
          onClick={handleCopiarEnlace}
        >
          {copiado ? <Check size={16} /> : <Copy size={16} />}
          {copiado ? '¡Enlace copiado!' : 'Copiar Enlace'}
        </button>
      </div>

      {/* Tarjeta principal */}
      <div className="detalle-card">
        {/* Barra de acento */}
        <div className={`detalle-card-accent detalle-card-accent--${categoriaLower}`} />

        {/* Cabecera */}
        <div className="detalle-card-header">
          <div className={`detalle-categoria-icon detalle-categoria-icon--${categoriaLower}`}>
            {iconCategoria[pqrs.categoria]}
          </div>
          <div className="detalle-header-info">
            <div className="detalle-header-badges">
              <span className={`pqrs-badge-categoria pqrs-badge--${categoriaLower}`}>
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
            <h2 className="detalle-radicado-id">{pqrs.id}</h2>
          </div>
        </div>

        {/* Sección: Descripción del caso */}
        <div className="detalle-section">
          <div className="detalle-section-header">
            <MessageSquareText size={16} />
            <h3>Descripción del caso</h3>
          </div>
          <p className="detalle-descripcion">{pqrs.descripcion}</p>
        </div>

        {/* Sección: Datos del trámite */}
        <div className="detalle-section">
          <div className="detalle-section-header">
            <FileText size={16} />
            <h3>Datos del trámite</h3>
          </div>
          <div className="detalle-datos-grid">
            <div className="detalle-dato">
              <div className="detalle-dato-label">
                <Hash size={14} />
                Número de radicado
              </div>
              <div className="detalle-dato-valor">{pqrs.id}</div>
            </div>
            <div className="detalle-dato">
              <div className="detalle-dato-label">
                <User size={14} />
                Solicitante
              </div>
              <div className="detalle-dato-valor">{pqrs.solicitante}</div>
            </div>
            <div className="detalle-dato">
              <div className="detalle-dato-label">
                <Calendar size={14} />
                Fecha de radicación
              </div>
              <div className="detalle-dato-valor">{formatFecha(pqrs.fechaRadicacion)}</div>
            </div>
            <div className="detalle-dato">
              <div className="detalle-dato-label">
                <Scale size={14} />
                Plazo legal de respuesta
              </div>
              <div className="detalle-dato-valor">{pqrs.plazoLegal}</div>
            </div>
          </div>
        </div>

        {/* Sección: Respuesta oficial */}
        <div className="detalle-section detalle-section--respuesta">
          <div className="detalle-section-header">
            <ShieldCheck size={16} />
            <h3>Respuesta oficial</h3>
          </div>
          <div className="detalle-respuesta-content">
            <p>{pqrs.respuestaOficial}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleConsultaPage;
