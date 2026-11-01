import { RetrievalEngine } from '../../src/server/retrieval';
import { AnswerGenerator } from '../../src/server/gemini';
import { normalizeStatutoryReferences } from '../../src/server/normalization';

async function runTargetedAudit() {
  const retrievalEngine = new RetrievalEngine();
  const answerGenerator = new AnswerGenerator();

  const tests = [
    {
      id: 'TEST A',
      desc: 'Section Normalization: section11 vs section 11',
      turns: [
        { user: 'section11' },
        { user: 'section 11' }
      ]
    },
    {
      id: 'TEST B',
      desc: 'Progressive Expansion: ndps -> tell more',
      turns: [
        { user: 'ndps' },
        { user: 'tell more' }
      ]
    },
    {
      id: 'TEST C',
      desc: 'Multi-turn Expansion: ndps -> tell more -> explain it more',
      turns: [
        { user: 'ndps' },
        { user: 'tell more' },
        { user: 'i said explain it more' }
      ]
    },
    {
      id: 'TEST D',
      desc: 'Female Search & Section 50(4) Resolution',
      turns: [
        { user: 'can female personal search allowed in public' },
        { user: 'tell me more about this under which section it came' }
      ]
    },
    {
      id: 'TEST E',
      desc: 'Section 42 Expansion: section 42 -> explain more',
      turns: [
        { user: 'section 42' },
        { user: 'explain more' }
      ]
    },
    {
      id: 'TEST F',
      desc: 'Section 50 Expansion: section 50 -> explain more',
      turns: [
        { user: 'section 50' },
        { user: 'explain more' }
      ]
    },
    {
      id: 'TEST G',
      desc: 'Section 11 Expansion: section 11 -> explain more (PIT NDPS)',
      turns: [
        { user: 'section 11' },
        { user: 'explain more' }
      ]
    }
  ];

  console.log('=== TARGETED AUDIT: TESTS A THROUGH G ===\n');

  for (const test of tests) {
    console.log(`========================================`);
    console.log(`[${test.id}] ${test.desc}`);
    console.log(`========================================`);
    
    const history: any[] = [];
    
    for (let i = 0; i < test.turns.length; i++) {
      const turn = test.turns[i];
      const normalizedMessage = normalizeStatutoryReferences(turn.user.trim());
      
      let retrievalQuery = normalizedMessage;
      if (history.length > 0) {
        const userMessages = history.filter((h: any) => h.role === 'user');
        const relevantHistory = userMessages.filter(m => m.content !== turn.user);
        
        const lower = normalizedMessage.toLowerCase().trim();
        const followUpPatterns = [
          'tell more', 'tell me more', 'explain more', 'explain it more', 'i said explain it more',
          'elaborate', 'explain this', 'what about this', 'what about that', 'why', 'how',
          'give more details', 'what are its', 'what are the', 'who can', 'when was',
          'what happens if', 'the procedure', 'the consequences', 'the punishment',
          'does it', 'is it', 'it', 'this', 'that', 'what about', 'how about',
          'details', 'more', 'summarize', 'key points', 'who receives', 'what else',
          'under which section', 'which section', 'under which section it came',
          'tell me more about this'
        ];

        const isFollowUp = followUpPatterns.some(p => lower.includes(p)) || lower.length < 50;

        if (isFollowUp && relevantHistory.length > 0) {
          const context = relevantHistory.slice(-2).map(m => normalizeStatutoryReferences(m.content)).join(' ');
          retrievalQuery = `${context} ${normalizedMessage}`;
        }
      }

      const retrieved = await retrievalEngine.retrieve(retrievalQuery, 8);
      const res = await answerGenerator.generateAnswer(normalizedMessage, retrieved, history, retrievalQuery);
      
      console.log(`\nTurn ${i + 1}:`);
      console.log(`User: ${turn.user}`);
      console.log(`Normalized/Resolved: ${retrievalQuery}`);
      console.log(`Top Retrieved ID: ${retrieved[0]?.record.record_id} (${retrieved[0]?.record.source})`);
      console.log(`Assistant Answer:\n${res.answer}\n`);
      console.log(`Citations: ${res.citations.map(c => `${c.record_id} (${c.section || c.act || ''})`).join(', ') || 'None'}`);

      history.push({ role: 'user', content: turn.user });
      history.push({ role: 'assistant', content: res.answer });
    }
    console.log('\n');
  }
}

runTargetedAudit().catch(console.error);
