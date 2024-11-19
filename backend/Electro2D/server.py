from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from Bio import SeqIO
from Bio.SeqUtils.ProtParam import ProteinAnalysis
import math
import random

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Protein(BaseModel):
    name: str
    mw: float
    pI: float
    color: str
    sequence: str
    xPos: Optional[float] = 50
    yPos: Optional[float] = 50

class GelConditions(BaseModel):
    acrylamidePercent: float
    voltage: float
    phRange: List[float]

class ProteinPosition(BaseModel):
    name: str
    xPos: float
    yPos: float

ACCEPTED_FILE_TYPES = ['fasta', 'fas', 'fa', 'fna', 'ffn', 'faa', 'mpfa']

def calculate_protein_color(protein_name: str, function: str = "") -> str:
    """Assign color based on protein type/function"""
    if "dna" in protein_name.lower():
        return "#FF0000"
    elif "ribosomal" in protein_name.lower():
        return "#0000FF"
    elif "enzyme" in function.lower():
        return "#00FF00"
    else:
        # Generate random color for other proteins
        return f"#{random.randint(0, 0xFFFFFF):06x}"

def calculate_suppressor(acrylamide_percent: float) -> int:
    """Calculate suppressor factor based on acrylamide percentage"""
    if acrylamide_percent > 12:
        return 6
    elif acrylamide_percent > 10:
        return 3
    elif acrylamide_percent > 7.5:
        return 2
    return 1

@app.post("/api/upload")
async def upload_proteins(file: UploadFile = File(...)):
    """Handle protein file upload and parsing"""
    try:
        # Verify file type
        file_ext = file.filename.split('.')[-1].lower()
        if file_ext not in ACCEPTED_FILE_TYPES:
            return JSONResponse(
                status_code=400,
                content={"message": "Invalid file type"}
            )

        # Save uploaded file temporarily
        content = await file.read()
        with open("temp_file.faa", "wb") as f:
            f.write(content)

        proteins = []
        # Parse protein file
        for record in SeqIO.parse("temp_file.faa", "fasta"):
            sequence = str(record.seq)
            analysis = ProteinAnalysis(sequence)
            
            protein = {
                "name": record.description,
                "sequence": sequence,
                "mw": analysis.molecular_weight(),
                "pI": analysis.isoelectric_point(),
                "color": calculate_protein_color(record.description),
                "xPos": 50,
                "yPos": 50
            }
            proteins.append(protein)

        return JSONResponse(content=proteins)

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": f"Error processing file: {str(e)}"}
        )

@app.post("/api/calculate-positions")
async def calculate_positions(
    proteins: List[Protein],
    conditions: GelConditions
):
    """Calculate protein positions based on current conditions"""
    results = []
    suppressor = calculate_suppressor(conditions.acrylamidePercent)
    
    for protein in proteins:
        if len(conditions.phRange) != 2:
            continue
            
        min_ph, max_ph = conditions.phRange
        
        # Calculate IEF (horizontal) position
        x_pos = ((protein.pI - min_ph) / (max_ph - min_ph)) * 80 + 10
        
        # Calculate SDS-PAGE (vertical) position based on MW
        mw_factor = math.log10(protein.mw/6500) / math.log10(116000/6500)
        y_pos = (conditions.voltage/100) * (mw_factor/suppressor) * 80
        
        results.append(ProteinPosition(
            name=protein.name,
            xPos=x_pos,
            yPos=y_pos
        ))
    
    return results

@app.get("/api/protein-types")
async def get_protein_types():
    """Return available protein types and their colors"""
    return {
        "types": [
            {"name": "DNA Binding", "color": "#FF0000"},
            {"name": "Ribosomal", "color": "#0000FF"},
            {"name": "Enzyme", "color": "#00FF00"},
            {"name": "Other", "color": "#808080"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)