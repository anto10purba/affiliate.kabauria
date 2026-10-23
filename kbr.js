const SUPABASE_URL='https://ubqnltsjjfdcdaociida.supabase.co';
const SUPABASE_KEY='sb_publishable_WtDMjW-6R2bMLW7Exl8Y3w_eziCCpdZ';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rp=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(+n||0);
const cl=(m,v)=>m==='percent'?(+v)+'%':rp(v)+'/pcs';
const ST={awaiting_payment:'Menunggu pembayaran',paid:'Dibayar',cancelled:'Dibatalkan',none:'-',pending:'Komisi belum dibayar',paid_out:'Komisi sudah dibayar',void:'Komisi batal'};
const st=document.createElement('style');st.textContent=`*{box-sizing:border-box}body{margin:0;background:#f8f8f7;color:#171717;font:14px/1.5 system-ui,sans-serif}header{background:#fff;border-bottom:1px solid #e5e7eb;padding:13px 16px;font-weight:900;letter-spacing:1px;font-size:18px}main{max-width:1100px;margin:auto;padding:16px}.card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:14px;margin-bottom:12px}input,select,textarea{width:100%;padding:10px;border:1px solid #d9dce1;border-radius:9px;margin:4px 0;font:inherit}button{border:0;border-radius:9px;padding:9px 12px;background:#171717;color:#fff;font-weight:700;cursor:pointer;margin:2px}button.s{background:#fff;color:#171717;border:1px solid #d9dce1}button.g{background:#167647}button.r{background:#b42318}.m{color:#b42318;font-size:12px;min-height:16px}.mut{color:#6b7280;font-size:12px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px}.grid img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:9px}.tw{overflow:auto}table{width:100%;border-collapse:collapse;min-width:640px}td,th{padding:8px;border-bottom:1px solid #eee;text-align:left;vertical-align:top;font-size:13px}.tabs button{background:#fff;color:#171717;border:1px solid #d9dce1}.tabs button.on{background:#171717;color:#fff}.st{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}.st b{font-size:20px;display:block}`;document.head.appendChild(st);
async function gate(role,ready){const root=$('app');
 const show=async()=>{const{data:{session}}=await sb.auth.getSession();
  if(!session){root.innerHTML=`<div class=card style="max-width:380px;margin:30px auto"><h2>Masuk ${role==='admin'?'Admin':'Affiliate'}</h2><input id=e type=email placeholder=Email><input id=p type=password placeholder="Password (min. 6 karakter)">${role==='affiliate'?'<input id=n placeholder="Nama (diisi saat daftar)">':''}<button id=li>Masuk</button>${role==='affiliate'?'<button class=s id=su>Daftar affiliate</button>':''}<div id=m class=m></div></div>`;
   $('li').onclick=async()=>{const{error}=await sb.auth.signInWithPassword({email:$('e').value.trim(),password:$('p').value});error?$('m').textContent=error.message:show()};
   if(role==='affiliate')$('su').onclick=async()=>{const{error}=await sb.auth.signUp({email:$('e').value.trim(),password:$('p').value,options:{data:{name:$('n').value.trim()}}});$('m').textContent=error?error.message:'Pendaftaran berhasil. Tunggu persetujuan admin, lalu muat ulang halaman dan masuk.'};
   return}
  const{data:pf}=await sb.from('kbr_profiles').select('*').eq('id',session.user.id).single();
  const out=`<button class=s onclick="sb.auth.signOut().then(()=>location.reload())">Keluar</button>`;
  if(!pf||pf.role!==role){root.innerHTML=`<div class=card>Akun ini bukan akun ${role}. ${out}</div>`;return}
  if(role==='affiliate'&&(!pf.active||(pf.ends_at&&pf.ends_at<new Date().toISOString().slice(0,10)))){root.innerHTML=`<div class=card>Akun belum disetujui admin atau masa aktif sudah berakhir. ${out}</div>`;return}
  root.innerHTML=`<div class=card style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b>${esc(pf.name)} · ${esc(pf.email)}</b>${out}</div><div id=body></div>`;ready(pf,$('body'))};
 show()}
