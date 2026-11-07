import { API_BASE_URL } from '../api/Route-book.jsx';
export function urlDaApi(path) { return path ? (/^https?:/i.test(path) ? path : API_BASE_URL + (path.startsWith('/') ? '' : '/') + path) : ''; }
export function iniciais(nome = '') { return nome.trim().split(/\s+/).slice(0,2).map(p=>p[0]).join('').toUpperCase() || 'A'; }
export function dataRelativa(data) {
 if(!data) return 'agora';
 const dias=Math.floor((Date.now()-new Date(data).getTime())/86400000);
 if(dias>0)return 'há '+dias+(dias===1?' dia':' dias');
 const horas=Math.floor((Date.now()-new Date(data).getTime())/3600000);
 return horas>0?'há '+horas+' h':'recentemente';
}
export function lerSalvos() { try { return JSON.parse(localStorage.getItem('RouteBooksPostsSalvos') || '[]'); } catch { return []; } }
