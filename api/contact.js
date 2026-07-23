import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, message } = req.body ?? {}

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Preencha todos os campos antes de enviar.' })
  }

  try {
    await sql`
      insert into contact_messages (name, email, message)
      values (${name.trim()}, ${email.trim()}, ${message.trim()})
    `
    return res.status(201).json({ ok: true })
  } catch (error) {
    console.error('[api/contact] falha ao salvar mensagem:', error)
    return res.status(500).json({ error: 'Não foi possível enviar sua mensagem agora. Tente novamente em instantes.' })
  }
}
