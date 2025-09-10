import { Router } from 'express'
import statistiquesService from '../services/statistiques.service'

const router = Router()

// GET /api/v1/statistiques/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [statistiques, activites] = await Promise.all([
      statistiquesService.getStatistiquesDuMois(),
      statistiquesService.getActivitesRecentes()
    ])

    res.json({
      success: true,
      data: {
        statistiques,
        activitesRecentes: activites
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques dashboard:', error)
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    })
  }
})

// GET /api/v1/statistiques/mois
router.get('/mois', async (req, res) => {
  try {
    const statistiques = await statistiquesService.getStatistiquesDuMois()
    res.json({
      success: true,
      data: statistiques
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques du mois:', error)
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    })
  }
})

// GET /api/v1/statistiques/activites
router.get('/activites', async (req, res) => {
  try {
    const activites = await statistiquesService.getActivitesRecentes()
    res.json({
      success: true,
      data: activites
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des activités récentes:', error)
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des activités'
    })
  }
})

// POST /api/v1/statistiques/sauvegarder
router.post('/sauvegarder', async (req, res) => {
  try {
    const { periode = 'monthly' } = req.body
    await statistiquesService.sauvegarderStatistiques(periode)
    
    res.json({
      success: true,
      message: 'Statistiques sauvegardées avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des statistiques:', error)
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la sauvegarde des statistiques'
    })
  }
})

export default router
