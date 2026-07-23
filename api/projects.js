import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const projects = await sql`
      select id, title, description, image_url, tech_stack, live_url, repo_url, featured, created_at
      from projects
      order by created_at desc
    `
    return res.status(200).json(projects)
  } catch (error) {
    console.error('[api/projects] falha ao buscar projetos:', error)
    return res.status(500).json({ error: 'Erro ao buscar projetos.' })
  }
}
