import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    const sql = neon(process.env.DATABASE_URL);
    try {
        if (req.method === 'GET') {
            const data = await sql`SELECT * FROM gift_ideas ORDER BY id DESC`;
            return res.status(200).json(data);
        }
        if (req.method === 'POST') {
            const { name, notes, image } = req.body;
            await sql`INSERT INTO gift_ideas (name, notes, image) VALUES (${name}, ${notes}, ${image})`;
            return res.status(201).json({ message: 'Ideia criada' });
        }
        if (req.method === 'DELETE') {
            await sql`DELETE FROM gift_ideas WHERE id = ${req.query.id}`;
            return res.status(200).json({ message: 'Removido' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}