import React, { useEffect, useState } from 'react';
import { Search, Eye, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/solicitudes';

export default function Dashboard() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedSol, setSelectedSol] = useState(null);

    const fetchSolicitudes = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(API_URL);
            setSolicitudes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '40px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem' }}>Bandeja de Aprobación</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Evaluación impulsada por Inteligencia Artificial</p>
                </div>
                <button className="btn btn-secondary" onClick={fetchSolicitudes}>
                    <RefreshCcw size={18} /> Actualizar
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div className="input-group" style={{ marginBottom: 0, flex: 1, position: 'relative' }}>
                    <Search size={20} color="var(--text-secondary)" style={{ position: 'absolute', top: '15px', left: '15px' }} />
                    <input type="text" className="input-field" placeholder="Buscar por Nombre, CURP o Folio" style={{ paddingLeft: '45px' }} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <select className="input-field" style={{ minWidth: '200px' }}>
                        <option>Todos los Estados</option>
                        <option>Pre-aprobada</option>
                        <option>Revisión Manual</option>
                    </select>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>ID</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Nombre</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Producto</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Límite / Monto</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Score IA</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Recomendación</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Estado</th>
                            <th style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="8" style={{ padding: '30px', textAlign: 'center' }}>Cargando solicitudes...</td></tr>
                        ) : solicitudes.length === 0 ? (
                            <tr><td colSpan="8" style={{ padding: '30px', textAlign: 'center' }}>No hay solicitudes registradas aún.</td></tr>
                        ) : (
                            solicitudes.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                    <td style={{ padding: '15px 20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{s.id.substring(0, 8)}...</td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{s.nombres} {s.apellido_paterno} {s.apellido_materno}</div>
                                        {s.es_cliente_nuevo ? (
                                            <span style={{ fontSize: '0.75rem', background: 'rgba(157, 0, 255, 0.1)', color: '#b366ff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>NUEVO</span>
                                        ) : (
                                            <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>EXISTENTE</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '15px 20px', color: 'var(--text-secondary)' }}>{s.producto_solicitado}</td>
                                    <td style={{ padding: '15px 20px' }}>
                                        {s.limite_credito ? `$${s.limite_credito.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '-'}
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold',
                                            background: s.score_riesgo_ia <= 20 ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 153, 0, 0.1)',
                                            color: s.score_riesgo_ia <= 20 ? 'var(--success)' : 'var(--warning)'
                                        }}>
                                            {s.score_riesgo_ia}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>
                                        {s.recomendacion_ia === 'Pre-aprobada' ? (
                                            <span style={{ background: 'rgba(0, 255, 157, 0.1)', color: 'var(--success)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                <CheckCircle size={14} /> {s.recomendacion_ia}
                                            </span>
                                        ) : (
                                            <span style={{ background: 'rgba(255, 183, 0, 0.1)', color: 'var(--warning)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                <AlertCircle size={14} /> {s.recomendacion_ia || 'En Proceso'}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{s.estado_proceso}</td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        <button className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)' }} onClick={() => setSelectedSol(s)}>
                                            <Eye size={16} /> Ver
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedSol && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedSol(null)}>
                    <div className="animate-fade-in" style={{ background: 'var(--surface)', margin: 'auto', padding: '30px', borderRadius: '15px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-light)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '15px', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Detalles de la Solicitud</h2>
                            <button className="btn btn-secondary" style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedSol(null)}>X</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Nombre</p><strong>{selectedSol.nombres} {selectedSol.apellido_paterno} {selectedSol.apellido_materno}</strong></div>
                            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>CURP</p><strong>{selectedSol.curp}</strong></div>
                            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Producto Solicitado</p><strong>{selectedSol.producto_solicitado}</strong></div>
                            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Ingreso Mensual Neto</p><strong>${selectedSol.ingreso_mensual_neto?.toLocaleString()}</strong></div>
                            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Antigüedad Laboral</p><strong>{selectedSol.antiguedad_laboral_meses} meses</strong></div>
                            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Estado Civil</p><strong>{selectedSol.estado_civil}</strong></div>
                            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Teléfono</p><strong>{selectedSol.celular}</strong></div>
                            <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Correo</p><strong>{selectedSol.correo_electronico}</strong></div>
                        </div>

                        {selectedSol.producto_solicitado === 'Préstamo Personal' && (
                            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 10px' }}>Detalles del Préstamo</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Monto Solicitado</p><strong>${selectedSol.monto_solicitado?.toLocaleString()}</strong></div>
                                    <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Plazo</p><strong>{selectedSol.plazo_meses} meses</strong></div>
                                    <div style={{ gridColumn: '1 / -1' }}><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Motivo</p><strong>{selectedSol.motivo_credito}</strong></div>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '20px', padding: '15px', background: selectedSol.recomendacion_ia === 'Pre-aprobada' ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 183, 0, 0.05)', borderRadius: '8px', border: selectedSol.recomendacion_ia === 'Pre-aprobada' ? '1px solid rgba(0, 255, 136, 0.2)' : '1px solid rgba(255, 183, 0, 0.2)' }}>
                            <h4 style={{ color: selectedSol.recomendacion_ia === 'Pre-aprobada' ? 'var(--success)' : 'var(--warning)', margin: '0 0 10px' }}>Resolución IA</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Score de Riesgo</p><strong style={{ color: selectedSol.score_riesgo_ia <= 20 ? 'var(--success)' : 'var(--warning)' }}>{selectedSol.score_riesgo_ia} / 100</strong></div>
                                <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Recomendación</p><strong>{selectedSol.recomendacion_ia}</strong></div>
                                <div><p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Línea Autorizada</p><strong>{selectedSol.limite_credito ? `$${selectedSol.limite_credito.toLocaleString()}` : 'N/A'}</strong></div>
                            </div>
                            {selectedSol.ia_razon_revision && (
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '6px', borderLeft: selectedSol.recomendacion_ia === 'Pre-aprobada' ? '4px solid var(--success)' : '4px solid var(--warning)' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 5px' }}>Motivo / Justificación:</p>
                                    <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{selectedSol.ia_razon_revision}</span>
                                </div>
                            )}
                        </div>

                        {selectedSol.estado_proceso === 'Pendiente' && (
                            <div style={{ display: 'flex', gap: '15px', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', justifyContent: 'center' }}>
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'var(--success)', border: 'none', color: '#000' }}
                                    onClick={async () => {
                                        try {
                                            await axios.put(`${API_URL}/${selectedSol.id}/estado`, { estado: 'APROBADA' });
                                            setSelectedSol(null);
                                            fetchSolicitudes();
                                        } catch (e) { console.error(e); alert("Error al actualizar"); }
                                    }}
                                >
                                    <CheckCircle size={18} /> Aprobar Solicitud
                                </button>
                                <button
                                    className="btn btn-primary"
                                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: '#ff3366', border: 'none', color: '#fff' }}
                                    onClick={async () => {
                                        try {
                                            await axios.put(`${API_URL}/${selectedSol.id}/estado`, { estado: 'RECHAZADA' });
                                            setSelectedSol(null);
                                            fetchSolicitudes();
                                        } catch (e) { console.error(e); alert("Error al actualizar"); }
                                    }}
                                >
                                    <AlertCircle size={18} /> Denegar Solicitud
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}
