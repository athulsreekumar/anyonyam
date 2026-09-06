import type { Member } from '@/types/member'

/** Shared sample members for tests - MSW handlers and component tests use the same data. */
export const memberFixture: Member = {
  UNIQUEID: 'ANYONYAM3_1',
  MemberNo: 3,
  Name: 'Krishnan Namboodiri',
  Illam: 'Vadakkumkoor Mana',
  DOB: '1975-04-12',
  Mobile: '9876543210',
  RELATIONSHIP: 'MEMBER',
  Area: 'Tripunithura',
  Subscription: 500,
  DATA_STATUS: 'ACTIVE',
  isAdmin: 0,
  PROFESSION: 'Priest',
  EDUCATION: 'Vedic studies',
  Address: 'Near Balavinayaka Temple',
  AMMATH: '',
  GRAMAM: '',
  VEDAM: 'Rig Veda',
  GOTHRAM: '',
  BloodGroup: 'O+',
}

export const familyMemberFixture: Member = {
  ...memberFixture,
  UNIQUEID: 'ANYONYAM3_2',
  Name: 'Devi Antharjanam',
  RELATIONSHIP: 'WIFE',
}
