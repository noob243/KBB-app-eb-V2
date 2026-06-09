import { Client, Case, Event, Avocat, Task, Invoice, Personnel, Fournisseur } from '../types';

export const initialClients: Client[] = [
  { id: 'CLT-001', name: 'Congo Invest SARL', contact: 'Alain Mabiala', email: 'alain@congoinvest.cd', phone: '+243811000001', secteur: 'Investissements & Services Financiers', siege: 'Bvd du 30 Juin, Gombe, Kinshasa', dirigeant: 'Alain Mabiala', typeFacturation: 'Forfaitaire', cases: 2 },
  { id: 'CLT-002', name: 'Kinshasa Digital Solutions', contact: 'Pascaline Bongo', email: 'pascaline@kds.cd', phone: '+243811000002', secteur: 'Infrastructures Numériques & Logiciels', siege: 'Av. de la Gombe 45, Kinshasa', dirigeant: 'Pascaline Bongo', typeFacturation: 'Taux horaire', cases: 1 },
  { id: 'CLT-003', name: 'Bâtir Congo Construction', contact: 'Christine Okito', email: 'c.okito@batircongo.cd', phone: '+243811000003', secteur: 'Bâtiment & Travaux Publics (BTP)', siege: 'Zone Industrielle, Kinshasa', dirigeant: 'Christine Okito', typeFacturation: 'Abonnement mensuel', cases: 5 },
  { id: 'CLT-004', name: 'Saveurs du Fleuve', contact: 'Chantal Biya', email: 'chantal@saveursdufleuve.cd', phone: '+243811000004', secteur: 'Restauration & Agro-alimentaire', siege: 'Av. du Fleuve 12, Kinshasa', dirigeant: 'Chantal Biya', typeFacturation: 'Au dossier (Ponctuelle)', cases: 0 },
];

export const initialCases: Case[] = [
  { id: 'CI-2023-001', reference: 'CI-2023-001', clientId: 'CLT-001', name: 'Litige commercial', client: 'Congo Invest SARL', status: 'En cours', nextHearing: '2024-09-15', notes: 'Dossier complexe concernant un désaccord de facturation de prestations avec un sous-traitant.' },
  { id: 'KDS-2023-012', reference: 'KDS-2023-012', clientId: 'CLT-002', name: 'Dépôt de brevet', client: 'Kinshasa Digital Solutions', status: 'En attente', nextHearing: null, notes: 'Dépôt de marque et brevet technologique en cours d\'examen auprès de l\'ANAPI.' },
  { id: 'BCC-2022-050', reference: 'BCC-2022-050', clientId: 'CLT-003', name: 'Contentieux immobilier', client: 'Bâtir Congo Construction', status: 'Clôturé', nextHearing: null, notes: 'Litige foncier résolu par ordonnance de référé favorable.' },
  { id: 'CI-2023-002', reference: 'CI-2023-002', clientId: 'CLT-001', name: 'Recouvrement de créances', client: 'Congo Invest SARL', status: 'En cours', nextHearing: '2024-10-02', notes: 'Mise en demeure infructueuse. Procédure d\'injonction de payer lancée.' },
];

export const initialEvents: Event[] = [
    { id: 'AUD-LC-01', name: 'Audience: Litige commercial', type: 'Audience', date: '2024-09-15', lieu: 'Tribunal de Commerce' },
    { id: 'AUD-RC-02', name: 'Audience: Recouvrement de créances', type: 'Audience', date: '2024-10-02', lieu: 'Tribunal Judiciaire' },
    { id: 'CONF-DA-01', name: 'Conférence sur le Droit des Affaires', type: 'Conférence', date: '2024-11-20', lieu: 'Palais des Congrès' },
    { id: 'COL-PI-01', name: 'Colloque: Propriété Intellectuelle', type: 'Colloque', date: '2024-12-05', lieu: 'Université de Kinshasa' },
];

export const initialAvocats: Avocat[] = [
    { id: 'JLT-01', fullName: 'Jean-Luc Tshisekedi', photo: null, firstOathDate: '2010-01-15', secondOathDate: '', onaNumber: 'ONA-12345', cabinetStatus: 'Associé', serviceStartDate: '2012-09-01', serviceStatus: 'Actif', cabinetRole: 'Avocat Associé', phone: '0812345678', emails: ['jl.tshisekedi@cabinet.com'], disciplinaryMeasures: 'Aucune mesure à signaler.', mainBar: 'Kinshasa-Gombe', secondaryBar: 'Hauts-Plateaux', maritalStatus: 'Marié(e)', hasChildren: true, childrenCount: 2, physicalAddress: 'Av. de la Gombe, Kinshasa' },
    { id: 'MCM-02', fullName: 'Marie-Claire Mobutu', photo: null, firstOathDate: '2018-05-20', secondOathDate: '', onaNumber: 'ONA-67890', cabinetStatus: 'Senior', serviceStartDate: '2020-01-10', serviceStatus: 'Actif', cabinetRole: 'Avocate Collaboratrice', phone: '0887654321', emails: ['mc.mobutu@cabinet.com'], disciplinaryMeasures: '', mainBar: 'Haut Katanga', secondaryBar: '', maritalStatus: 'Célibataire', hasChildren: false, childrenCount: 0 },
    { id: 'PL-03', fullName: 'Patrick Lumumba', photo: null, firstOathDate: '2022-07-01', secondOathDate: '', onaNumber: 'ONA-11223', cabinetStatus: 'Junior', serviceStartDate: '2023-09-01', serviceStatus: 'Actif', cabinetRole: 'Avocat Stagiaire', phone: '0811223344', emails: ['p.lumumba@cabinet.com'], disciplinaryMeasures: '', mainBar: 'Kinshasa-Matete', secondaryBar: 'Kongo Central', maritalStatus: 'Célibataire', hasChildren: false, childrenCount: 0 },
];

export const initialTasks: Task[] = [
  { id: 'TASK-001', name: 'Rédiger conclusions pour Congo Invest', caseId: 'CI-2023-001', lawyer: 'Jean-Luc Tshisekedi', dueDate: '2024-09-25', status: 'Non effectué' },
  { id: 'TASK-002', name: 'Préparer audience Kinshasa Digital', caseId: 'KDS-2023-012', lawyer: 'Marie-Claire Mobutu', dueDate: '2024-10-10', status: 'Effectué à moitié' },
  { id: 'TASK-003', name: 'Rechercher jurisprudence Bâtir Congo', caseId: 'BCC-2022-050', lawyer: 'Patrick Lumumba', dueDate: '2024-09-30', status: 'Effectué' },
];

export const mockPersonnel = [
    { name: 'Jean-Luc Tshisekedi', role: 'Avocat Associé', status: 'online' },
    { name: 'Marie-Claire Mobutu', role: 'Avocate Collaboratrice', status: 'online' },
    { name: 'Patrick Lumumba', role: 'Avocat Stagiaire', status: 'offline' },
    { name: 'Félicité Kanku', role: 'Secrétaire Juridique', status: 'online' },
    { name: 'Didier Mbenga', role: 'Comptable', status: 'offline' },
];

export const initialConversations: { [key: string]: { sender: string; text: string; time: string }[] } = {
    'Jean-Luc Tshisekedi': [
        { sender: 'Jean-Luc Tshisekedi', text: 'Bonjour, as-tu pu regarder le dossier Congo Invest SARL ?', time: '10:30' },
        { sender: 'me', text: 'Oui, je suis dessus. Je te fais un retour avant midi.', time: '10:31' },
    ],
    'Marie-Claire Mobutu': [
         { sender: 'Marie-Claire Mobutu', text: 'N\'oublie pas l\'audience de 14h pour Kinshasa Digital Solutions.', time: '09:15' },
    ],
};

export const initialInvoices: Invoice[] = [
    { id: 'FACT-CI001-01', reference: 'FACT-CI001-01', caseId: 'CI-2023-001', dueDate: '2024-09-30', totalAmount: 2500, paidAmount: 2500, status: 'Réglée' },
    { id: 'FACT-KDS012-01', reference: 'FACT-KDS012-01', caseId: 'KDS-2023-012', dueDate: '2024-10-15', totalAmount: 5000, paidAmount: 1000, status: 'En cours' },
    { id: 'FACT-CI002-01', reference: 'FACT-CI002-01', caseId: 'CI-2023-002', dueDate: '2024-10-20', totalAmount: 1200, paidAmount: 0, status: 'Non réglée' },
];

export const initialPersonnels: Personnel[] = [
    { 
        id: 'PERS-01', 
        fullName: 'Félicité Kanku', 
        role: 'Secrétaire', 
        email: 'f.kanku@cabinet.com', 
        phone: '0815551234', 
        serviceStartDate: '2021-03-15', 
        serviceStatus: 'Actif',
        salary: 850,
        maritalStatus: 'Marié(e)',
        hasChildren: true,
        childrenCount: 2,
        address: 'Av. de la Gombe 12, Kinshasa/Gombe',
        photo: '',
        disciplinaryMeasure: 'Aucune',
        disciplinaryStatus: 'Aucune'
    },
    { 
        id: 'PERS-02', 
        fullName: 'Didier Mbenga', 
        role: 'Assistant de direction', 
        email: 'd.mbenga@cabinet.com', 
        phone: '0815555678', 
        serviceStartDate: '2019-11-01', 
        serviceStatus: 'Actif',
        salary: 1200,
        maritalStatus: 'Célibataire',
        hasChildren: false,
        childrenCount: 0,
        address: 'Bld du 30 Juin 45, Kinshasa/Gombe',
        photo: '',
        disciplinaryMeasure: 'Aucune',
        disciplinaryStatus: 'Aucune'
    },
    { 
        id: 'PERS-03', 
        fullName: 'Arsène Lupungu', 
        role: 'Intendant', 
        email: 'a.lupungu@cabinet.com', 
        phone: '0815559012', 
        serviceStartDate: '2023-05-10', 
        serviceStatus: 'Actif',
        salary: 600,
        maritalStatus: 'Célibataire',
        hasChildren: false,
        childrenCount: 0,
        address: 'Av. Kisangani 104, Kinshasa/Lingwala',
        photo: '',
        disciplinaryMeasure: 'Avertissement écrit pour retards injustifiés',
        disciplinaryStatus: 'En cours'
    },
];

export const initialFournisseurs: Fournisseur[] = [
    {
        id: 'F-1',
        nomComplet: 'Congo Telecom Services',
        naturePrestation: 'Services',
        designationPrestation: 'Abonnement Internet Fibre Optique Haute Performance',
        typeFacturation: 'Périodique',
        periode: 'mensuel',
        montant: 250,
        adressePhysique: 'Boulevard du 30 Juin, Immeuble CCI, Gombe, Kinshasa',
        adresseMail: 'contact@congotel.cd',
        dirigeantPrincipal: 'Augustin Kabeya',
        referents: [
            { nom: 'Marc Maputa', phone: '0812233445', email: 'm.maputa@congotel.cd' },
            { nom: 'Sarah Mbiya', phone: '0898877665', email: 's.mbiya@congotel.cd' }
        ]
    },
    {
        id: 'F-2',
        nomComplet: 'Papeterie Moderne du Centre',
        naturePrestation: 'Bien',
        designationPrestation: 'Fournitures de bureau, papier d\'impression et consommables',
        typeFacturation: 'Ponctuelle',
        montant: 450,
        adressePhysique: 'Avenue de l\'Équateur, Kinshasa/Gombe',
        adresseMail: 'commandes@papeteriemoderne.cd',
        dirigeantPrincipal: 'Félix Muteba',
        referents: [
            { nom: 'Gisèle Ndolo', phone: '0821122334', email: 'g.ndolo@papeteriemoderne.cd' }
        ]
    },
    {
        id: 'F-3',
        nomComplet: 'Securitas RDC',
        naturePrestation: 'Services',
        designationPrestation: 'Gardiennage et système d\'alarme du cabinet',
        typeFacturation: 'Périodique',
        periode: 'trimestriel',
        montant: 1800,
        adressePhysique: 'Avenue du Flambeau, Zone Industrielle, Kinshasa',
        adresseMail: 'info@securitas.cd',
        dirigeantPrincipal: 'John Smith',
        referents: [
            { nom: 'Capitaine Jean Lelo', phone: '0854433221', email: 'j.lelo@securitas.cd' }
        ]
    }
];
