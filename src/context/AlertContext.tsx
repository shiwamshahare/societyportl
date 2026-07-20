import React, { createContext, useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setAlertConfig, hideAlert as hideAlertAction, AlertButtonConfig } from '@/store/slices/alertSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertContextType = {
  showAlert: (title: string, message?: string, buttons?: AlertButton[]) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType>({} as AlertContextType);

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  // Read config from Redux
  const visible = useSelector((state: RootState) => state.alert.visible);
  const title = useSelector((state: RootState) => state.alert.title);
  const message = useSelector((state: RootState) => state.alert.message);
  const buttonsConfig = useSelector((state: RootState) => state.alert.buttons);

  // Store non-serializable callbacks locally in a ref
  const buttonCallbacksRef = useRef<(() => void)[]>([]);

  const showAlert = (title: string, message?: string, buttons?: AlertButton[]) => {
    // If no buttons, default to a standard close action button
    const resolvedButtons = buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }];

    // Store callbacks in ref
    buttonCallbacksRef.current = resolvedButtons.map(btn => btn.onPress || (() => {}));

    // Dispatch serializable config to Redux
    const serializableButtons: AlertButtonConfig[] = resolvedButtons.map(btn => ({
      text: btn.text,
      style: btn.style,
    }));

    dispatch(
      setAlertConfig({
        title: title || 'Alert',
        message: message || '',
        buttons: serializableButtons,
      })
    );
  };

  const hideAlert = () => {
    dispatch(hideAlertAction());
  };

  // Global patching of both standard alert and Alert.alert
  useEffect(() => {
    try {
      Object.defineProperty(global, 'alert', {
        value: (msg: any) => {
          showAlert('Info', String(msg));
        },
        writable: true,
        configurable: true,
      });
    } catch (e) {
      console.warn('Could not override global.alert:', e);
    }

    const originalAlert = Alert.alert;
    Alert.alert = (t: string, msg?: string, btns?: any[]) => {
      showAlert(t, msg, btns);
    };

    return () => {
      Alert.alert = originalAlert;
    };
  }, []);

  const handleButtonPress = (index: number) => {
    hideAlert();
    const callback = buttonCallbacksRef.current[index];
    if (callback) {
      setTimeout(() => {
        callback();
      }, 150);
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideAlert}
      >
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}
            
            <View style={[
              styles.buttonContainer,
              buttonsConfig && buttonsConfig.length > 2 && styles.buttonContainerStacked
            ]}>
              {buttonsConfig?.map((btn, index) => {
                const isCancel = btn.style === 'cancel' || btn.text.toLowerCase() === 'cancel';
                const isDestructive = btn.style === 'destructive';
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      isCancel ? styles.cancelButton : styles.confirmButton,
                      isDestructive && styles.destructiveButton,
                      buttonsConfig && buttonsConfig.length > 2 && styles.buttonStacked
                    ]}
                    onPress={() => handleButtonPress(index)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      isCancel ? styles.cancelButtonText : styles.confirmButtonText,
                      isDestructive && styles.destructiveButtonText
                    ]}>
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: '#121214',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  buttonContainerStacked: {
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStacked: {
    flex: 0,
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  destructiveButton: {
    backgroundColor: '#EF4444',
  },
  confirmButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  destructiveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
