export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isManual = req.query.secret === process.env.CRON_SECRET;
    
    // Permitimos teste manual via query string com o secret
    if (process.env.CRON_SECRET && !isCron && !isManual) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log("CRON JOB INICIADO: Buscando eventos e alunos...");

    // Aqui entrará a lógica de buscar eventos (REST API) onde a data é amanhã
    // e buscar alunos inativos há 90 dias, etc.
    
    // Simulação de sucesso para a configuração da Vercel
    return res.status(200).json({ 
      success: true, 
      message: 'Cron job executado com sucesso. Disparos verificados.' 
    });
  } catch (error) {
    console.error("CRON ERROR:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
