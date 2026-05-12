import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
    const sql = neon(process.env.DATABASE_URL);

    try {
        if (req.method === 'GET') {
            const data = await sql`SELECT * FROM selected_gifts ORDER BY id DESC`;
            return res.status(200).json(data);
        }
        if (req.method === 'POST') {
            const { name, notes } = req.body;
            await sql`INSERT INTO selected_gifts (name, notes) VALUES (${name}, ${notes})`;
            return res.status(201).json({ message: 'Selecionado' });
        }
        if (req.method === 'DELETE') {
            const { id } = req.query;
            await sql`DELETE FROM selected_gifts WHERE id = ${id}`;
            return res.status(200).json({ message: 'Removido' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}