import React, { useEffect, useState } from 'react';
import { Search, Eye, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/solicitudes';

export default function Dashboard() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <div className="glass-panel animate-fade-in" style={{ padding: '40px' }}>
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
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{s.nombre}</div>
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
                                            background: s.score_riesgo_ia < 40 ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 153, 0, 0.1)',
                                            color: s.score_riesgo_ia < 40 ? 'var(--success)' : 'var(--warning)'
                                        }}>
                                            {s.score_riesgo_ia}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>
                                        {s.recomendacion_ia === 'Pre-aprobada' ? (
                                            <span style={{ background: 'rgba(0, 255, 157, 0.1)', color: 'var(--success)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                <CheckCircle size={14} /> {sol.recomendacion_ia}
                                            </span>
                                        ) : (
                                            <span style={{ background: 'rgba(255, 183, 0, 0.1)', color: 'var(--warning)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                <AlertCircle size={14} /> {sol.recomendacion_ia || 'En Proceso'}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{sol.score_riesgo_ia} / 100</td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        <button className="btn btn-secondary" style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
                                            <Eye size={16} /> Ver
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
