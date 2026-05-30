import { create } from 'zustand';

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'ACTIVE' | 'SUSPENDED';
  spent: string;
}

interface ClientState {
  clients: ClientRecord[];
  addClient: (client: ClientRecord) => void;
  resetClients: () => void;
}

const initialClients: ClientRecord[] = [
  { id: 'cli_01', name: 'Acme Global Corp', email: 'billing@acme.com', plan: 'Enterprise SaaS', status: 'ACTIVE', spent: '$128,400.00' },
  { id: 'cli_02', name: 'Stark Industries', email: 'finance@stark.com', plan: 'Enterprise API', status: 'ACTIVE', spent: '$84,200.00' },
  { id: 'cli_03', name: 'Wayne Enterprise', email: 'ledgers@wayne.com', plan: 'Custom SLA', status: 'ACTIVE', spent: '$94,000.00' },
  { id: 'cli_04', name: 'LexCorp Ventures', email: 'billing@lexcorp.com', plan: 'Basic Core License', status: 'SUSPENDED', spent: '$12,300.00' },
];

export const useClientStore = create<ClientState>((set) => ({
  clients: initialClients,

  addClient: (client: ClientRecord) =>
    set((state) => ({
      clients: [client, ...state.clients], // Inserts at the top of the list!
    })),

  resetClients: () =>
    set({ clients: initialClients }),
}));
