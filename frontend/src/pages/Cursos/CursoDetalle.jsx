// src/pages/Cursos/CursoDetalle.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Accordion, Alert } from 'react-bootstrap';
import { ArrowLeft, Clock, BookOpen, Award, Play, FileText, CheckCircle, Lock } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const CursoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModulo, setSelectedModulo] = useState(null);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    fetchCurso();
  }, [id]);

  const fetchCurso = async () => {
    try {
      const docRef = doc(db, "cursos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurso({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNivelColor = (nivel) => {
    switch(nivel?.toLowerCase()) {
      case 'basico': return 'success';
      case 'intermedio': return 'warning';
      case 'avanzado': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  if (!curso) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Curso no encontrado</Alert>
        <Button variant="primary" onClick={() => navigate('/cursos')}>
          Volver a cursos
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="link" 
        onClick={() => navigate('/cursos')} 
        className="mb-4 text-decoration-none"
      >
        <ArrowLeft size={20} /> Volver a cursos
      </Button>

      <Row className="mb-5">
        <Col lg={8}>
          <h1 className="display-5 fw-bold mb-3">{curso.titulo}</h1>
          <p className="lead text-muted">{curso.descripcion}</p>
          
          <div className="d-flex gap-3 mb-3">
            <Badge bg={getNivelColor(curso.nivel)} pill>
              {curso.nivel?.toUpperCase() || 'BÁSICO'}
            </Badge>
            {curso.certificado && (
              <Badge bg="info" pill>
                <Award size={14} className="me-1" />
                Certificado
              </Badge>
            )}
          </div>

          <div className="d-flex gap-4 text-muted">
            <div><Clock size={18} className="me-1" /> {curso.duracion || 'N/A'}</div>
            <div><BookOpen size={18} className="me-1" /> {curso.modulos?.length || 0} módulos</div>
          </div>
        </Col>
      </Row>

      <h3 className="mb-4">📖 Contenido del curso</h3>
      
      {curso.modulos && curso.modulos.length > 0 ? (
        <Accordion>
          {curso.modulos?.map((modulo, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>
                <div className="d-flex justify-content-between align-items-center w-100 me-3">
                  <span>
                    <strong>Módulo {index + 1}:</strong> {modulo.titulo}
                  </span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <p className="text-muted">{modulo.descripcion}</p>
                <div className="mt-3">
                  {modulo.lecciones?.map((leccion, lecIndex) => (
                    <div key={lecIndex} className="d-flex align-items-center gap-3 p-2 border-bottom">
                      {leccion.tipo === 'video' ? <Play size={18} /> : <FileText size={18} />}
                      <div className="flex-grow-1">
                        <div className="fw-bold">Lección {lecIndex + 1}: {leccion.titulo}</div>
                      </div>
                      <Button variant="outline-primary" size="sm">
                        Ver lección
                      </Button>
                    </div>
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <Alert variant="info">
          Este curso está en desarrollo. Próximamente más contenido.
        </Alert>
      )}
    </Container>
  );
};

export default CursoDetalle;