const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Procedure = require('../models/Procedure');

router.use(verifyToken);

router.get('/', async (req, res, next) => {
  try {
    const { agency, search, limit = 50, skip = 0 } = req.query;
    const query = { isActive: true };

    if (agency) query.agency = agency;
    if (search) query.$text = { $search: search };

    const procedures = await Procedure.find(query).sort({ agency: 1, name: 1 }).skip(parseInt(skip)).limit(parseInt(limit));
    const total = await Procedure.countDocuments(query);

    res.json({
      success: true,
      procedures: procedures.map(p => ({ id: p._id, agency: p.agency, name: p.name, description: p.description?.substring(0, 200), cost: p.cost, deadline: p.deadline, lastUpdated: p.lastUpdated })),
      pagination: { total, limit: parseInt(limit), skip: parseInt(skip), hasMore: skip + parseInt(limit) < total },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const procedure = await Procedure.findById(id);
    if (!procedure) return res.status(404).json({ success: false, error: 'Trámite no encontrado' });

    res.json({ success: true, procedure: {
      id: procedure._id,
      agency: procedure.agency,
      name: procedure.name,
      description: procedure.description,
      requirements: procedure.requirements,
      steps: procedure.steps,
      cost: procedure.cost,
      deadline: procedure.deadline,
      formats: procedure.formats,
      officialLink: procedure.officialLink,
      targetAudience: procedure.targetAudience,
      lastUpdated: procedure.lastUpdated,
    } });
  } catch (error) {
    next(error);
  }
});

router.get('/agencies/list', async (req, res) => {
  const agencies = ['SAT', 'IMSS', 'INFONAVIT', 'CONAGUA', 'SEMARNAT', 'SRE', 'SEP', 'SEDENA', 'PROFECO', 'CONDUSEF', 'RENAPO', 'Otro'];
  res.json({ success: true, agencies });
});

module.exports = router;


