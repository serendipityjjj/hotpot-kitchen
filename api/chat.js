// api/chat.js (Vercel Serverless Function)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.UPSTAGE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'UPSTAGE_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  try {
    const { prompt } = req.body;
    const response = await fetch('https://api.upstage.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'solar-pro2',
        messages: [
          { role: 'system', content: '너는 훠궈 주방의 중국어 선생님이다.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const content = data.choices[0].message.content;
    return res.status(200).json({ content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}