# AzharStore

- Backend: FastAPI (Dokploy-ready)

## Backend
`
cd backend
python -m venv .venv
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
`
- Health: http://localhost:8000/health
- Status: http://localhost:8000/
