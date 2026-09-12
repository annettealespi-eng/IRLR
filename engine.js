(function(){
  'use strict';
  const QUESTIONS=['Urgencia Operativa Dominante','Desplazamiento Estratégico','Dependencia de Intervención Directa','Centralización de Decisiones','Presión Operativa Sostenida','Predominio Reactivo','Delegación Dependiente','Restricción Contextual Percibida','Postergación de Conversaciones Críticas','Comunicación Correctiva','Reincidencia Operativa','Desconexión del Impacto Estratégico'];
  const STANDARD=['La mayor parte de mi tiempo operativo se consume resolviendo urgencias en lugar de dirigir estratégicamente.','La operación limita constantemente el espacio disponible para análisis, planificación y dirección.','Procesos críticos continúan dependiendo de mi intervención directa para sostener resultados.','Las decisiones importantes tienden a concentrarse excesivamente en mi rol.','El ritmo operativo actual requiere un nivel de presión sostenida difícil de mantener en el tiempo.','La reacción operativa consume más energía que la construcción estratégica.','La delegación frecuentemente requiere supervisión, corrección o intervención posterior de mi parte.','Las dinámicas actuales de la organización dificultan sostener un liderazgo verdaderamente estratégico.','Existen conversaciones, decisiones o ajustes relevantes que continúan postergándose dentro de la operación.','La comunicación con el equipo ocurre más para corregir desviaciones que para generar alineación preventiva.','Los intentos de cambio en la forma de operar terminan regresando a los mismos patrones de presión y dependencia.','La operación avanza, pero sin suficiente claridad sobre sostenibilidad, impacto estratégico o autonomía real del sistema.'];
  const ENTREPRENEURS=['La mayor parte de mi tiempo se consume resolviendo urgencias de la operación, en lugar de dirigir estratégicamente.','La operación limita constantemente el tiempo disponible para analizar, planificar y tomar decisiones estratégicas.','Procesos o actividades importantes continúan dependiendo de mi intervención directa para sostener los resultados.','Las decisiones importantes tienden a concentrarse excesivamente en mí.','El ritmo actual de trabajo requiere un nivel de presión sostenida que resulta difícil de mantener en el tiempo.','Resolver las situaciones de la operación consume más energía que construir y avanzar estratégicamente.','Delegar o asignar responsabilidades frecuentemente requiere supervisión, corrección o intervención posterior de mi parte.','La forma actual de operar dificulta sostener un liderazgo verdaderamente estratégico.','Existen conversaciones, decisiones o ajustes relevantes que continúan postergándose en mi operación.','La comunicación con las personas con las que trabajo ocurre más para corregir desviaciones que para generar alineación preventiva.','Los intentos de cambiar la forma de operar terminan regresando a los mismos patrones de presión y dependencia.','La operación avanza, pero sin suficiente claridad sobre su sostenibilidad, impacto estratégico o nivel real de autonomía.'];
  const SCALE=[[1,'Nunca o casi nunca'],[2,'Pocas veces'],[3,'Algunas veces'],[4,'Frecuentemente'],[5,'Siempre o casi siempre']];
  const DOMAINS={D1:{name:'Saturación Estratégica',items:[0,1,5],min:3,max:15},D2:{name:'Dependencia Operativa',items:[2,3,6],min:3,max:15},D3:{name:'Deterioro Relacional',items:[8,9],min:2,max:10},D4:{name:'Sostenibilidad Directiva',items:[4,7,10,11],min:4,max:20}};
  const GLOBAL_INTERPRETATIONS={'Estabilidad Funcional':'La operación mantiene autonomía suficiente y el liderazgo conserva capacidad estratégica.','Dependencia Emergente':'Empiezan a aparecer señales de centralización, saturación operativa y pérdida parcial de capacidad directiva.','Riesgo Operativo Elevado':'La operación depende excesivamente del líder. La reacción comienza a sustituir dirección y construcción.','Deterioro Estructural':'El sistema presenta dependencia crítica del liderazgo. La sostenibilidad operativa y directiva ya está comprometida.'};
  const VERSIONS={'IRLR-STD-01':{id:'IRLR-STD-01',label:'Versión estándar',audience:'Aplicación general',texts:STANDARD},'IRLR-EMP-01':{id:'IRLR-EMP-01',label:'Versión adaptada',audience:'Emprendedores, empresarios y Cámaras',texts:ENTREPRENEURS}};
  function classifyGlobal(x){if(x>=12&&x<25)return'Estabilidad Funcional';if(x>=25&&x<37)return'Dependencia Emergente';if(x>=37&&x<49)return'Riesgo Operativo Elevado';if(x>=49&&x<=60)return'Deterioro Estructural';return'FUERA DE RANGO'}
  function classifyDomain(k,x){if(k==='D3'){if(x<4)return'Bajo';if(x<6)return'Medio';if(x<8)return'Alto';return'Crítico'}if(k==='D4'){if(x<9)return'Bajo';if(x<13)return'Medio';if(x<17)return'Alto';return'Crítico'}if(x<6)return'Bajo';if(x<9)return'Medio';if(x<12)return'Alto';return'Crítico'}
  function exposure(k,x){const d=DOMAINS[k];return ((x-d.min)/(d.max-d.min))*100}
  function calculateIndividual(items){
    if(!Array.isArray(items)||items.length!==12||items.some(x=>![1,2,3,4,5].includes(x)))throw new Error('Todas las respuestas deben ser valores enteros de 1 a 5.');
    const total=items.reduce((a,b)=>a+b,0),domains={};
    Object.entries(DOMAINS).forEach(([k,d])=>{const score=d.items.reduce((s,i)=>s+items[i],0);domains[k]={key:k,name:d.name,score,exposure:exposure(k,score),level:classifyDomain(k,score)}});
    const max=Math.max(...Object.values(domains).map(d=>d.exposure));
    const highestExposureDomains=Object.values(domains).filter(d=>Math.abs(d.exposure-max)<1e-12).map(d=>d.key);
    const ranked=QUESTIONS.map((name,i)=>({index:i+1,name,score:items[i]})).sort((a,b)=>b.score-a.score||a.index-b.index);
    const cutoff=ranked[2].score,principalIndicators=ranked.filter(x=>x.score>=cutoff);
    return {total,level:classifyGlobal(total),items:[...items],domains,highestExposureDomains,principalIndicators};
  }
  function calculateGroup(records){
    const valid=(records||[]).filter(r=>r&&r.valid!==false&&Array.isArray(r.responses)&&r.responses.length===12&&r.responses.every(x=>[1,2,3,4,5].includes(x)));
    if(!valid.length)return null;
    const results=valid.map(r=>calculateIndividual(r.responses)),groupScore=results.reduce((s,r)=>s+r.total,0)/results.length,domains={};
    Object.keys(DOMAINS).forEach(k=>{const score=results.reduce((s,r)=>s+r.domains[k].score,0)/results.length;domains[k]={key:k,name:DOMAINS[k].name,score,exposure:exposure(k,score),level:classifyDomain(k,score)}});
    const counts={D1:0,D2:0,D3:0,D4:0};results.forEach(r=>r.highestExposureDomains.forEach(k=>counts[k]++));const maxCount=Math.max(...Object.values(counts));
    const distribution={'Estabilidad Funcional':0,'Dependencia Emergente':0,'Riesgo Operativo Elevado':0,'Deterioro Estructural':0};results.forEach(r=>distribution[r.level]++);const maxDist=Math.max(...Object.values(distribution));
    const indicators=QUESTIONS.map((name,i)=>({index:i+1,name,average:valid.reduce((s,r)=>s+r.responses[i],0)/valid.length})).sort((a,b)=>b.average-a.average||a.index-b.index);
    return {validCount:valid.length,groupScore,groupLevel:classifyGlobal(groupScore),domains,domainFrequency:counts,predominantDomains:Object.keys(counts).filter(k=>counts[k]===maxCount),distribution,mostFrequentLevels:Object.keys(distribution).filter(k=>distribution[k]===maxDist),indicators};
  }
  function getVersion(id){return VERSIONS[id]||null}
  function contextFromUrl(){const p=new URLSearchParams(window.location.search);return{applicationId:p.get('app')||'',organizationId:p.get('org')||'DEMO-ORG',groupId:p.get('group')||'RA-2609-01',sessionId:p.get('session')||'SES-2609-01',instrumentVersion:p.get('version')||'IRLR-STD-01'}}
  function validContext(c){return !!(c&&c.organizationId&&c.groupId&&c.sessionId&&getVersion(c.instrumentVersion))}
  function makeAssessmentId(){return'A-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8).toUpperCase()}
  function makeApplicationId(){return'APP-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8).toUpperCase()}
  function normalizeParticipantId(v){return String(v||'').trim().replace(/\s+/g,' ').toLocaleLowerCase('es-MX')}
  function normalizeEmail(v){return String(v||'').trim().toLocaleLowerCase('es-MX')}
  function hasParticipantInSession(participantId,ctx){const n=normalizeParticipantId(participantId);return !!n&&Data.get(ctx).some(r=>r.valid!==false&&normalizeParticipantId(r.participantId)===n)}
  function hasEmailInSession(email,ctx){const n=normalizeEmail(email);return !!n&&Data.get(ctx).some(r=>r.valid!==false&&normalizeEmail(r.email)===n)}
  const Data={
    save(record){
      const all=JSON.parse(localStorage.getItem('IRLR_ASSESSMENTS_V12')||'[]');
      const ctx={applicationId:record.applicationId,organizationId:record.organizationId,groupId:record.groupId,sessionId:record.sessionId};
      if(hasEmailInSession(record.email,ctx))throw new Error('Este correo ya tiene un cuestionario registrado en esta aplicación/sesión.');
      const calc=calculateIndividual(record.responses);
      const stored={...record,IRLR_total:calc.total,nivel_global:calc.level,domain_D1_score:calc.domains.D1.score,domain_D1_level:calc.domains.D1.level,domain_D1_exposure:calc.domains.D1.exposure,domain_D2_score:calc.domains.D2.score,domain_D2_level:calc.domains.D2.level,domain_D2_exposure:calc.domains.D2.exposure,domain_D3_score:calc.domains.D3.score,domain_D3_level:calc.domains.D3.level,domain_D3_exposure:calc.domains.D3.exposure,domain_D4_score:calc.domains.D4.score,domain_D4_level:calc.domains.D4.level,domain_D4_exposure:calc.domains.D4.exposure,highest_exposure_domains:calc.highestExposureDomains.map(k=>calc.domains[k].name),co_predominance:calc.highestExposureDomains.length>1,top_3_indicators:calc.principalIndicators.map(x=>x.name),valid:record.valid!==false};
      all.push(stored);localStorage.setItem('IRLR_ASSESSMENTS_V12',JSON.stringify(all));return stored;
    },
    get(filter={}){const all=JSON.parse(localStorage.getItem('IRLR_ASSESSMENTS_V12')||'[]');return all.filter(r=>(!filter.applicationId||r.applicationId===filter.applicationId)&&(!filter.organizationId||r.organizationId===filter.organizationId)&&(!filter.groupId||r.groupId===filter.groupId)&&(!filter.sessionId||r.sessionId===filter.sessionId)&&(!filter.instrumentVersion||r.instrumentVersion===filter.instrumentVersion));},
    all(){return JSON.parse(localStorage.getItem('IRLR_ASSESSMENTS_V12')||'[]')},clear(){localStorage.removeItem('IRLR_ASSESSMENTS_V12')}
  };
  window.IRLREngine={QUESTIONS,SCALE,DOMAINS,VERSIONS,GLOBAL_INTERPRETATIONS,calculateIndividual,calculateGroup,getVersion,contextFromUrl,validContext,makeAssessmentId,makeApplicationId,normalizeParticipantId,normalizeEmail,hasParticipantInSession,hasEmailInSession};window.IRLRData=Data;
})();
