import { useState, useEffect } from 'react';
import * as configcat from 'configcat-js';
import { Droplet, Trash2, Lightbulb, Building2, Search, PhoneCall, Calculator as CalcIcon } from 'lucide-react';
import { TarjetaTramite } from './components/TarjetaTramite';
import { ConsultasPage } from './pages/ConsultasPage';

export function App({ children }: { children?: React.ReactNode }) {
  const [isRestaEnabled, setIsRestaEnabled] = useState<boolean>(false);
  const [numA, setNumA] = useState<number>(0);
  const [numB, setNumB] = useState<number>(0);
  const [resultado, setResultado] = useState<number | null>(null);

  useEffect(() => {
    // Inicialización del cliente de ConfigCat con tu SDK Key
    const client = configcat.getClient(
      'configcat-sdk-1/jhbfCK88XEuIbxj9FBfJZw/4-w6RhtbyUydt3-PRLDccQ',
      configcat.PollingMode.AutoPoll,
      { pollIntervalSeconds: 60 }
    );

    client.getValueAsync('isRestaEnabled', false).then((value) => {
      setIsRestaEnabled(value);
    });

    return () => {
      client.dispose();
    };
  }, []);

  const tramites = [
    {
      id: 'agua-alcantarillado',
      titulo: 'Agua y Alcantarillado',
      descripcion: 'Atención prioritaria y reportes de fugas en vía pública, cortes de suministro no programados y mantenimiento de la red de alcantarillado.',
      categoria: 'fugas, cortes, alcantarillado',
      icon: <Droplet size={24} />
    },
    {
      id: 'recoleccion-basura',
      titulo: 'Recolección de Basura',
      descripcion: 'Consulta de rutas y horarios oficiales de recolección, reporte de acumulación de desechos y atención a puntos críticos comunitarios.',
      categoria: 'Horarios, acumulación, puntos críticos',
      icon: <Trash2 size={24} />
    },
    {
      id: 'alumbrado-publico',
      titulo: 'Alumbrado Público',
      descripcion: 'Mantenimiento preventivo y correctivo para lámparas apagadas, luminarias dañadas y sustitución o reparación de postes caídos.',
      categoria: 'lámparas apagadas, postes caídos',
      icon: <Lightbulb size={24} />
    }
  ];

  return (
    <div className="portal-container">
      {/* Header Institucional */}
      <header className="header-institucional">
        <div className="header-top-bar">
          <div className="container-inner top-bar-content">
            <span>Portal Oficial de Servicios Ciudadanos</span>
            <div className="header-contact">
              <PhoneCall size={14} />
              <span>Atención Ciudadana: 01 800 000 1234</span>
            </div>
          </div>
        </div>

        <div className="header-main container-inner">
          <div className="brand-institucional">
            <div className="escudo-icon">
              <Building2 size={28} />
            </div>
            <div className="brand-titles">
              <span className="gob-title">Gobierno Municipal</span>
              <h1 className="portal-name">Portal de Atención y Trámites</h1>
            </div>
          </div>

          <div className="header-search">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Buscar trámite o servicio..." 
              aria-label="Buscar trámite o servicio"
            />
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="main-content container-inner">
        {children ? (
          children
        ) : (
          <>
            {/* Widget Calculadora con Feature Flag */}
            <section style={{ margin: '2rem 0', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <CalcIcon size={20} />
                <h3 style={{ margin: 0 }}>Calculadora de Liquidación (TBD Demo)</h3>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="number"
                  value={numA}
                  onChange={(e) => setNumA(Number(e.target.value))}
                  style={{ padding: '6px 10px', width: '100px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
                <input
                  type="number"
                  value={numB}
                  onChange={(e) => setNumB(Number(e.target.value))}
                  style={{ padding: '6px 10px', width: '100px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                />
                <button
                  onClick={() => setResultado(numA + numB)}
                  style={{ padding: '6px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Sumar
                </button>
                {/* Botón de Resta expuesto solo si el flag está activo */}
                {isRestaEnabled && (
                  <button
                    onClick={() => setResultado(numA - numB)}
                    style={{ padding: '6px 14px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Restar
                  </button>
                )}
              </div>
              {resultado !== null && (
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Resultado: {resultado}</p>
              )}
            </section>

            <section className="respuestas-section">
              <div className="section-header">
                <h2 className="title-respuestas">Respuestas</h2>
                <p className="subtitle-respuestas">
                  Seleccione una categoría para consultar información, horarios y realizar reportes ciudadanos en línea.
                </p>
              </div>

              <div className="tramites-grid">
                {tramites.map((tramite) => (
                  <TarjetaTramite
                    key={tramite.id}
                    titulo={tramite.titulo}
                    descripcion={tramite.descripcion}
                    categoria={tramite.categoria}
                    icon={tramite.icon}
                  />
                ))}
              </div>
            </section>

            <section className="consultas-section" style={{ marginTop: '3rem' }}>
              <ConsultasPage />
            </section>
          </>
        )}
      </main>

      {/* Footer Institucional */}
      <footer className="footer-institucional">
        <div className="container-inner footer-content">
          <p>© {new Date().getFullYear()} Gobierno Municipal. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="#privacidad">Aviso de Privacidad</a>
            <a href="#contacto">Contacto</a>
            <a href="#terminos">Términos y Condiciones</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;