import React, { createContext, useEffect, ReactNode, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from './AuthContext';
import { RootState } from '@/store';
import {
  PreApprovedInvite,
  VisitorLogEntry,
  AuthRequest,
  VisitorType,
  VisitorStatus,
  addPreApprovedInvite,
  updatePreApprovedInviteStatus,
  addVisitorLogEntry,
  updateVisitorLogStatus,
  setActiveAuthRequest,
  updateActiveAuthRequestTimeLeft,
} from '@/store/slices/visitorSlice';

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
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  // Read state from Redux
  const preApprovedInvites = useSelector((state: RootState) => state.visitor.preApprovedInvites);
  const visitorsLog = useSelector((state: RootState) => state.visitor.visitorsLog);
  const activeAuthRequest = useSelector((state: RootState) => state.visitor.activeAuthRequest);

  // Countdown timer logic for active requests
  useEffect(() => {
    if (!activeAuthRequest) return;

    const timer = setInterval(() => {
      if (activeAuthRequest.timeLeft <= 1) {
        clearInterval(timer);
        handleAutoReject(activeAuthRequest.id);
      } else {
        dispatch(updateActiveAuthRequestTimeLeft(activeAuthRequest.timeLeft - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAuthRequest, dispatch]);

  const handleAutoReject = (requestId: string) => {
    dispatch(updateVisitorLogStatus({
      id: requestId,
      status: 'rejected',
      actionBy: 'Auto-rejected (Timeout)',
    }));
    dispatch(setActiveAuthRequest(null));
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

    dispatch(addPreApprovedInvite(newInvite));

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
      avatar: require('@/assets/images/avatars/user.png'),
    };
    
    dispatch(addVisitorLogEntry(newLogEntry));

    return newInvite;
  };

  // Submit passcode at the guard gate
  const submitGuardPasscode = (passcode: string) => {
    const invite = preApprovedInvites.find(i => i.passcode === passcode && i.status === 'active');
    
    if (invite) {
      // Mark as used
      dispatch(updatePreApprovedInviteStatus({ id: invite.id, status: 'used' }));

      // Check if there is already a log entry for this invite ID and update it, or add a new one
      const exists = visitorsLog.some(entry => entry.id === invite.id);
      if (exists) {
        dispatch(updateVisitorLogStatus({
          id: invite.id,
          status: 'approved',
          time: getFormattedTime(),
          date: getFormattedDate(),
          actionBy: `Approved by Pre-approval (Pass: ${passcode})`,
        }));
      } else {
        dispatch(addVisitorLogEntry({
          id: invite.id,
          name: invite.guestName,
          type: invite.type,
          time: getFormattedTime(),
          date: getFormattedDate(),
          status: 'approved',
          actionBy: `Approved by Pre-approval (Pass: ${passcode})`,
          phone: '+91 ----- -----',
          flatNumber: invite.flatNumber,
          avatar: require('@/assets/images/avatars/user.png'),
          passcodeUsed: passcode,
        }));
      }

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
        ? require('@/assets/images/avatars/visitor2.png') 
        : require('@/assets/images/avatars/visitor4.png'),
      company: visitorDetails.company,
    };

    dispatch(addVisitorLogEntry(newEntry));

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

    dispatch(setActiveAuthRequest(request));

    return { success: true, requestId };
  };

  // Resident responds to the authorization request popup
  const respondToAuthRequest = (requestId: string, response: 'approved' | 'rejected' | 'left_at_gate') => {
    let actionBy = '';
    if (response === 'approved') actionBy = `Approved by ${user?.name || 'Resident'}`;
    else if (response === 'rejected') actionBy = `Rejected by ${user?.name || 'Resident'}`;
    else if (response === 'left_at_gate') actionBy = `Left at Gate by ${user?.name || 'Resident'}`;

    dispatch(updateVisitorLogStatus({
      id: requestId,
      status: response,
      actionBy,
    }));

    // Clear the active auth request
    dispatch(setActiveAuthRequest(null));
  };

  const clearActiveAuthRequest = () => {
    dispatch(setActiveAuthRequest(null));
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
export { PreApprovedInvite, VisitorLogEntry, AuthRequest, VisitorType, VisitorStatus };
