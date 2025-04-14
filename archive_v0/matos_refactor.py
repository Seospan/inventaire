import json

def add_box_ids(data):
    # Définition des correspondances
    box_mappings = {
        "Caisse admin": "caisse_admin",
        "Classeur": "classeur_admin",
        "Caisse divers déco": "caisse_divers_deco",
        'Caisse "fixations déco"': "caisse_fixations_deco",
        "Caisse électricité / lumière": "caisse_electricite_lumiere",
        "Brico 1 (mallette à outils)": "caisse_brico1",
        "Caisse brico 2": "caisse_brico2",
        "Caisse pharmacie": "caisse_pharmacie",
        "Caisse hygiène": "caisse_hygiene",
        "Caisse Tissus": "caisse_tissus",
        "Caisse Torchons": "caisse_torchons",
        "Malle ustensiles (verte)": "malle_ustensiles",
        "Caisse petits ustensiles": "caisse_petits_ustensiles",
        "Electroménager + Kitchenaid (2 caisses)": "electromenager_kitchenaid",
        "Caisse Café": "caisse_cafe",
        "Caisse chauffe + consommables cuisine": "caisse_chauffe_consommables_cuisine",
        "Caisse couverts": "caisse_couverts",
        "Caisse consommables service": "caisse_consommables_service"
    }

    # Parcourir le JSON et ajouter les boxId aux éléments avec isBox=true
    for section in data.values():
        if isinstance(section, dict):
            if 'subsections' in section:
                for subsection in section['subsections'].values():
                    if 'items' in subsection:
                        for item in subsection['items']:
                            if item.get('isBox') and item['name'] in box_mappings:
                                item['boxId'] = box_mappings[item['name']]

    # Ajouter les boxId aux sections de contenu
    for key in list(data.keys()):
        if key.endswith('_contents'):
            data[key]['boxId'] = key.replace('_contents', '')

    return data

# Utilisation
with open('matos.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

updated_data = add_box_ids(data)

# Sauvegarder le fichier modifié
with open('matos_updated.json', 'w', encoding='utf-8') as f:
    json.dump(updated_data, f, ensure_ascii=False, indent=2)