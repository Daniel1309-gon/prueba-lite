import React, { useState } from 'react';
import { Button } from '../components/atoms/Button';
import { FormField } from '../components/molecules/FormField';
import { downloadInventarioPDF, sendInventarioEmail } from '../api/productoService';

const InventarioPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
        await downloadInventarioPDF();
    } catch (error) {
        console.error("Error descargando", error);
        alert("Error al descargar el PDF");
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
        await sendInventarioEmail(email);
        alert(`PDF enviado correctamente a ${email}`);
        setEmail('');
    } catch (error) {
        console.error(error);
        alert("Error al enviar el correo (Revisa la consola del backend)");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Reporte de Inventario</h1>
        
        <div className="space-y-8">
            {/* Opción 1: Descargar Directa */}
            <div className="bg-blue-50 p-6 rounded-md border border-blue-100">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Descarga Directa</h3>
                <p className="text-sm text-blue-700 mb-4">Obtén el reporte completo de productos en formato PDF.</p>
                <Button onClick={handleDownload} style={{backgroundColor: '#2563EB'}}>
                    Descargar PDF
                </Button>
            </div>

            <hr className="border-gray-200" />

            {/* Opción 2: Enviar por Correo */}
            <div className="bg-green-50 p-6 rounded-md border border-green-100">
                <h3 className="text-lg font-medium text-green-900 mb-2">Enviar por Correo</h3>
                <p className="text-sm text-green-700 mb-4">Enviaremos el PDF adjunto a la dirección que indiques.</p>
                
                <form onSubmit={handleSendEmail}>
                    <FormField 
                        label="Correo Electrónico" 
                        name="email" 
                        type="email" 
                        placeholder="usuario@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button type="submit" disabled={loading} style={{backgroundColor: '#059669'}}>
                        {loading ? 'Enviando...' : 'Enviar PDF'}
                    </Button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InventarioPage;