import { Citation } from './types';

export interface GroundingValidationResult {
  is_grounded: boolean;
  status: 'GROUNDED' | 'PARTIALLY_GROUNDED' | 'INSUFFICIENT_EVIDENCE' | 'GROUNDING_REJECTED';
  unsupported_claims: string[];
}

export function validateGrounding(
  answer: string,
  contextText: string
): GroundingValidationResult {
  const unsupported_claims: string[] = [];
  let is_grounded = true;

  // Extract common factual claims from answer and check context
  const parcelRegex = /P-\d+/g;
  const weightRegex = /\b\d+(\.\d+)?\s*(kg|g|grams)\b/gi;

  const contextLower = contextText.toLowerCase();

  const parcels = answer.match(parcelRegex) || [];
  for (const parcel of parcels) {
    if (!contextText.includes(parcel)) {
      unsupported_claims.push(`Unsupported parcel ID: ${parcel}`);
      is_grounded = false;
    }
  }

  const weights = answer.match(weightRegex) || [];
  for (const weight of weights) {
    const wLower = weight.toLowerCase();
    if (!contextLower.includes(wLower)) {
      // Check if a normalized equivalent is in the context
      // E.g., '27.2 kg' vs '27.200 kg' or '27 kg 200 g'
      const numMatch = wLower.match(/\d+(\.\d+)?/);
      const unitMatch = wLower.match(/kg|g|grams/);
      let foundEquivalent = false;
      
      if (numMatch && unitMatch) {
        const val = parseFloat(numMatch[0]);
        if (unitMatch[0] === 'kg') {
           // check if 27.200 kg exists or 27 kg 200 g
           const kgStr1 = `${val.toFixed(3)} kg`; // 27.200 kg
           const kgStr2 = `${val.toFixed(1)} kg`; // 27.2 kg
           const gVal = (val % 1) * 1000;
           const kgInt = Math.floor(val);
           const str3 = `${kgInt} kg ${Math.round(gVal)} g`;
           
           if (contextLower.includes(kgStr1) || contextLower.includes(kgStr2) || contextLower.includes(str3)) {
             foundEquivalent = true;
           }
        } else if (unitMatch[0] === 'g' || unitMatch[0] === 'grams') {
           const str1 = `${val} g`;
           const str2 = `${val}g`;
           if (contextLower.includes(str1) || contextLower.includes(str2) || contextLower.includes(`${val}grams`)) {
             foundEquivalent = true;
           }
        }
      }
      
      if (!foundEquivalent) {
        unsupported_claims.push(`Unsupported weight/quantity: ${weight}`);
        is_grounded = false;
      }
    }
  }

  // Procedural Chain Validation
  // Chain: Search -> Seizure -> SHO/Station House Officer -> Section 52A -> FSL
  const lowerAnswer = answer.toLowerCase();
  const cleanLowerAnswer = lowerAnswer.replace(/sho-batathu/gi, 'seal_mark');
  const searchIdx = cleanLowerAnswer.indexOf('search');
  const seizureIdx = cleanLowerAnswer.indexOf('seizure');
  const shoIdx = Math.max(cleanLowerAnswer.indexOf('sho'), cleanLowerAnswer.indexOf('station house officer'));
  const s52aIdx = cleanLowerAnswer.indexOf('52a');
  const fslIdx = cleanLowerAnswer.indexOf('fsl');

  // Verify core chain order if multiple steps are mentioned
  const chainSteps = [
    { name: 'Search', index: searchIdx },
    { name: 'Seizure', index: seizureIdx },
    { name: 'SHO/Station House Officer', index: shoIdx },
    { name: 'Section 52A', index: s52aIdx },
    { name: 'FSL', index: fslIdx }
  ].filter(s => s.index !== -1);

  for (let i = 0; i < chainSteps.length - 1; i++) {
    if (chainSteps[i].index > chainSteps[i + 1].index) {
      unsupported_claims.push(`Procedural sequence error: ${chainSteps[i].name} appeared after ${chainSteps[i + 1].name}`);
      is_grounded = false;
    }
  }

  // Also prevent inventing random officers or seals.
  // For simplicity, we just check if the exact phrase is in context for a few things, 
  // but it's hard to extract arbitrary names.
  // We'll rely on parcel and weight checks, which covers most NDPS evidence queries.

  // If we found unsupported claims, it's GROUNDING_REJECTED.
  let status: 'GROUNDED' | 'PARTIALLY_GROUNDED' | 'INSUFFICIENT_EVIDENCE' | 'GROUNDING_REJECTED' = 'GROUNDED';
  if (!is_grounded) {
    status = 'GROUNDING_REJECTED';
  }

  return {
    is_grounded,
    status,
    unsupported_claims
  };
}
