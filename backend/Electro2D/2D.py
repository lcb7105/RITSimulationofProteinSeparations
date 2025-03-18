from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Fix CORS

AMINO_ACIDS = {
    'A': {'mass': 89.09, 'pKa': 2.35},
    'R': {'mass': 174.20, 'pKa': 9.00},
    'N': {'mass': 132.12, 'pKa': 2.02},
    # Add the rest of the amino acids...
}

@app.route('/calculateMolecularWeight', methods=['POST'])
def calculate_molecular_weight():
    data = request.get_json()
    sequence = data.get('sequence', '')
    total_weight = sum(AMINO_ACIDS.get(aa, {}).get('mass', 0) for aa in sequence)
    return jsonify({'molecular_weight': total_weight})

@app.route('/calculateTheoreticalPI', methods=['POST'])
def calculate_theoretical_pi():
    data = request.get_json()
    sequence = data.get('sequence', '')

    counts = {aa: sequence.count(aa) for aa in AMINO_ACIDS if AMINO_ACIDS[aa].get('pKa')}
    total_pKa = sum(AMINO_ACIDS[aa]['pKa'] * count for aa, count in counts.items())
    total_count = sum(counts.values())

    theoretical_pi = total_pKa / total_count if total_count > 0 else 7.0
    return jsonify({'theoretical_pi': theoretical_pi})

@app.route('/parseFastaContent', methods=['POST'])
def parse_fasta_content():
    data = request.get_json()
    content = data.get('content', '')

    sequences = []
    current_header = ''
    current_sequence = ''
    for line in content.split('\n'):
        if line.startswith('>'):
            if current_sequence:
                sequences.append({'header': current_header, 'sequence': current_sequence})
            current_header = line[1:]
            current_sequence = ''
        else:
            current_sequence += line.strip()
    if current_sequence:
        sequences.append({'header': current_header, 'sequence': current_sequence})

    return jsonify({'sequences': sequences})

@app.route('/extractProteinInfo', methods=['POST'])
def extract_protein_info():
    data = request.get_json()
    content = data.get('content', '')

    sequences = parse_fasta(content)
    info = []
    for seq in sequences:
        weight = sum(AMINO_ACIDS.get(aa, {}).get('mass', 0) for aa in seq['sequence'])
        pi = sum(AMINO_ACIDS.get(aa, {}).get('pKa', 0) for aa in seq['sequence']) / len(seq['sequence']) if len(seq['sequence']) > 0 else 7.0
        info.append({'header': seq['header'], 'weight': weight, 'pi': pi})

    return jsonify({'protein_info': info})

def parse_fasta(content):
    sequences = []
    current_header = ''
    current_sequence = ''
    for line in content.split('\n'):
        if line.startswith('>'):
            if current_sequence:
                sequences.append({'header': current_header, 'sequence': current_sequence})
            current_header = line[1:]
            current_sequence = ''
        else:
            current_sequence += line.strip()
    if current_sequence:
        sequences.append({'header': current_header, 'sequence': current_sequence})
    return sequences

if __name__ == '__main__':
    app.run(debug=True)
