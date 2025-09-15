# Proxy HTTP -> HTTPS para Supabase (Render.com)

## Rápido
1) Sube este repo a GitHub
2) En Render.com: New -> Web Service -> Conecta el repo
3) Build command: `npm install`
   Start command: `npm start`
4) Variables de entorno:
   - SUPABASE_URL = https://xxxx.supabase.co
   - SUPABASE_KEY = <tu anon key>
   - TABLE = colmena (o el nombre de tu tabla)
   - PROXY_TOKEN = (opcional, si quieres proteger el endpoint)
5) Prueba: `POST https://<tu-app>.onrender.com/data` con JSON

## Endpoints
- GET `/` -> health/info
- POST `/data` -> reenvía el JSON a Supabase
