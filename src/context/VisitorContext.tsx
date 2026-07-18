import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { AuthContext } from './AuthContext';

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

type VisitorContextType = {
  preApprovedInvites: PreApprovedInvite[];
  visitorsLog: VisitorLogEntry[];
  activeAuthRequest: AuthRequest | null;
  createPreApprovedInvite: (guestName: string, type: VisitorType, dateTime: string) => PreApprovedInvite;
  submitGuardPasscode: (passcode: string) => { success: boolean; message: string; invite?: PreApprovedInvite };
  submitGuardManualEntry: (visitorDetails: { name: string; type: VisitorType; company?: string; flatNumber: string; phone: string }) => { success: boolean; requestId: string };
  respondToAuthRequest: (requestId: string, response: 'approved' | 'rejected' | 'left_at_gate') => void;
  clearActiveAuthRequest: () => void;
};

export const VisitorContext = createContext<VisitorContextType>({} as VisitorContextType);

// Helper to format time (e.g. "11:00 am")
const getFormattedTime = () => {
  const date = new Date();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};

// Helper to format date (e.g. "23 Jul 2025")
const getFormattedDate = () => {
  const date = new Date();
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const VisitorProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);

  // Initial Seed Data
  const [preApprovedInvites, setPreApprovedInvites] = useState<PreApprovedInvite[]>([
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
  ]);

  const [visitorsLog, setVisitorsLog] = useState<VisitorLogEntry[]>([
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
      avatar: require('../../assets/images/avatars/visitor1.png'),
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
      avatar: require('../../assets/images/avatars/visitor2.png'),
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
      avatar: require('../../assets/images/avatars/visitor3.png'),
    }
  ]);

  const [activeAuthRequest, setActiveAuthRequest] = useState<AuthRequest | null>(null);

  // Countdown timer logic for active requests
  useEffect(() => {
    if (!activeAuthRequest) return;

    const timer = setInterval(() => {
      setActiveAuthRequest(prev => {
        if (!prev) return null;
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          // Auto-reject on timeout
          handleAutoReject(prev.id);
          return null;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAuthRequest]);

  const handleAutoReject = (requestId: string) => {
    setVisitorsLog(prevLog =>
      prevLog.map(entry => {
        if (entry.id === requestId) {
          return {
            ...entry,
            status: 'rejected',
            actionBy: 'Auto-rejected (Timeout)',
          };
        }
        return entry;
      })
    );
  };

  // Create a pre-approved gate pass invite
  const createPreApprovedInvite = (guestName: string, type: VisitorType, dateTime: string) => {
    // Generate a unique 6-digit passcode
    const passcode = Math.floor(100000 + Math.random() * 900000).toString();
    const newInvite: PreApprovedInvite = {
      id: `p_${Date.now()}`,
      guestName,
      type,
      dateTime,
      passcode,
      status: 'active',
      residentId: user?.id || '1',
      residentName: user?.name || 'John Doe',
      flatNumber: user?.flatNumber || '101A',
      societyName: 'BelleVie',
    };

    setPreApprovedInvites(prev => [newInvite, ...prev]);

    // Also add an entry in the visitor log as a pending pre-approved visitor
    const newLogEntry: VisitorLogEntry = {
      id: newInvite.id,
      name: guestName,
      type,
      time: dateTime.split('|')[1]?.trim() || getFormattedTime(),
      date: dateTime.split('|')[0]?.trim() || getFormattedDate(),
      status: 'approved',
      actionBy: `Pre-approved by ${user?.name || 'Resident'}`,
      phone: '+91 ----- -----',
      flatNumber: user?.flatNumber || '101A',
      avatar: require('../../assets/images/avatars/user.png'),
    };
    
    setVisitorsLog(prev => [newLogEntry, ...prev]);

    return newInvite;
  };

  // Submit passcode at the guard gate
  const submitGuardPasscode = (passcode: string) => {
    const invite = preApprovedInvites.find(i => i.passcode === passcode && i.status === 'active');
    
    if (invite) {
      // Mark as used
      setPreApprovedInvites(prev =>
        prev.map(i => (i.id === invite.id ? { ...i, status: 'used' } : i))
      );

      // Check if there is already a log entry for this invite ID and update it, or add a new one
      setVisitorsLog(prev => {
        const exists = prev.some(entry => entry.id === invite.id);
        if (exists) {
          return prev.map(entry =>
            entry.id === invite.id
              ? {
                  ...entry,
                  status: 'approved' as VisitorStatus,
                  time: getFormattedTime(),
                  date: getFormattedDate(),
                  actionBy: `Approved by Pre-approval (Pass: ${passcode})`,
                }
              : entry
          );
        } else {
          return [
            {
              id: invite.id,
              name: invite.guestName,
              type: invite.type,
              time: getFormattedTime(),
              date: getFormattedDate(),
              status: 'approved',
              actionBy: `Approved by Pre-approval (Pass: ${passcode})`,
              phone: '+91 ----- -----',
              flatNumber: invite.flatNumber,
              avatar: require('../../assets/images/avatars/user.png'),
              passcodeUsed: passcode,
            },
            ...prev,
          ];
        }
      });

      return { success: true, message: `Passcode Verified! Checked in ${invite.guestName}.`, invite };
    }

    return { success: false, message: 'Invalid or expired passcode' };
  };

  // Submit manual visitor entry at the guard gate
  const submitGuardManualEntry = (visitorDetails: {
    name: string;
    type: VisitorType;
    company?: string;
    flatNumber: string;
    phone: string;
  }) => {
    const requestId = `req_${Date.now()}`;
    
    // 1. Add log entry as 'pending'
    const newEntry: VisitorLogEntry = {
      id: requestId,
      name: visitorDetails.name,
      type: visitorDetails.type,
      time: getFormattedTime(),
      date: getFormattedDate(),
      status: 'pending',
      actionBy: 'No action taken by Resident',
      phone: visitorDetails.phone,
      flatNumber: visitorDetails.flatNumber,
      avatar: visitorDetails.type === 'delivery' 
        ? require('../../assets/images/avatars/visitor2.png') 
        : require('../../assets/images/avatars/visitor4.png'),
      company: visitorDetails.company,
    };

    setVisitorsLog(prev => [newEntry, ...prev]);

    // 2. Set active request to trigger resident popup modal
    const request: AuthRequest = {
      id: requestId,
      name: visitorDetails.name,
      type: visitorDetails.type,
      company: visitorDetails.company,
      flatNumber: visitorDetails.flatNumber,
      phone: visitorDetails.phone,
      timeLeft: 15,
    };

    setActiveAuthRequest(request);

    return { success: true, requestId };
  };

  // Resident responds to the authorization request popup
  const respondToAuthRequest = (requestId: string, response: 'approved' | 'rejected' | 'left_at_gate') => {
    setVisitorsLog(prevLog =>
      prevLog.map(entry => {
        if (entry.id === requestId) {
          let actionBy = '';
          if (response === 'approved') actionBy = `Approved by ${user?.name || 'Resident'}`;
          else if (response === 'rejected') actionBy = `Rejected by ${user?.name || 'Resident'}`;
          else if (response === 'left_at_gate') actionBy = `Left at Gate by ${user?.name || 'Resident'}`;

          return {
            ...entry,
            status: response,
            actionBy,
          };
        }
        return entry;
      })
    );

    // Clear the active auth request
    setActiveAuthRequest(null);
  };

  const clearActiveAuthRequest = () => {
    setActiveAuthRequest(null);
  };

  return (
    <VisitorContext.Provider
      value={{
        preApprovedInvites,
        visitorsLog,
        activeAuthRequest,
        createPreApprovedInvite,
        submitGuardPasscode,
        submitGuardManualEntry,
        respondToAuthRequest,
        clearActiveAuthRequest,
      }}
    >
      {children}
    </VisitorContext.Provider>
  );
};
