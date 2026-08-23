import React from 'react';

export interface TarjetaTramiteProps {
  titulo: string;
  descripcion: string;
  categoria: string;
  icon?: React.ReactNode;
}

export const TarjetaTramite: React.FC<TarjetaTramiteProps> = ({
  titulo,
  descripcion,
  categoria,
  icon
}) => {
  return (
    <article className="tarjeta-tramite">
      <div className="tarjeta-header">
        <span className="tarjeta-badge">{categoria}</span>
        {icon && <div className="tarjeta-icon-container">{icon}</div>}
      </div>
      <h3 className="tarjeta-titulo">{titulo}</h3>
      <p className="tarjeta-descripcion">{descripcion}</p>
      <div className="tarjeta-footer">
        <button className="btn-tramite">
          <span>Consultar trámite</span>
          <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </article>
  );
};

export default TarjetaTramite;
