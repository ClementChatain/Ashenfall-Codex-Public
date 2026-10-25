import fs from 'node:fs';
const source=new URL('../data/rempart-reference-v1.json',import.meta.url);
const data=JSON.parse(fs.readFileSync(source,'utf8'));
if(data.id!=='rempart-reference-v1'||Object.keys(data.nodes).length!==24||Object.keys(data.synergies).length!==6)throw new Error('Incomplete Rempart reference');
fs.writeFileSync(new URL('../site/assets/classes/masteries-v1/reference-data.mjs',import.meta.url),'// Public gameplay reference V1; adjustable working baseline.\nexport const rempartReference = '+JSON.stringify(data)+';\n');
