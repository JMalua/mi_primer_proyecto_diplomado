import React, { useState, useEffect } from 'react';
import * as configcat from 'configcat-js';

export const PagosExpress = () => {
  const [isPagosExpressEnabled, setIsPagosExpressEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Reemplaza con tu SDK Key de ConfigCat o tómala de tu variable de entorno
    const client = configcat.getClient(
      process.env.REACT_APP_CONFIGCAT_SDK_KEY || 'TU_SDK_KEY_AQUI',
      configcat.PollingMode.AutoPoll,
      { pollIntervalSeconds: 10 }
    );

    // Evaluamos el toggle 'pagos-express-v1'
    client.getValueAsync('pagos-express-v1', false).then((enabled) => {
      setIsPagosExpressEnabled(enabled);
      setLoading(false);
    });

    return () => {
      client.dispose();
    };
  }, []);

  const handlePago = () => {
    setMensaje('¡Pago procesado con éxito en 1 solo clic!');
  };

  if (loading) {
    return <p className="text-gray-500">Cargando opciones de pago...</p>;
  }

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto my-4 text-center">
      <h2 className="text-xl font-bold mb-3">Módulo de Checkout</h2>

      {/* Flujo protegido por Feature Flag */}
      {isPagosExpressEnabled ? (
        <div className="bg-green-50 p-4 border border-green-200 rounded">
          <p className="text-green-700 font-semibold mb-2">
            🚀 Nueva función: Pagos Express Activa
          </p>
          <button
            onClick={handlePago}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Pagar en 1 Clic con Pagos Express
          </button>
        </div>
      ) : (
        /* Flujo clásico cuando el toggle está en OFF */
        <div className="bg-gray-50 p-4 border border-gray-200 rounded">
          <p className="text-gray-600 mb-2">Flujo de pago tradicional</p>
          <button
            onClick={() => setMensaje('Procesando pago por formulario regular...')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Completar formulario y Pagar
          </button>
        </div>
      )}

      {mensaje && (
        <p className="mt-3 text-sm font-medium text-purple-700">{mensaje}</p>
      )}
    </div>
  );
};