import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/solicitudes';

export default function CreditWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [formData, setFormData] = useState({
        nombres: '', apellido_paterno: '', apellido_materno: '',
        producto_solicitado: 'Préstamo Personal',
        monto_solicitado: 10000, plazo_meses: 12, motivo_credito: 'Remodelación de hogar',
        aceptacion_privacidad: true, autorizacion_buro: true,
        curp: '', fecha_nacimiento: '', nacionalidad: 'Mexicana',
        estado_civil: 'Soltero(a)', dependientes_economicos: 0,
        nivel_estudios: 'Licenciatura',
        tipo_empleo: 'Asalariado', nombre_empresa: '',
        antiguedad_laboral_meses: 0, ingreso_mensual_neto: 0,
        celular: '', correo_electronico: '',
        direccion: { calle: '', numero: '', colonia: '', codigo_postal: '', ciudad_alcaldia: '', estado: '' }
    });

    const [files, setFiles] = useState({ ine_front: null, ine_back: null, comprobante_dom: null });

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('dir_')) {
            const dirName = name.replace('dir_', '');
            setFormData({ ...formData, direccion: { ...formData.direccion, [dirName]: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (name) => (e) => {
        if (e.target.files && e.target.files[0]) {
            setFiles({ ...files, [name]: e.target.files[0] });
        }
    };

    const submitForm = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append('solicitud_data', JSON.stringify(formData));
            if (files.ine_front) data.append('ine_front', files.ine_front);
            if (files.ine_back) data.append('ine_back', files.ine_back);
            if (files.comprobante_dom) data.append('comprobante_dom', files.comprobante_dom);

            const response = await axios.post(API_URL, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            setResult(response.data);
        } catch (err) {
            console.error(err);
            alert('Hubo un error al procesar tu solicitud.');
        } finally {
            setLoading(false);
        }
    };

    if (result) {
        return (
            <div className="glass-panel animate-fade-in" style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                {result.recomendacion === 'Pre-aprobada' ? (
                    <CheckCircle size={80} color="var(--success)" style={{ margin: '0 auto 20px' }} />
                ) : (
                    <AlertCircle size={80} color="var(--warning)" style={{ margin: '0 auto 20px' }} />
                )}
                <h2>Resultado de Evaluación IA</h2>
                <p style={{ marginTop: '15px', color: 'var(--text-secondary)' }}>
                    Nuestra IA ha completado el análisis en tiempo real basado en tu documentación e ingresos.
                </p>
                <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <h3 style={{ color: result.recomendacion === 'Pre-aprobada' ? 'var(--success)' : 'var(--warning)' }}>ESTADO: {result.recomendacion}</h3>
                    {result.recomendacion === 'Pre-aprobada' && result.producto_asignado && (
                        <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '8px', border: '1px solid var(--success)' }}>
                            <h4 style={{ color: 'var(--success)', marginBottom: '5px' }}>¡Felicidades! Tienes una oferta pre-aprobada:</h4>
                            <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{result.producto_asignado}</p>
                            {result.limite_asignado && (
                                <p style={{ fontSize: '1.2rem', color: 'var(--primary)', marginTop: '5px' }}>
                                    Monto autorizado: ${result.limite_asignado.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                </p>
                            )}
                        </div>
                    )}
                    <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>Folio de seguimiento: {result.id}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Paso {step} de 3</h2>
                <span style={{ color: 'var(--text-secondary)' }}>{step === 1 ? 'Datos Personales y Crédito' : step === 2 ? 'Dirección y Empleo' : 'Documentos'}</span>
            </div>

            {step === 1 && (
                <div className="grid-cols-2">
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Detalles del Préstamo</h3>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Monto Solicitado ($ MXN)</label>
                        <input type="number" name="monto_solicitado" className="input-field" value={formData.monto_solicitado} onChange={handleTextChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Plazo (Meses)</label>
                        <select name="plazo_meses" className="input-field" style={{ background: 'rgba(0,0,0,0.2)' }} value={formData.plazo_meses} onChange={handleTextChange}>
                            <option value="6">6 Meses</option>
                            <option value="12">12 Meses</option>
                            <option value="24">24 Meses</option>
                            <option value="36">36 Meses</option>
                            <option value="48">48 Meses</option>
                        </select>
                    </div>
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Motivo del Crédito</label>
                        <input type="text" name="motivo_credito" className="input-field" placeholder="Ej. Remodelación, Vacaciones, Deudas..." value={formData.motivo_credito} onChange={handleTextChange} />
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Datos Personales</h3>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Nombre(s)</label>
                        <input type="text" name="nombres" className="input-field" placeholder="Juan" value={formData.nombres} onChange={handleTextChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Apellido Paterno</label>
                        <input type="text" name="apellido_paterno" className="input-field" placeholder="Pérez" value={formData.apellido_paterno} onChange={handleTextChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Apellido Materno</label>
                        <input type="text" name="apellido_materno" className="input-field" placeholder="López (Opcional)" value={formData.apellido_materno} onChange={handleTextChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">CURP (18 caract.)</label>
                        <input type="text" name="curp" className="input-field" maxLength="18" placeholder="ABCD800101HXXXXX00" value={formData.curp} onChange={handleTextChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Fecha de Nacimiento</label>
                        <input type="date" name="fecha_nacimiento" className="input-field" value={formData.fecha_nacimiento} onChange={handleTextChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Celular</label>
                        <input type="tel" name="celular" className="input-field" value={formData.celular} onChange={handleTextChange} />
                    </div>
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Correo Electrónico</label>
                        <input type="email" name="correo_electronico" className="input-field" value={formData.correo_electronico} onChange={handleTextChange} />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="grid-cols-2">
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Datos de Empleo e Ingresos</h3>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Ingreso Mensual Neto ($ MXN)</label>
                        <input type="number" name="ingreso_mensual_neto" className="input-field" value={formData.ingreso_mensual_neto} onChange={handleTextChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Dependientes Económicos</label>
                        <input type="number" name="dependientes_economicos" className="input-field" value={formData.dependientes_economicos} onChange={handleTextChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Antigüedad Laboral (Meses)</label>
                        <input type="number" name="antiguedad_laboral_meses" className="input-field" value={formData.antiguedad_laboral_meses} onChange={handleTextChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Nombre Empresa</label>
                        <input type="text" name="nombre_empresa" className="input-field" value={formData.nombre_empresa} onChange={handleTextChange} />
                    </div>

                    <div className="input-group" style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Dirección</h3>
                    </div>
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Calle y Número</label>
                        <input type="text" name="dir_calle" className="input-field" placeholder="Av Reforma 123" value={formData.direccion.calle} onChange={handleTextChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Código Postal</label>
                        <input type="text" name="dir_codigo_postal" className="input-field" value={formData.direccion.codigo_postal} onChange={handleTextChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Estado</label>
                        <input type="text" name="dir_estado" className="input-field" value={formData.direccion.estado} onChange={handleTextChange} />
                    </div>
                </div>
            )}

            {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '10px' }}>Sube tu Documentación</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '10px', fontSize: '0.9rem' }}>Nuestro motor OCR la leerá automáticamente para contrastarla contra tus datos.</p>

                    <div className="file-dropzone" onClick={() => document.getElementById('ine_front').click()}>
                        <UploadCloud size={40} color="var(--primary)" style={{ margin: '0 auto 15px' }} />
                        <h4>Identificación Oficial - FRENTE</h4>
                        <p style={{ marginTop: '5px', color: 'var(--text-secondary)' }}>{files.ine_front ? files.ine_front.name : 'Haz clic para subir un PDF o Imagen'}</p>
                        <input type="file" id="ine_front" style={{ display: 'none' }} onChange={handleFileChange('ine_front')} />
                    </div>

                    <div className="file-dropzone" onClick={() => document.getElementById('ine_back').click()}>
                        <UploadCloud size={40} color="var(--primary)" style={{ margin: '0 auto 15px' }} />
                        <h4>Identificación Oficial - REVERSO</h4>
                        <p style={{ marginTop: '5px', color: 'var(--text-secondary)' }}>{files.ine_back ? files.ine_back.name : 'Haz clic para subir un PDF o Imagen'}</p>
                        <input type="file" id="ine_back" style={{ display: 'none' }} onChange={handleFileChange('ine_back')} />
                    </div>

                    <div className="file-dropzone" onClick={() => document.getElementById('comprobante_dom').click()}>
                        <UploadCloud size={40} color="var(--primary)" style={{ margin: '0 auto 15px' }} />
                        <h4>Comprobante de Domicilio</h4>
                        <p style={{ marginTop: '5px', color: 'var(--text-secondary)' }}>{files.comprobante_dom ? files.comprobante_dom.name : 'No mayor a 3 meses (PDF o Imagen)'}</p>
                        <input type="file" id="comprobante_dom" style={{ display: 'none' }} onChange={handleFileChange('comprobante_dom')} />
                    </div>

                    <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.autorizacion_buro}
                                onChange={(e) => setFormData({ ...formData, autorizacion_buro: e.target.checked })}
                                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                            />
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Autorizo a BancaFiel a consultar mi historial en el Buró de Crédito y acepto Aviso de Privacidad.</span>
                        </label>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                {step > 1 ? (
                    <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
                        <ArrowLeft size={18} /> Atrás
                    </button>
                ) : <div />}

                {step < 3 ? (
                    <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
                        Siguiente <ArrowRight size={18} />
                    </button>
                ) : (
                    <button className="btn btn-primary" onClick={submitForm} disabled={loading} style={{ background: loading ? 'var(--text-secondary)' : '' }}>
                        {loading ? 'Evaluando con IA...' : 'Enviar y Evaluar'} <CheckCircle size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
