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
  async function hasParticipantInSession(participantId,ctx){const n=normalizeParticipantId(participantId);if(!n)return false;const rows=await Data.get(ctx);return rows.some(r=>r.valid!==false&&normalizeParticipantId(r.participantId)===n)}
  async function hasEmailInSession(email,ctx){const n=normalizeEmail(email);if(!n)return false;const rows=await Data.get(ctx);return rows.some(r=>r.valid!==false&&normalizeEmail(r.email)===n)}
  const SUPABASE_URL='https://batqznpfiermwamovrcf.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY='sb_publishable_Crms5r35efue1WAsPIrYew_hgiHWdWe';
  async function rpc(functionName,body){
    const response=await fetch(SUPABASE_URL+'/rest/v1/rpc/'+functionName,{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_PUBLISHABLE_KEY,'Authorization':'Bearer '+SUPABASE_PUBLISHABLE_KEY},body:JSON.stringify(body)});
    const text=await response.text();
    if(!response.ok){let message=text;try{const j=JSON.parse(text);message=j.message||j.hint||j.details||text}catch(e){}throw new Error(message||('Error al ejecutar '+functionName+'.'));}
    if(!text)return null;try{return JSON.parse(text)}catch(e){return text}
  }
  function toDbRecord(record,calc){
    return {
      p_assessment_id:record.assessmentId,
      p_application_id:record.applicationId,
      p_participant_id:record.participantId,
      p_participant_name:record.participantName||record.participantId,
      p_email:normalizeEmail(record.email),
      p_organization_id:record.organizationId,
      p_group_id:record.groupId,
      p_session_id:record.sessionId,
      p_instrument_version:record.instrumentVersion,
      p_i01:record.responses[0],p_i02:record.responses[1],p_i03:record.responses[2],p_i04:record.responses[3],
      p_i05:record.responses[4],p_i06:record.responses[5],p_i07:record.responses[6],p_i08:record.responses[7],
      p_i09:record.responses[8],p_i10:record.responses[9],p_i11:record.responses[10],p_i12:record.responses[11],
      p_irlr_total:calc.total,
      p_nivel_global:calc.level,
      p_d1_score:calc.domains.D1.score,p_d1_level:calc.domains.D1.level,p_d1_exposure:calc.domains.D1.exposure,
      p_d2_score:calc.domains.D2.score,p_d2_level:calc.domains.D2.level,p_d2_exposure:calc.domains.D2.exposure,
      p_d3_score:calc.domains.D3.score,p_d3_level:calc.domains.D3.level,p_d3_exposure:calc.domains.D3.exposure,
      p_d4_score:calc.domains.D4.score,p_d4_level:calc.domains.D4.level,p_d4_exposure:calc.domains.D4.exposure,
      p_highest_exposure_domains:calc.highestExposureDomains.map(k=>calc.domains[k].name).join(' | '),
      p_co_predominance:calc.highestExposureDomains.length>1,
      p_top_3_indicators:calc.principalIndicators.map(x=>x.name).join(' | '),
      p_valid:record.valid!==false
    };
  }
  function fromDbRow(row){
    const responses=[row.i01,row.i02,row.i03,row.i04,row.i05,row.i06,row.i07,row.i08,row.i09,row.i10,row.i11,row.i12].map(Number);
    return {
      assessmentId:row.assessment_id,applicationId:row.application_id,participantId:row.participant_id,
      participantName:row.participant_name||row.participant_id,email:row.email,organizationId:row.organization_id,
      groupId:row.group_id,sessionId:row.session_id,instrumentVersion:row.instrument_version,
      timestamp:row.created_at||row.timestamp,responses,
      IRLR_total:Number(row.irlr_total),nivel_global:row.nivel_global,
      domain_D1_score:Number(row.d1_score),domain_D1_level:row.d1_level,domain_D1_exposure:Number(row.d1_exposure),
      domain_D2_score:Number(row.d2_score),domain_D2_level:row.d2_level,domain_D2_exposure:Number(row.d2_exposure),
      domain_D3_score:Number(row.d3_score),domain_D3_level:row.d3_level,domain_D3_exposure:Number(row.d3_exposure),
      domain_D4_score:Number(row.d4_score),domain_D4_level:row.d4_level,domain_D4_exposure:Number(row.d4_exposure),
      highest_exposure_domains:typeof row.highest_exposure_domains==='string'&&row.highest_exposure_domains?row.highest_exposure_domains.split(' | '):[],
      co_predominance:!!row.co_predominance,
      top_3_indicators:typeof row.top_3_indicators==='string'&&row.top_3_indicators?row.top_3_indicators.split(' | '):[],
      valid:row.valid!==false
    };
  }
  const Data={
    async save(record){
      const calc=calculateIndividual(record.responses);
      try{await rpc('submit_irlr_assessment',toDbRecord(record,calc))}
      catch(err){
        if(String(err.message||'').toLowerCase().includes('duplicate')||String(err.message||'').toLowerCase().includes('correo'))throw new Error('Este correo ya tiene un cuestionario registrado en esta aplicación/sesión.');
        throw err;
      }
      const stored={...record,participantName:record.participantName||record.participantId,IRLR_total:calc.total,nivel_global:calc.level,domain_D1_score:calc.domains.D1.score,domain_D1_level:calc.domains.D1.level,domain_D1_exposure:calc.domains.D1.exposure,domain_D2_score:calc.domains.D2.score,domain_D2_level:calc.domains.D2.level,domain_D2_exposure:calc.domains.D2.exposure,domain_D3_score:calc.domains.D3.score,domain_D3_level:calc.domains.D3.level,domain_D3_exposure:calc.domains.D3.exposure,domain_D4_score:calc.domains.D4.score,domain_D4_level:calc.domains.D4.level,domain_D4_exposure:calc.domains.D4.exposure,highest_exposure_domains:calc.highestExposureDomains.map(k=>calc.domains[k].name),co_predominance:calc.highestExposureDomains.length>1,top_3_indicators:calc.principalIndicators.map(x=>x.name),valid:record.valid!==false};
      return stored;
    },
    async get(filter={}){
      if(filter.applicationId){const rows=await rpc('get_irlr_session_assessments',{p_application_id:filter.applicationId});return (Array.isArray(rows)?rows:[]).map(fromDbRow).filter(r=>(!filter.organizationId||r.organizationId===filter.organizationId)&&(!filter.groupId||r.groupId===filter.groupId)&&(!filter.sessionId||r.sessionId===filter.sessionId)&&(!filter.instrumentVersion||r.instrumentVersion===filter.instrumentVersion));}
      if(filter.organizationId){const rows=await rpc('get_irlr_organization_assessments',{p_organization_id:filter.organizationId});return (Array.isArray(rows)?rows:[]).map(fromDbRow).filter(r=>(!filter.groupId||r.groupId===filter.groupId)&&(!filter.sessionId||r.sessionId===filter.sessionId)&&(!filter.instrumentVersion||r.instrumentVersion===filter.instrumentVersion));}
      return [];
    },
    async all(){const rows=await rpc('get_irlr_organization_assessments',{p_organization_id:''});return (Array.isArray(rows)?rows:[]).map(fromDbRow)},
    async hasEmailInSession(email,ctx){const rows=await this.get(ctx);const n=normalizeEmail(email);return !!n&&rows.some(r=>r.valid!==false&&normalizeEmail(r.email)===n)},
    clear(){return Promise.resolve()}
  };
  async function hasEmailInSessionRemote(email,ctx){return Data.hasEmailInSession(email,ctx)}
  async function createApplication(app){return rpc('create_irlr_application',{p_application_id:app.applicationId,p_organization_id:app.organizationId,p_group_id:app.groupId,p_session_id:app.sessionId,p_instrument_version:app.instrumentVersion})}
  window.IRLREngine={QUESTIONS,SCALE,DOMAINS,VERSIONS,GLOBAL_INTERPRETATIONS,calculateIndividual,calculateGroup,getVersion,contextFromUrl,validContext,makeAssessmentId,makeApplicationId,normalizeParticipantId,normalizeEmail,hasParticipantInSession,hasEmailInSession,hasEmailInSessionRemote,createApplication,SUPABASE_URL};window.IRLRData=Data;
})();
