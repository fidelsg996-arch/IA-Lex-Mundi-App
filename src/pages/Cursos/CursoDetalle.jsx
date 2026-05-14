// src/pages/Cursos/CursoDetalle.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import CursoVistaDetalle from './components/CursoVistaDetalle';
import CursoFormulario from './components/CursoFormulario';

const CursoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [curso, setCurso] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  const path = location.pathname;
  const esNuevo = path === '/cursos/nuevo';
  const esEdicion = path.includes('/editar');
  
  let idDocumento = null;
  if (esEdicion && id) {
    idDocumento = id;
  } else if (!esNuevo && id && !esEdicion) {
    idDocumento = id;
  }

  useEffect(() => {
    if (idDocumento && !esNuevo && !esEdicion) {
      cargarCurso();
    } else {
      setCargando(false);
    }
  }, [idDocumento]);

  const cargarCurso = async () => {
    try {
      const docRef = doc(db, 'cursos', idDocumento);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurso({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate('/cursos');
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/cursos');
    }
    setCargando(false);
  };

  if (cargando) {
    return <div className="text-center py-20">Cargando curso...</div>;
  }

  if (esNuevo) {
    return <CursoFormulario onCancelar={() => navigate('/cursos')} />;
  }

  if (esEdicion && isAdmin) {
    return <CursoFormulario cursoExistente={curso} onCancelar={() => navigate('/cursos')} />;
  }

  if (!curso) {
    return <div className="text-center py-20">Curso no encontrado</div>;
  }

  return (
    <CursoVistaDetalle 
      curso={curso} 
      idDocumento={idDocumento} 
      onVolver={() => navigate('/cursos')} 
    />
  );
};

export default CursoDetalle;