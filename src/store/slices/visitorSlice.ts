import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type VisitorType = 'guest' | 'delivery' | 'maid';
export type VisitorStatus = 'pending' | 'approved' | 'rejected' | 'left_at_gate';

export type PreApprovedInvite = {
  id: string;
  guestName: string;
  type: VisitorType;
  dateTime: string;
  passcode: string;
  status: 'active' | 'used' | 'cancelled';
  residentId: string;
  residentName: string;
  flatNumber: string;
  societyName: string;
};

export type VisitorLogEntry = {
  id: string;
  name: string;
  type: VisitorType;
  time: string;
  date: string;
  status: VisitorStatus;
  actionBy: string;
  phone: string;
  flatNumber: string;
  avatar: any;
  company?: string;
  passcodeUsed?: string;
};

export type AuthRequest = {
  id: string;
  name: string;
  type: VisitorType;
  company?: string;
  flatNumber: string;
  phone: string;
  timeLeft: number;
};

interface VisitorState {
  preApprovedInvites: PreApprovedInvite[];
  visitorsLog: VisitorLogEntry[];
  activeAuthRequest: AuthRequest | null;
}

const initialState: VisitorState = {
  preApprovedInvites: [
    {
      id: 'p1',
      guestName: 'Anshu Singh',
      type: 'guest',
      dateTime: '23 Jul 2025 | 11:00 am',
      passcode: '200895',
      status: 'active',
      residentId: '1',
      residentName: 'John Doe',
      flatNumber: '101A',
      societyName: 'BelleVie',
    },
    {
      id: 'p2',
      guestName: 'Sarah Johnson',
      type: 'guest',
      dateTime: '24 Jul 2025 | 2:00 pm',
      passcode: '123456',
      status: 'active',
      residentId: '1',
      residentName: 'John Doe',
      flatNumber: '101A',
      societyName: 'BelleVie',
    }
  ],
  visitorsLog: [
    {
      id: '1',
      name: 'Anshu Singh',
      type: 'guest',
      time: '11:00 am',
      date: '23 Jul 2025',
      status: 'pending',
      actionBy: 'No action taken by Resident',
      phone: '+91 98765 43210',
      flatNumber: '101A',
      avatar: require('@/assets/images/avatars/visitor1.png'),
    },
    {
      id: '2',
      name: 'Amazon',
      type: 'delivery',
      time: '11:00 am',
      date: '23 Jul 2025',
      status: 'pending',
      actionBy: 'No action taken by Resident',
      phone: '+91 88888 77777',
      flatNumber: '101A',
      avatar: require('@/assets/images/avatars/visitor2.png'),
      company: 'Amazon',
    },
    {
      id: '3',
      name: 'Raj kumar',
      type: 'maid',
      time: '11:00 am',
      date: '18 Jul 2025',
      status: 'approved',
      actionBy: 'Approved by Jyoti Singh',
      phone: '+91 77777 66666',
      flatNumber: '101A',
      avatar: require('@/assets/images/avatars/visitor3.png'),
    }
  ],
  activeAuthRequest: null,
};

const visitorSlice = createSlice({
  name: 'visitor',
  initialState,
  reducers: {
    setPreApprovedInvites: (state, action: PayloadAction<PreApprovedInvite[]>) => {
      state.preApprovedInvites = action.payload;
    },
    addPreApprovedInvite: (state, action: PayloadAction<PreApprovedInvite>) => {
      state.preApprovedInvites.unshift(action.payload);
    },
    updatePreApprovedInviteStatus: (state, action: PayloadAction<{ id: string; status: 'active' | 'used' | 'cancelled' }>) => {
      state.preApprovedInvites = state.preApprovedInvites.map(i =>
        i.id === action.payload.id ? { ...i, status: action.payload.status } : i
      );
    },
    setVisitorsLog: (state, action: PayloadAction<VisitorLogEntry[]>) => {
      state.visitorsLog = action.payload;
    },
    addVisitorLogEntry: (state, action: PayloadAction<VisitorLogEntry>) => {
      state.visitorsLog.unshift(action.payload);
    },
    updateVisitorLogStatus: (state, action: PayloadAction<{ id: string; status: VisitorStatus; actionBy: string; time?: string; date?: string; passcodeUsed?: string }>) => {
      state.visitorsLog = state.visitorsLog.map(entry =>
        entry.id === action.payload.id
          ? {
              ...entry,
              status: action.payload.status,
              actionBy: action.payload.actionBy,
              ...(action.payload.time ? { time: action.payload.time } : {}),
              ...(action.payload.date ? { date: action.payload.date } : {}),
              ...(action.payload.passcodeUsed ? { passcodeUsed: action.payload.passcodeUsed } : {}),
            }
          : entry
      );
    },
    setActiveAuthRequest: (state, action: PayloadAction<AuthRequest | null>) => {
      state.activeAuthRequest = action.payload;
    },
    updateActiveAuthRequestTimeLeft: (state, action: PayloadAction<number>) => {
      if (state.activeAuthRequest) {
        state.activeAuthRequest.timeLeft = action.payload;
      }
    },
  },
});

export const {
  setPreApprovedInvites,
  addPreApprovedInvite,
  updatePreApprovedInviteStatus,
  setVisitorsLog,
  addVisitorLogEntry,
  updateVisitorLogStatus,
  setActiveAuthRequest,
  updateActiveAuthRequestTimeLeft,
} = visitorSlice.actions;

export default visitorSlice.reducer;
