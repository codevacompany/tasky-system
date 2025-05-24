export enum SignUpStatus {
  PENDING = 'pendente',
  APPROVED = 'aprovado',
  REJECTED = 'rejeitado',
  COMPLETED = 'completo',
}

export interface CompanySignUp {
  id: number;
  companyName: string;
  email: string;
  phoneNumber?: string;
  cnpj?: string;
  cep?: string;
  state?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  number?: string;
  complement?: string;
  companySize?: string;
  mainActivity?: string;
  contactName: string;
  contactCpf: string;
  contactEmail: string;
  contactPhone: string;
  status: SignUpStatus;
  activationToken?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
