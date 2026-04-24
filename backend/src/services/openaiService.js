const analyzeLegalDocument = async (text, analysisType) => {
    console.log('📝 ANALIZANDO DOCUMENTO (MODO PRUEBA):', text.substring(0, 80));

    return {
        risks: [
            "Cláusula de aumento de renta sin límite",
            "Falta de especificación de responsabilidades"
        ],
        problematicClauses: [
            {
                clause: "El arrendador podrá rescindir sin previo aviso",
                issue: "Cláusula abusiva que viola el derecho de audiencia"
            }
        ],
        recommendations: [
            "Establecer límites claros",
            "Incluir período de gracia"
        ],
        riskLevel: 8,
        legalBasis: [
            "Artículo 1797 del Código Civil Federal"
        ]
    };
};

const generateQuizFromText = async () => {
    return { keyConcepts: [], questions: [] };
};

module.exports = {
    analyzeLegalDocument,
    generateQuizFromText,
};
